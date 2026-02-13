"use server";

import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { s3, R2_BUCKET } from "@/lib/s3";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { revalidatePath } from "next/cache";
import crypto from "crypto";

const DEFAULT_MOODS = [
  { emoji: "😊", label: "Счастлив" },
  { emoji: "🥰", label: "Влюблён" },
  { emoji: "😢", label: "Скучаю" },
  { emoji: "😴", label: "Спокоен" },
  { emoji: "🤩", label: "Восторг" },
  { emoji: "💬", label: "Поговорим" },
];

export interface SettingsData {
  user: { id: string; name: string; email: string; avatar: string | null };
  partner: { id: string; name: string } | null;
  coupleStartDate: string;
  inviteToken: string | null;
  moodPresets: Array<{
    id: string;
    emoji: string;
    label: string;
    isDefault: boolean;
  }>;
}

export async function getSettingsData(): Promise<
  { success: true; data: SettingsData } | { error: string }
> {
  const session = await auth();
  if (!session?.user?.id) {
    return { error: "Необходимо войти в аккаунт" };
  }

  const userId = session.user.id;

  try {
    const user = await db.user.findUnique({
      where: { id: userId },
      select: { id: true, name: true, email: true, avatar: true },
    });

    if (!user) {
      return { error: "Пользователь не найден" };
    }

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

    let partner: { id: string; name: string } | null = null;
    if (partnerId) {
      partner = await db.user.findUnique({
        where: { id: partnerId },
        select: { id: true, name: true },
      });
    }

    let moodPresets = await db.moodPreset.findMany({
      where: { coupleId: couple.id },
      select: { id: true, emoji: true, label: true, isDefault: true },
      orderBy: { createdAt: "asc" },
    });

    if (moodPresets.length === 0) {
      await db.moodPreset.createMany({
        data: DEFAULT_MOODS.map((mood) => ({
          emoji: mood.emoji,
          label: mood.label,
          isDefault: true,
          coupleId: couple.id,
        })),
      });

      moodPresets = await db.moodPreset.findMany({
        where: { coupleId: couple.id },
        select: { id: true, emoji: true, label: true, isDefault: true },
        orderBy: { createdAt: "asc" },
      });
    }

    return {
      success: true,
      data: {
        user,
        partner,
        coupleStartDate: couple.startDate.toISOString(),
        inviteToken: couple.inviteToken,
        moodPresets,
      },
    };
  } catch {
    return { error: "Не удалось загрузить настройки" };
  }
}

export async function getAvatarUploadUrl(
  filename: string,
  contentType: string
): Promise<
  | { success: true; data: { uploadUrl: string; fileUrl: string } }
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
  const key = `avatars/${uniqueId}-${sanitizedFilename}`;

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
      data: { uploadUrl, fileUrl },
    };
  } catch {
    return { error: "Не удалось создать ссылку для загрузки" };
  }
}

export async function updateAvatar(
  avatarUrl: string
): Promise<{ success: true } | { error: string }> {
  const session = await auth();
  if (!session?.user?.id) {
    return { error: "Необходимо войти в аккаунт" };
  }

  if (!avatarUrl || avatarUrl.length > 2000) {
    return { error: "Некорректный URL аватара" };
  }

  try {
    const parsed = new URL(avatarUrl);
    if (parsed.protocol !== "https:" && parsed.protocol !== "http:") {
      return { error: "Некорректный URL аватара" };
    }
  } catch {
    return { error: "Некорректный URL аватара" };
  }

  try {
    await db.user.update({
      where: { id: session.user.id },
      data: { avatar: avatarUrl },
    });

    revalidatePath("/settings");
    revalidatePath("/");

    return { success: true };
  } catch {
    return { error: "Не удалось обновить аватар" };
  }
}

export async function updateStartDate(
  dateString: string
): Promise<{ success: true } | { error: string }> {
  const session = await auth();
  if (!session?.user?.id) {
    return { error: "Необходимо войти в аккаунт" };
  }

  const startDate = new Date(dateString);
  if (isNaN(startDate.getTime())) {
    return { error: "Некорректная дата" };
  }

  const userId = session.user.id;

  try {
    const couple = await db.couple.findFirst({
      where: {
        OR: [{ user1Id: userId }, { user2Id: userId }],
      },
    });

    if (!couple) {
      return { error: "Пара не найдена" };
    }

    await db.couple.update({
      where: { id: couple.id },
      data: { startDate },
    });

    revalidatePath("/settings");
    revalidatePath("/");

    return { success: true };
  } catch {
    return { error: "Не удалось обновить дату" };
  }
}

export async function generateInviteLink(): Promise<
  { success: true; data: { token: string } } | { error: string }
> {
  const session = await auth();
  if (!session?.user?.id) {
    return { error: "Необходимо войти в аккаунт" };
  }

  const userId = session.user.id;

  try {
    const couple = await db.couple.findFirst({
      where: {
        OR: [{ user1Id: userId }, { user2Id: userId }],
      },
    });

    if (!couple) {
      return { error: "Пара не найдена" };
    }

    if (couple.user2Id) {
      return { error: "Партнёр уже присоединился" };
    }

    const token = crypto.randomUUID();

    await db.couple.update({
      where: { id: couple.id },
      data: { inviteToken: token },
    });

    return { success: true, data: { token } };
  } catch {
    return { error: "Не удалось создать ссылку приглашения" };
  }
}

export async function createMoodPreset(
  emoji: string,
  label: string
): Promise<{ success: true; data: { id: string } } | { error: string }> {
  const session = await auth();
  if (!session?.user?.id) {
    return { error: "Необходимо войти в аккаунт" };
  }

  if (!emoji || emoji.length > 10) {
    return { error: "Некорректный эмодзи" };
  }

  if (!label || label.length > 50) {
    return { error: "Некорректное название настроения" };
  }

  const userId = session.user.id;

  try {
    const couple = await db.couple.findFirst({
      where: {
        OR: [{ user1Id: userId }, { user2Id: userId }],
      },
    });

    if (!couple) {
      return { error: "Пара не найдена" };
    }

    const count = await db.moodPreset.count({
      where: { coupleId: couple.id },
    });

    if (count >= 20) {
      return { error: "Максимум 20 настроений" };
    }

    const preset = await db.moodPreset.create({
      data: {
        emoji,
        label,
        isDefault: false,
        coupleId: couple.id,
      },
    });

    revalidatePath("/settings");

    return { success: true, data: { id: preset.id } };
  } catch {
    return { error: "Не удалось создать настроение" };
  }
}

export async function deleteMoodPreset(
  presetId: string
): Promise<{ success: true } | { error: string }> {
  const session = await auth();
  if (!session?.user?.id) {
    return { error: "Необходимо войти в аккаунт" };
  }

  const userId = session.user.id;

  try {
    const preset = await db.moodPreset.findUnique({
      where: { id: presetId },
    });

    if (!preset) {
      return { error: "Настроение не найдено" };
    }

    if (preset.isDefault) {
      return { error: "Нельзя удалить стандартное настроение" };
    }

    const couple = await db.couple.findFirst({
      where: {
        OR: [{ user1Id: userId }, { user2Id: userId }],
      },
    });

    if (!couple || preset.coupleId !== couple.id) {
      return { error: "Нет доступа к этому настроению" };
    }

    await db.moodPreset.delete({
      where: { id: presetId },
    });

    revalidatePath("/settings");

    return { success: true };
  } catch {
    return { error: "Не удалось удалить настроение" };
  }
}
