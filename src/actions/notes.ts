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
