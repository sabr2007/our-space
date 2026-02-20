"use server";

import { revalidatePath } from "next/cache";
import { getCurrentUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { events } from "@/lib/schema";
import { eq, desc } from "drizzle-orm";

export async function getEvents() {
  return db.select().from(events).orderBy(desc(events.date));
}

export async function createEvent(formData: FormData) {
  const userId = await getCurrentUser();
  if (!userId) throw new Error("Not authenticated");

  const title = formData.get("title") as string;
  const description = formData.get("description") as string;
  const date = formData.get("date") as string;
  const photoUrl = formData.get("photoUrl") as string;

  if (!title || !date) throw new Error("Title and date are required");

  await db.insert(events).values({
    title,
    description: description || null,
    date,
    photoUrl: photoUrl || null,
    createdBy: userId,
  });

  revalidatePath("/timeline");
}

export async function deleteEvent(id: number) {
  const userId = await getCurrentUser();
  if (!userId) throw new Error("Not authenticated");

  await db.delete(events).where(eq(events.id, id));
  revalidatePath("/timeline");
}
