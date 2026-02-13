# Phase 7: Settings Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Build the Settings page with 4 sections: Profile (avatar upload), Relationship (start date), Invite Partner, and Mood Presets (custom + default).

**Architecture:** Server-rendered page fetches settings data, delegates to `SettingsView` client component. 4 independent sections as sub-components. Avatar upload reuses R2 presigned URL pattern from timeline. New `MoodPreset` model in Prisma for custom mood presets. `EmojiPicker` on dashboard updated to load presets from DB. Sidebar updated to show real user avatar/mood.

**Tech Stack:** Next.js 16 App Router, Prisma 7 (driver adapter), Cloudflare R2, Tailwind CSS v4, Lucide icons

---

## Task 1: Schema — Add MoodPreset model

**Files:**
- Modify: `prisma/schema.prisma`

**What to do:**

Add `MoodPreset` model after the existing `Mood` model:

```prisma
model MoodPreset {
  id        String   @id @default(cuid())
  emoji     String
  label     String
  isDefault Boolean  @default(false)
  coupleId  String
  createdAt DateTime @default(now())
}
```

Then run `npx prisma migrate dev --name add-mood-preset` to generate migration.

Then run `npx prisma generate` to regenerate the client.

**Commit:** `feat(schema): add MoodPreset model for custom mood presets`

---

## Task 2: Seed default mood presets

**Files:**
- Create: `prisma/seed-moods.ts`

This is a standalone script (not auto-seed) that inserts 6 default MoodPresets for a couple. It will be used manually after deployment. The defaults are:

```typescript
const DEFAULT_MOODS = [
  { emoji: "😊", label: "Счастлив" },
  { emoji: "🥰", label: "Влюблён" },
  { emoji: "😢", label: "Скучаю" },
  { emoji: "😴", label: "Спокоен" },
  { emoji: "🤩", label: "Восторг" },
  { emoji: "💬", label: "Поговорим" },
];
```

**NOTE:** Rather than a seed script, the server actions should auto-seed defaults when `getSettingsData()` finds no presets for the couple. This avoids requiring a separate setup step. Implement this in Task 3.

**Skip this task** — defaults handled in Task 3 server action.

---

## Task 3: Server Actions — Settings

**Files:**
- Create: `src/actions/settings.ts`

**Pattern:** Follow the same auth + couple lookup pattern used in `src/actions/dashboard.ts`, `src/actions/timeline.ts`, etc.

Implement these server actions:

### `getSettingsData()`

Returns: `{ success: true, data: SettingsData } | { error: string }`

SettingsData shape:
```typescript
interface SettingsData {
  user: { id: string; name: string; email: string; avatar: string | null };
  partner: { id: string; name: string } | null;  // null if not joined yet
  coupleStartDate: string;  // ISO string
  inviteToken: string | null;  // null if used or partner joined
  moodPresets: Array<{ id: string; emoji: string; label: string; isDefault: boolean }>;
}
```

Logic:
1. Auth check (session.user.id)
2. Get couple (findFirst where user1Id or user2Id matches)
3. Get partner info if user2Id is set
4. Get mood presets for couple — if none exist, seed 6 defaults and return them
5. Return all data serialized

### `getAvatarUploadUrl(filename: string, contentType: string)`

Returns: `{ success: true, data: { uploadUrl: string; fileUrl: string } } | { error: string }`

Same pattern as `getPresignedUploadUrl` in timeline.ts but with key prefix `avatars/` instead of `photos/`.

Validations:
- Auth check
- contentType must start with `image/`
- filename max 255 chars

### `updateAvatar(avatarUrl: string)`

Returns: `{ success: true } | { error: string }`

Logic:
1. Auth check
2. Validate URL is not empty and length < 2000
3. Update `db.user.update({ where: { id: userId }, data: { avatar: avatarUrl } })`
4. `revalidatePath("/settings")` and `revalidatePath("/")`

### `updateStartDate(dateString: string)`

Returns: `{ success: true } | { error: string }`

Logic:
1. Auth check
2. Parse date, validate not NaN
3. Find couple, check user is member
4. Update `db.couple.update({ where: { id: couple.id }, data: { startDate } })`
5. `revalidatePath("/settings")` and `revalidatePath("/")`

### `generateInviteLink()`

Returns: `{ success: true; data: { token: string } } | { error: string }`

