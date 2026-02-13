"use server";

import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { s3, R2_BUCKET } from "@/lib/s3";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { revalidatePath } from "next/cache";
import crypto from "crypto";

interface TimelinePhoto {
  id: string;
  url: string;
  thumbnail: string | null;
  description: string | null;
  eventDate: string;
  createdAt: string;
  author: {
    id: string;
    name: string;
  };
}

export async function getTimelinePhotos(): Promise<
  { success: true; data: TimelinePhoto[] } | { error: string }
> {
  const session = await auth();
  if (!session?.user?.id) {
    return { error: "Необходимо войти в аккаунт" };
  }

  const userId = session.user.id;

  const couple = await db.couple.findFirst({
    where: {
      OR: [{ user1Id: userId }, { user2Id: userId }],
    },
  });

  if (!couple) {
    return { error: "Пара не найдена" };
  }

  const partnerId =
    couple.user1Id === userId ? couple.user2Id : couple.user1Id;

  if (!partnerId) {
    return { error: "Партнёр ещё не зарегистрирован" };
  }

  try {
    const photos = await db.photo.findMany({
      where: {
        authorId: { in: [userId, partnerId] },
      },
      orderBy: { eventDate: "desc" },
      select: {
        id: true,
        url: true,
        thumbnail: true,
        description: true,
        eventDate: true,
        createdAt: true,
        author: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    const serialized: TimelinePhoto[] = photos.map((photo) => ({
      ...photo,
      eventDate: photo.eventDate.toISOString(),
      createdAt: photo.createdAt.toISOString(),
    }));

    return { success: true, data: serialized };
  } catch {
    return { error: "Не удалось загрузить фотографии" };
  }
}

export async function createPhoto(data: {
  url: string;
  thumbnail?: string;
  description?: string;
  eventDate: string;
}): Promise<{ success: true; data: { id: string } } | { error: string }> {
  const session = await auth();
  if (!session?.user?.id) {
    return { error: "Необходимо войти в аккаунт" };
  }

  if (!data.url) {
    return { error: "URL фотографии обязателен" };
  }

  if (!data.eventDate) {
    return { error: "Дата события обязательна" };
  }

  if (data.description && data.description.length > 500) {
    return { error: "Описание не должно превышать 500 символов" };
  }

  const eventDate = new Date(data.eventDate);
  if (isNaN(eventDate.getTime())) {
    return { error: "Некорректная дата события" };
  }

  try {
    const photo = await db.photo.create({
      data: {
        url: data.url,
        thumbnail: data.thumbnail || null,
        description: data.description || null,
        eventDate,
        authorId: session.user.id,
      },
    });

    revalidatePath("/timeline");
    revalidatePath("/");

    return { success: true, data: { id: photo.id } };
  } catch {
    return { error: "Не удалось сохранить фотографию" };
  }
}

export async function getPresignedUploadUrl(
  filename: string,
  contentType: string
): Promise<
  | { success: true; data: { uploadUrl: string; fileUrl: string; key: string } }
  | { error: string }
> {
  const session = await auth();
  if (!session?.user?.id) {
    return { error: "Необходимо войти в аккаунт" };
  }

  if (!contentType.startsWith("image/")) {
    return { error: "Допускаются только изображения" };
  }

  if (!filename || filename.length > 255) {
    return { error: "Некорректное имя файла" };
  }

  const sanitizedFilename = filename.replace(/[^a-zA-Z0-9._-]/g, "_");
  const uniqueId = crypto.randomUUID();
  const key = `photos/${uniqueId}-${sanitizedFilename}`;

  try {
    const command = new PutObjectCommand({
      Bucket: R2_BUCKET,
      Key: key,
      ContentType: contentType,
    });

    const uploadUrl = await getSignedUrl(s3, command, { expiresIn: 900 });

    const publicUrl = process.env.R2_PUBLIC_URL;
    const fileUrl = publicUrl ? `${publicUrl}/${key}` : key;

    return {
      success: true,
      data: { uploadUrl, fileUrl, key },
    };
  } catch {
    return { error: "Не удалось создать ссылку для загрузки" };
  }
}
