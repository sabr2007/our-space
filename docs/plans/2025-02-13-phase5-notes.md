# Phase 5: Записки (Notes) — Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Build the Notes feature — write, send, and read love letters between two partners, with sent/received tabs, unread indicators, and letter-style display.

**Architecture:** Server-rendered page fetches all notes via server action, passes to a client component that manages tabs (sent/received), note selection, compose modal, and mark-as-read. The Note model already exists in Prisma. Follow the exact same patterns as Dashboard and Timeline phases.

**Tech Stack:** Next.js 16 App Router, Server Actions, Prisma 7, React 19, Tailwind CSS v4, Lucide React icons

---

## Task 1: Server Actions (`src/actions/notes.ts`)

**Files:**
- Create: `src/actions/notes.ts`

**What to build:**
Server actions for the notes feature. Follow the exact pattern from `src/actions/dashboard.ts` — auth check, couple lookup, partner resolution, try/catch, return `{ success: true, data } | { error: string }`.

**Implementation:**

```typescript
"use server";

import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";

interface NoteItem {
  id: string;
  content: string;
  isRead: boolean;
  createdAt: string;
  author: { id: string; name: string };
  recipient: { id: string; name: string };
}

interface NotesData {
  sent: NoteItem[];
  received: NoteItem[];
  partnerName: string;
}

export async function getNotes(): Promise<
  { success: true; data: NotesData } | { error: string }
> {
  const session = await auth();
  if (!session?.user?.id) {
    return { error: "Необходимо войти в аккаунт" };
  }

  const userId = session.user.id;

  const couple = await db.couple.findFirst({
    where: { OR: [{ user1Id: userId }, { user2Id: userId }] },
  });

  if (!couple) return { error: "Пара не найдена" };

  const partnerId = couple.user1Id === userId ? couple.user2Id : couple.user1Id;
  if (!partnerId) return { error: "Партнёр ещё не зарегистрирован" };

  const partner = await db.user.findUnique({
    where: { id: partnerId },
    select: { name: true },
  });

  if (!partner) return { error: "Партнёр не найден" };

  const selectFields = {
    id: true,
    content: true,
    isRead: true,
    createdAt: true,
    author: { select: { id: true, name: true } },
    recipient: { select: { id: true, name: true } },
  } as const;

  try {
    const [sent, received] = await Promise.all([
      db.note.findMany({
        where: { authorId: userId },
        orderBy: { createdAt: "desc" },
        select: selectFields,
      }),
      db.note.findMany({
        where: { recipientId: userId },
        orderBy: { createdAt: "desc" },
        select: selectFields,
      }),
    ]);

    const serialize = (notes: typeof sent): NoteItem[] =>
      notes.map((n) => ({ ...n, createdAt: n.createdAt.toISOString() }));

    return {
      success: true,
      data: {
        sent: serialize(sent),
        received: serialize(received),
        partnerName: partner.name,
      },
    };
  } catch {
    return { error: "Не удалось загрузить записки" };
  }
}

export async function createNote(
  content: string
): Promise<{ success: true } | { error: string }> {
  const session = await auth();
  if (!session?.user?.id) {
    return { error: "Необходимо войти в аккаунт" };
  }

  const trimmed = content.trim();
  if (!trimmed || trimmed.length > 5000) {
    return { error: "Записка должна содержать от 1 до 5000 символов" };
  }

  const userId = session.user.id;

  const couple = await db.couple.findFirst({
    where: { OR: [{ user1Id: userId }, { user2Id: userId }] },
  });

  if (!couple) return { error: "Пара не найдена" };

  const partnerId = couple.user1Id === userId ? couple.user2Id : couple.user1Id;
  if (!partnerId) return { error: "Партнёр ещё не зарегистрирован" };

  try {
    await db.note.create({
      data: {
        content: trimmed,
        authorId: userId,
        recipientId: partnerId,
      },
    });

    revalidatePath("/notes");
    revalidatePath("/");
    return { success: true };
  } catch {
    return { error: "Не удалось отправить записку" };
  }
}

export async function markNoteAsRead(
  noteId: string
): Promise<{ success: true } | { error: string }> {
  const session = await auth();
  if (!session?.user?.id) {
    return { error: "Необходимо войти в аккаунт" };
  }

  if (!noteId) return { error: "Некорректный ID записки" };

  try {
    const note = await db.note.findUnique({
      where: { id: noteId },
      select: { recipientId: true, isRead: true },
    });

    if (!note) return { error: "Записка не найдена" };
    if (note.recipientId !== session.user.id) {
      return { error: "Нет доступа к этой записке" };
    }
    if (note.isRead) return { success: true };

    await db.note.update({
      where: { id: noteId },
      data: { isRead: true },
    });

    revalidatePath("/notes");
    revalidatePath("/");
    return { success: true };
  } catch {
    return { error: "Не удалось обновить записку" };
  }
}
```

---

## Task 2: Note Composer Modal (`src/components/notes/NoteComposer.tsx`)

**Files:**
- Create: `src/components/notes/NoteComposer.tsx`

**What to build:**
Modal for writing a new note to the partner. Follow the exact modal pattern from `src/components/timeline/AddMomentModal.tsx` — overlay with backdrop-blur, Escape to close, body scroll lock, form with submit.

The textarea should use the `.notebook-lines` CSS class (already exists in globals.css) for a notebook-like appearance. Use PT Serif (font-body) for the text, min-height 240px.

**Key details from visual design:**
- Title: "Новая записка для {partnerName}" — `text-display-md text-text-dark`
- Textarea: `bg-surface-primary`, notebook-lines, font-body, 18px, min-h 240px
- Placeholder: "Напиши что-нибудь тёплое..." italic
- Submit button: "Отправить записку" — primary button
- Char count: /5000, shown in corner

