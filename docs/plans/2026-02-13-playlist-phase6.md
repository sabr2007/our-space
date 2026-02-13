# Phase 6: Playlist (Music) Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Implement the shared playlist feature — add, view, and delete songs with personal comments.

**Architecture:** Server Actions for CRUD, server component page with `force-dynamic`, single client component `PlaylistView` managing state (list + add modal). Follows existing patterns from Notes phase.

**Tech Stack:** Next.js 16 App Router, Prisma 7 (PlaylistItem model already exists), React 19, Tailwind CSS v4, Lucide icons.

---

### Task 1: Server Actions (`src/actions/playlist.ts`)

**Files:**
- Create: `src/actions/playlist.ts`

**What to build:**

Three server actions following the exact pattern from `src/actions/notes.ts`:

1. **`getPlaylistItems()`** — returns all songs for the couple, ordered by `createdAt desc`, with `addedBy` user info (name), plus total count. Auth check → couple lookup → query.

2. **`createPlaylistItem(data: { title, artist?, url, comment? })`** — validates inputs (title 1-200 chars, url 1-500 chars, artist 0-200, comment 0-1000), creates record with `addedById = session.user.id`. Revalidates `/playlist` and `/`.

3. **`deletePlaylistItem(id: string)`** — checks that the item exists AND that `addedById === session.user.id` (only author can delete). Revalidates `/playlist`.

**Return types:** `{ success: true; data: ... } | { error: string }`

**Data interface:**
```typescript
interface PlaylistItemData {
  id: string;
  title: string;
  artist: string | null;
  url: string;
  comment: string | null;
  createdAt: string; // ISO string
  addedBy: { id: string; name: string };
}
```

---

### Task 2: CSS Additions (`src/app/globals.css`)

**Files:**
- Modify: `src/app/globals.css` (append at end)

**What to add:**

```css
/* =========================================================================
   Playlist
   ========================================================================= */

@keyframes songCardSlide {
  from {
    opacity: 0;
    transform: translateX(-12px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

.song-card-enter {
  animation: songCardSlide 400ms var(--ease-smooth) both;
}
```

---

### Task 3: SongCard Component (`src/components/playlist/SongCard.tsx`)

**Files:**
- Create: `src/components/playlist/SongCard.tsx`

**What to build:**

A `"use client"` component rendering one playlist song card. Props: `PlaylistItemData` + `isOwner: boolean` + `onDelete: (id) => void`.

**Visual structure (from visual design doc):**
- Card: `paper-texture`, `rounded-[var(--radius-lg)]`, `border border-border-light`, `shadow-[var(--shadow-card)]`, `card` hover class
- Left: music icon (♫ / `Music` from lucide) in `text-accent-gold`, 24px
- Title: `text-body-lg font-medium text-text-dark`
- Artist: `text-body-md text-text-muted-dark` (show "—" if no artist)
- Comment: `text-hand-md italic text-accent-rose` wrapped in decorative quotes (large `"` chars, `text-accent-rose/30`)
- Meta row: `text-ui-sm text-text-muted-dark` — "Добавил(а) {name} · {relative time}"
- External link: `ExternalLink` icon, `text-accent-gold hover:text-accent-gold-light`, opens in new tab
- Delete button: `Trash2` icon, only shown if `isOwner`, `text-text-muted-dark hover:text-accent-rose`

**Date formatting:** Use relative Russian time (function from existing code pattern): "только что", "X минут назад", "X часов назад", "вчера", "X дней назад", full date for older.

---

### Task 4: AddSongModal Component (`src/components/playlist/AddSongModal.tsx`)

**Files:**
- Create: `src/components/playlist/AddSongModal.tsx`

**What to build:**

Modal following exact pattern from `src/components/notes/NoteComposer.tsx`:
- Overlay: `bg-bg-deep/85 backdrop-blur-[8px]`, click outside to close
- Container: `modal-enter`, `bg-surface-primary`, `rounded-[var(--radius-xl)]`
- Title: "Добавить песню" — `text-display-md text-text-dark`
- Close button: X icon top-right
- Escape to close, body scroll lock
- Loading protection (no close while submitting)

**Form fields:**
1. Title (required): Input, placeholder "Название песни"
2. Artist (optional): Input, placeholder "Исполнитель"
3. URL (required): Input, placeholder "Ссылка на Spotify, YouTube..."
4. Comment (optional): Textarea 3 rows, placeholder "Почему эта песня важна для вас?", notebook-lines style, Caveat font

**Use existing `Input` component from `src/components/ui/Input.tsx`** for text fields.
**Submit button:** "Добавить в плейлист" with music note emoji.

Props: `isOpen, onClose, onSuccess`.
Calls `createPlaylistItem` server action.

---

### Task 5: PlaylistView Component (`src/components/playlist/PlaylistView.tsx`)

**Files:**
- Create: `src/components/playlist/PlaylistView.tsx`

**What to build:**

Main client component for the playlist page. Props: `items: PlaylistItemData[]`, `totalCount: number`, `currentUserId: string`.

**Structure:**
- Header row: `stagger-1`, "Наша музыка" (`text-display-lg text-text-cream`) + Button "Добавить" with `Plus` icon
- Count subtitle: `stagger-2`, "{N} песен в коллекции" (`text-ui-sm text-text-muted-light`). Use Russian pluralization: "песня/песни/песен".
- Song list: `stagger-3`, `space-y-3`, maps items → `SongCard` with staggered `song-card-enter` animation (delay = index * 60ms)
- Empty state: music icon (48px, muted), "Плейлист пуст", "Добавьте первую песню — ту, что значит для вас что-то особенное", Button "Добавить песню"
- AddSongModal: controlled by `modalOpen` state
- Delete handler: calls `deletePlaylistItem`, then `router.refresh()`

**Russian pluralization for songs:** 1 → "песня", 2-4 → "песни", 5-20 → "песен", 21 → "песня", etc. (same pattern as relationship counter).

---

### Task 6: Playlist Page (`src/app/(main)/playlist/page.tsx`)

**Files:**
- Modify: `src/app/(main)/playlist/page.tsx`

**What to build:**

Server component replacing the placeholder. Follows exact pattern from `src/app/(main)/notes/page.tsx`:

```typescript
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { getPlaylistItems } from "@/actions/playlist";
import { PlaylistView } from "@/components/playlist/PlaylistView";

export const dynamic = "force-dynamic";

export default async function PlaylistPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const result = await getPlaylistItems();

  if ("error" in result) {
    return (
      <div className="py-12">
        <h1 className="text-display-lg text-text-cream mb-4">Наша музыка</h1>
        <p className="text-body-md text-text-muted-light">{result.error}</p>
      </div>
    );
  }

  return (
    <PlaylistView
      items={result.data.items}
      totalCount={result.data.totalCount}
      currentUserId={session.user.id}
    />
  );
}
```

---

### Task 7: Code Review

Run `superpowers:requesting-code-review` to validate all changes against the plan, design docs, and existing code patterns. Check:
- Build passes (`npm run build`)
- All server actions have proper auth, validation, try/catch
- No security issues (ownership checks on delete)
- Visual design matches spec
- Responsive behavior
- Animation classes work
- Russian text is correct