Wraps existing `generateInviteToken` logic but follows the standard return pattern:
1. Auth check
2. Find couple
3. If couple.user2Id is set, return error "Партнёр уже присоединился"
4. Generate UUID, update couple.inviteToken
5. Return token

### `createMoodPreset(emoji: string, label: string)`

Returns: `{ success: true; data: { id: string } } | { error: string }`

Logic:
1. Auth check
2. Validate emoji (1-10 chars) and label (1-50 chars)
3. Find couple
4. Count existing presets for couple — if >= 20, return error
5. Create MoodPreset with coupleId, isDefault: false
6. `revalidatePath("/settings")`

### `deleteMoodPreset(presetId: string)`

Returns: `{ success: true } | { error: string }`

Logic:
1. Auth check
2. Find preset by id
3. If preset.isDefault, return error "Нельзя удалить стандартное настроение"
4. Verify preset belongs to user's couple
5. Delete preset
6. `revalidatePath("/settings")`

**Commit:** `feat(settings): add server actions for settings page`

---

## Task 4: Settings Page — Server Component

**Files:**
- Modify: `src/app/(main)/settings/page.tsx`

Replace placeholder with:

```tsx
import { getSettingsData } from "@/actions/settings";
import { redirect } from "next/navigation";
import { SettingsView } from "@/components/settings/SettingsView";

export const dynamic = "force-dynamic";

export default async function SettingsPage() {
  const result = await getSettingsData();
  if ("error" in result) {
    redirect("/login");
  }
  return <SettingsView data={result.data} />;
}
```

**Commit:** combined with Task 5-8 components

---

## Task 5: Component — SettingsView (main client component)

**Files:**
- Create: `src/components/settings/SettingsView.tsx`

Client component that renders 4 sections with staggered animation:

```
"use client"

import ProfileSection from "./ProfileSection"
import RelationshipSection from "./RelationshipSection"
import InviteSection from "./InviteSection"
import MoodPresetManager from "./MoodPresetManager"

Props: { data: SettingsData }

Layout:
- Page title "Настройки" — text-display-lg, text-text-cream, stagger-1
- 4 sections in a flex column with gap-6
- Each section: paper-texture card, rounded-[var(--radius-lg)], border border-border-light, shadow-card, p-6
- Section headers: text-display-sm, text-text-dark
- Stagger 2-5 for the 4 sections
```

---

## Task 6: Component — ProfileSection (avatar upload)

**Files:**
- Create: `src/components/settings/ProfileSection.tsx`

Client component for avatar upload and name display.

Layout (per visual design doc section 5):
- Header: "Профиль"
- Avatar circle (56px) with current avatar or initials fallback
- "Изменить" button next to avatar — opens file input
- Name displayed as read-only text (not editable, per design doc "имена фиксированы")
- Email displayed as muted text

Upload flow (same as AddMomentModal):
1. Hidden file input, triggered by "Изменить" button
2. On file select: validate image type, max 5MB
3. Call `getAvatarUploadUrl` server action
4. PUT file to presigned URL
5. Call `updateAvatar` with the public file URL
6. Show new avatar immediately via local state

**Commit:** combined with other components

---

## Task 7: Component — RelationshipSection

**Files:**
- Create: `src/components/settings/RelationshipSection.tsx`

Client component with date input.

Layout:
- Header: "Отношения"
- Label: "Дата начала"
- Date input with current startDate
- "Сохранить" button (primary variant, only enabled when date changed)
- Success/error feedback

Calls `updateStartDate` on save.

---

## Task 8: Component — InviteSection

**Files:**
- Create: `src/components/settings/InviteSection.tsx`

Client component for invite management.

Layout:
- Header: "Пригласить партнёра"
- If partner exists: "Партнёр подключён ✓" with partner name, green accent
- If no partner:
  - "Создать ссылку-приглашение" button (primary)
  - When clicked: call `generateInviteLink`, show generated URL
  - URL displayed in mono font, surface-secondary background, with copy button
  - "Ссылка одноразовая" note below

Copy to clipboard: `navigator.clipboard.writeText(url)`

---

## Task 9: Component — MoodPresetManager

**Files:**
- Create: `src/components/settings/MoodPresetManager.tsx`

Client component for mood preset management.