**Props:** `{ isOpen, onClose, onSuccess, partnerName }`

---

## Task 3: Note View Component (`src/components/notes/NoteView.tsx`)

**Files:**
- Create: `src/components/notes/NoteView.tsx`

**What to build:**
Full letter-style view of a single note. Displayed inline (not modal) when a note is selected. Uses `noteUnfold` animation (already exists in globals.css).

**Key details from visual design:**
- Card: `bg-surface-primary paper-texture rounded-[var(--radius-lg)]`
- Back button: "← Назад к запискам" — ghost button style, `text-accent-gold`
- Content: `text-body-lg text-text-dark` (PT Serif, 18px, line-height 1.7)
- Author signature: `text-hand-lg text-accent-rose` — "С любовью, {authorName}" (Caveat font)
- Date: `text-ui-sm text-text-muted-dark` — formatted in Russian
- Divider: thin line `border-border-light` above the date
- Animation: `noteUnfold 400ms ease-smooth both`
- When opened (if received & unread): call `markNoteAsRead(noteId)` server action

**Props:**
```typescript
interface NoteViewProps {
  note: NoteItem;
  currentUserId: string;
  onBack: () => void;
}
```

---

## Task 4: Notes List Component (`src/components/notes/NotesList.tsx`)

**Files:**
- Create: `src/components/notes/NotesList.tsx`

**What to build:**
Main client component that manages the notes feature UI. Contains:
1. Header with title and "Написать" button
2. Tabs: "Полученные" / "Отправленные" — `text-ui-md font-ui`
3. List of note previews (NoteCard inline, not separate file — keep simple)
4. Selected note view (NoteView)
5. Empty state when no notes
6. NoteComposer modal

**Tab design from visual doc:**
- Active tab: gold underline (border-bottom 2px `accent-gold`), `text-text-cream`
- Inactive tab: `text-text-muted-light`, hover `text-text-cream`

**Note card preview in list (inline, no separate component needed):**
- Card: `bg-surface-primary paper-texture rounded-[var(--radius-lg)] border border-border-light p-5`
- Unread: `border-l-[3px] border-l-accent-gold` + gold glow shadow
- Read: no left border emphasis, slightly muted
- Author/recipient name: `text-body-md text-text-dark font-medium`
- Date: `text-ui-sm text-text-muted-dark` — right aligned
- Content preview: `text-body-sm text-text-muted-dark` — first 100 chars, truncated
- Icon: Mail or MailOpen from lucide-react
- Hover: card lift (already via `.card` class)
- Click: select note → show NoteView

**Empty state:**
- Icon: `Mail` lucide, 48px, `text-text-muted-light`
- Text: "Пока нет записок" — `text-display-sm text-text-muted-light`
- Subtext: appropriate message based on tab
- CTA button on received tab only

**Props:**
```typescript
interface NotesListProps {
  sent: NoteItem[];
  received: NoteItem[];
  partnerName: string;
  currentUserId: string;
}
```

**State management:**
- `activeTab`: "received" | "sent" (default: "received")
- `selectedNote`: NoteItem | null
- `composerOpen`: boolean

---

## Task 5: Notes Page (`src/app/(main)/notes/page.tsx`)

**Files:**
- Modify: `src/app/(main)/notes/page.tsx`

**What to build:**
Replace placeholder with server component. Follow exact pattern from `src/app/(main)/timeline/page.tsx`:
- `export const dynamic = "force-dynamic"`
- Auth check → redirect if not logged in
- Fetch data via `getNotes()` server action
- Error display if fetch fails
- Render `NotesList` with data

```typescript
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { getNotes } from "@/actions/notes";
import { NotesList } from "@/components/notes/NotesList";

export const dynamic = "force-dynamic";

export default async function NotesPage() {
  const session = await auth();
  if (!session?.user) {
    redirect("/login");
  }

  const result = await getNotes();

  if ("error" in result) {
    return (
      <div className="py-12">
        <h1 className="text-display-lg text-text-cream mb-4">Записки</h1>
        <p className="text-body-md text-text-muted-light">{result.error}</p>
      </div>
    );
  }

  return (
    <NotesList
      sent={result.data.sent}
      received={result.data.received}
      partnerName={result.data.partnerName}
      currentUserId={session.user.id}
    />
  );
}
```

---

## Task 6: CSS Additions (`src/app/globals.css`)

**Files:**
- Modify: `src/app/globals.css`

**What to add (at the end, in a new Notes section):**

```css
/* =========================================================================
   Notes
   ========================================================================= */

.note-card-enter {
  animation: noteUnfold 400ms var(--ease-smooth) both;
}

.badge-unread {
  animation: unreadPulse 2s ease-in-out infinite;
}
```

The `noteUnfold` and `unreadPulse` keyframes already exist. We just need the utility classes.

---

## Task Dependencies

```
Task 1 (Server Actions) ──┐
Task 6 (CSS)              ├── Task 4 (NotesList) ── Task 5 (Page)
Task 2 (NoteComposer)     │
Task 3 (NoteView)  ───────┘
```

**Parallel work possible:**
- Task 1 + Task 6 + Task 2 + Task 3 can all be built in parallel
- Task 4 needs Tasks 2 and 3 to be done (imports them)
- Task 5 needs Tasks 1 and 4 to be done

---

## Verification

After all tasks complete:
1. `npm run build` must pass with zero errors
2. Notes page should render with sent/received tabs
3. Compose modal should open and close properly
4. Note selection should show letter-style view with unfold animation
5. Unread notes should have gold left border indicator
6. Dashboard unread count should link to notes page (already works)
