"use server";

import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";

interface PlaylistItemData {
  id: string;
  title: string;
  artist: string | null;
  url: string;
  comment: string | null;
  createdAt: string;
  addedBy: { id: string; name: string };
}

export async function getPlaylistItems(): Promise<
  { success: true; data: { items: PlaylistItemData[]; totalCount: number } } | { error: string }
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

  try {
    const items = await db.playlistItem.findMany({
      where: {
        addedById: { in: [couple.user1Id, couple.user2Id].filter(Boolean) as string[] },
      },
      orderBy: { createdAt: "desc" },
      include: { addedBy: { select: { id: true, name: true } } },
    });

    const serialized: PlaylistItemData[] = items.map((item) => ({
      id: item.id,
      title: item.title,
      artist: item.artist,
      url: item.url,
      comment: item.comment,
      createdAt: item.createdAt.toISOString(),
      addedBy: item.addedBy,
    }));

    return {
      success: true,
      data: { items: serialized, totalCount: items.length },
    };
  } catch {
    return { error: "Не удалось загрузить плейлист" };
  }
}

export async function createPlaylistItem(data: {
  title: string;
  artist?: string;
  url: string;
  comment?: string;
}): Promise<{ success: true } | { error: string }> {
  const session = await auth();
  if (!session?.user?.id) {
    return { error: "Необходимо войти в аккаунт" };
  }

  const title = data.title.trim();
  const artist = data.artist?.trim() || null;
  const url = data.url.trim();
  const comment = data.comment?.trim() || null;

  if (!title || title.length > 200) {
    return { error: "Название должно содержать от 1 до 200 символов" };
  }
  if (!url || url.length > 500) {
    return { error: "Ссылка должна содержать от 1 до 500 символов" };
  }
  if (!/^https?:\/\//i.test(url)) {
    return { error: "Ссылка должна начинаться с http:// или https://" };
  }
  if (artist && artist.length > 200) {
    return { error: "Имя исполнителя не должно превышать 200 символов" };
  }
  if (comment && comment.length > 1000) {
    return { error: "Комментарий не должен превышать 1000 символов" };
  }

  try {
    await db.playlistItem.create({
      data: {
        title,
        artist,
        url,
        comment,
        addedById: session.user.id,
      },
    });

    revalidatePath("/playlist");
    revalidatePath("/");
    return { success: true };
  } catch {
    return { error: "Не удалось добавить трек" };
  }
}

export async function deletePlaylistItem(
  id: string
): Promise<{ success: true } | { error: string }> {
  const session = await auth();
  if (!session?.user?.id) {
    return { error: "Необходимо войти в аккаунт" };
  }

  if (!id) return { error: "Некорректный ID трека" };

  try {
    const item = await db.playlistItem.findUnique({
      where: { id },
      select: { addedById: true },
    });

    if (!item) return { error: "Трек не найден" };
    if (item.addedById !== session.user.id) {
      return { error: "Можно удалять только свои треки" };
    }

    await db.playlistItem.delete({ where: { id } });

    revalidatePath("/playlist");
    return { success: true };
  } catch {
    return { error: "Не удалось удалить трек" };
  }
}
