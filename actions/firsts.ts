"use server";

import { revalidatePath } from "next/cache";
import { getCurrentUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { firsts } from "@/lib/schema";
import { eq } from "drizzle-orm";

export async function createFirst(formData: FormData) {
  const userId = await getCurrentUser();
  if (!userId) throw new Error("Not authenticated");

  const title = formData.get("title") as string;
  const description = formData.get("description") as string;
  const date = formData.get("date") as string;

  if (!title?.trim()) throw new Error("Title is required");

  await db.insert(firsts).values({
    title: title.trim(),
    description: description?.trim() || null,
    date: date || null,
  });

  revalidatePath("/firsts");
}

export async function deleteFirst(id: number) {
  const userId = await getCurrentUser();
  if (!userId) throw new Error("Not authenticated");

  await db.delete(firsts).where(eq(firsts.id, id));
  revalidatePath("/firsts");
}
