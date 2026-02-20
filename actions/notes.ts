"use server";

import { revalidatePath } from "next/cache";
import { getCurrentUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { notes } from "@/lib/schema";
import { eq, and } from "drizzle-orm";

export async function createNote(formData: FormData) {
  const userId = await getCurrentUser();
  if (!userId) throw new Error("Not authenticated");

  const content = formData.get("content") as string;
  if (!content?.trim()) throw new Error("Content is required");

  await db.insert(notes).values({
    content: content.trim(),
    authorId: userId,
  });

  revalidatePath("/notes");
}

export async function markNoteAsRead(noteId: number) {
  const userId = await getCurrentUser();
  if (!userId) throw new Error("Not authenticated");

  // Only mark as read if it's addressed to this user (not authored by them)
  const [note] = await db.select().from(notes).where(eq(notes.id, noteId));
  if (!note) return;
  if (note.authorId === userId) return; // Can't mark own notes as read

  await db.update(notes).set({ isRead: 1 }).where(eq(notes.id, noteId));
  revalidatePath("/notes");
}

export async function deleteNote(noteId: number) {
  const userId = await getCurrentUser();
  if (!userId) throw new Error("Not authenticated");

  // Only delete own notes
  await db.delete(notes).where(
    and(eq(notes.id, noteId), eq(notes.authorId, userId))
  );
  revalidatePath("/notes");
}
