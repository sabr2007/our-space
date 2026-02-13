"use server";

import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { redis } from "@/lib/redis";

interface MoodData {
  emoji: string;
  label: string;
  updatedAt: string;
}

interface PartnerInfo {
  id: string;
  name: string;
  avatar: string | null;
}

interface PhotoSummary {
  id: string;
  url: string;
  thumbnail: string | null;
  description: string | null;
}

interface DashboardData {
  partner: PartnerInfo;
  partnerMood: MoodData | null;
  myMood: MoodData | null;
  unreadNoteCount: number;
  recentPhotos: PhotoSummary[];
  coupleStartDate: string;
}

export async function getDashboardData(): Promise<
  { success: true; data: DashboardData } | { error: string }
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

  const [partner, partnerMood, myMood, unreadNoteCount, recentPhotos] =
    await Promise.all([
      db.user.findUnique({
        where: { id: partnerId },
        select: { id: true, name: true, avatar: true },
      }),
      getLatestMood(partnerId),
      getLatestMood(userId),
      db.note.count({
        where: { recipientId: userId, isRead: false },
      }),
      db.photo.findMany({
        where: {
          authorId: { in: [userId, partnerId] },
        },
        orderBy: { eventDate: "desc" },
        take: 3,
        select: {
          id: true,
          url: true,
          thumbnail: true,
          description: true,
        },
      }),
    ]);

  if (!partner) {
    return { error: "Партнёр не найден" };
  }

  return {
    success: true,
    data: {
      partner,
      partnerMood,
      myMood,
      unreadNoteCount,
      recentPhotos,
      coupleStartDate: couple.startDate.toISOString(),
    },
  };
}

async function getLatestMood(userId: string): Promise<MoodData | null> {
  const cacheKey = `mood:${userId}`;

  try {
    const cached = await redis.get(cacheKey);
    if (cached) {
      return JSON.parse(cached) as MoodData;
    }
  } catch {
    // Redis unavailable, fall through to DB
  }

  const mood = await db.mood.findFirst({
    where: { userId },
    orderBy: { createdAt: "desc" },
  });

  if (!mood) return null;

  const moodData: MoodData = {
    emoji: mood.emoji,
    label: mood.label,
    updatedAt: mood.createdAt.toISOString(),
  };

  try {
    await redis.set(cacheKey, JSON.stringify(moodData), "EX", 86400);
  } catch {
    // Redis unavailable, skip caching
  }

  return moodData;
}

export async function setMood(
  emoji: string,
  label: string
): Promise<{ success: true } | { error: string }> {
  const session = await auth();
  if (!session?.user?.id) {
    return { error: "Необходимо войти в аккаунт" };
  }

  if (!emoji || emoji.length > 10 || !label || label.length > 50) {
    return { error: "Некорректные данные настроения" };
  }

  const userId = session.user.id;

  const mood = await db.mood.create({
    data: { emoji, label, userId },
  });

  const moodData: MoodData = {
    emoji: mood.emoji,
    label: mood.label,
    updatedAt: mood.createdAt.toISOString(),
  };

  try {
    await redis.set(`mood:${userId}`, JSON.stringify(moodData), "EX", 86400);
  } catch {
    // Redis unavailable, skip caching
  }

  return { success: true };
}