Layout (per visual design doc):
- Header: "Настроения"
- Grid of chips: each chip shows emoji + label
  - Chip style: surface-secondary bg, border-light border, radius-md, px-3 py-2
  - Hover: border-accent-gold
  - Default chips: no delete button
  - Custom chips: small "×" button, hover text-accent-rose
- "+ Добавить настроение" button at the end
- On click "+" button: inline mini-form appears (emoji input + label input + confirm)

Actions:
- `createMoodPreset(emoji, label)` on add
- `deleteMoodPreset(id)` on delete (custom only)

---

## Task 10: Update EmojiPicker to use DB presets

**Files:**
- Modify: `src/components/dashboard/EmojiPicker.tsx`
- Modify: `src/components/dashboard/MoodSection.tsx` (or wherever EmojiPicker gets its data)
- Modify: `src/actions/dashboard.ts`

Currently `EmojiPicker` uses hardcoded `MOODS` array. Update to:

1. In `getDashboardData()`: add `moodPresets` to the returned data by querying `db.moodPreset.findMany({ where: { coupleId } })`. If no presets exist, seed defaults (same logic as settings).

2. Pass `moodPresets` as prop to `EmojiPicker` instead of using hardcoded array.

3. In `EmojiPicker`: accept `presets: Array<{ emoji: string; label: string }>` prop. Map presets to the grid. Keep the same UI pattern but with dynamic data. Color mapping: use a default color for custom presets (accent-gold) since we don't store colors.

**Commit:** `feat(dashboard): load mood presets from DB`

---

## Task 11: Update Sidebar to show real user data

**Files:**
- Modify: `src/components/layout/Sidebar.tsx`
- Modify: `src/app/(main)/layout.tsx`

Currently sidebar shows "?" placeholder and "Пользователь" text.

In `layout.tsx`: fetch current user data (name, avatar, latest mood) via a lightweight server action or direct DB query, pass as props.

In `Sidebar.tsx`:
- Accept `user: { name: string; avatar: string | null; mood: { emoji: string } | null }` prop
- Show avatar image if exists (40px circle, border-border-dark), initials fallback
- Show user name
- Show current mood emoji if exists

**Commit:** `feat(layout): show real user data in sidebar`

---

## Task 12: CSS additions

**Files:**
- Modify: `src/app/globals.css`

Add Settings-specific animations:

```css
/* Settings */
@keyframes settingsCardEnter {
  from {
    opacity: 0;
    transform: translateY(12px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.settings-card-enter {
  animation: settingsCardEnter 400ms var(--ease-smooth) both;
}

.chip {
  transition: border-color var(--duration-fast) var(--ease-smooth),
              transform var(--duration-fast) var(--ease-smooth);
}

.chip:hover {
  border-color: var(--color-accent-gold);
  transform: scale(1.03);
}
```

**Commit:** combined with settings components

---

## Task 13: Build verification + code review

Run `npm run build` and fix any TypeScript/build errors.

**Commit:** `Phase 7` (final commit with all settings code)

---

## Summary of new files

```
prisma/schema.prisma                          # MoodPreset model added
prisma/migrations/XXXXXX_add_mood_preset/     # Auto-generated migration
src/actions/settings.ts                        # 7 server actions
src/components/settings/SettingsView.tsx        # Main client component
src/components/settings/ProfileSection.tsx      # Avatar upload + name
src/components/settings/RelationshipSection.tsx # Start date editor
src/components/settings/InviteSection.tsx       # Invite link management
src/components/settings/MoodPresetManager.tsx   # Mood preset chips
src/app/(main)/settings/page.tsx               # Updated from placeholder
src/app/globals.css                            # Settings CSS additions
src/components/dashboard/EmojiPicker.tsx        # Updated to use DB presets
src/components/layout/Sidebar.tsx              # Updated to show real user data
src/app/(main)/layout.tsx                      # Pass user data to Sidebar
src/actions/dashboard.ts                       # Add moodPresets to dashboard data
```

## Agent Team Structure

- **agent-schema**: Task 1 (schema + migration)
- **agent-actions**: Task 3 (server actions) — depends on Task 1
- **agent-components**: Tasks 4-9, 12 (settings page + all components + CSS) — depends on Task 3
- **agent-integrations**: Tasks 10-11 (EmojiPicker + Sidebar updates) — depends on Task 1
- **agent-reviewer**: Task 13 (build + code review) — depends on all
