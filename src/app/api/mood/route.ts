import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { redis } from "@/lib/redis";

export async function GET(request: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const partnerId = request.nextUrl.searchParams.get("partnerId");
  if (!partnerId) {
    return NextResponse.json(
      { error: "partnerId is required" },
      { status: 400 }
    );
  }

  // Verify the requester is actually partnered with this user
  const couple = await db.couple.findFirst({
    where: {
      OR: [
        { user1Id: session.user.id, user2Id: partnerId },
        { user1Id: partnerId, user2Id: session.user.id },
      ],
    },
  });

  if (!couple) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const cacheKey = `mood:${partnerId}`;
  let cached: string | null = null;
  try {
    cached = await redis.get(cacheKey);
  } catch {
    // Redis unavailable, fall through to DB
  }

  if (cached) {
    return NextResponse.json(JSON.parse(cached));
  }

  const mood = await db.mood.findFirst({
    where: { userId: partnerId },
    orderBy: { createdAt: "desc" },
  });

  if (!mood) {
    return NextResponse.json(null);
  }

  const moodData = {
    emoji: mood.emoji,
    label: mood.label,
    updatedAt: mood.createdAt.toISOString(),
  };

  try {
    await redis.set(cacheKey, JSON.stringify(moodData), "EX", 86400);
  } catch {
    // Redis unavailable, skip caching
  }

  return NextResponse.json(moodData);
}
