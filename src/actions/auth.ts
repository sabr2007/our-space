"use server";

import bcrypt from "bcryptjs";
import crypto from "crypto";
import { db } from "@/lib/db";

export async function setupFirstUser(
  email: string,
  password: string
): Promise<{ success: true } | { error: string }> {
  const existingUser = await db.user.findFirst();
  if (existingUser) {
    return { error: "Аккаунт уже создан" };
  }

  const hashedPassword = await bcrypt.hash(password, 12);

  const user = await db.user.create({
    data: {
      name: "Сабыржан",
      email,
      password: hashedPassword,
    },
  });

  await db.couple.create({
    data: {
      user1Id: user.id,
      startDate: new Date("2025-06-27T00:00:00.000Z"),
      inviteToken: crypto.randomUUID(),
    },
  });

  return { success: true };
}

export async function registerWithInvite(
  token: string,
  email: string,
  password: string
): Promise<{ success: true } | { error: string }> {
  const couple = await db.couple.findUnique({
    where: { inviteToken: token },
  });

  if (!couple) {
    return { error: "Ссылка недействительна или уже использована" };
  }

  const existingUser = await db.user.findUnique({
    where: { email },
  });

  if (existingUser) {
    return { error: "Этот email уже зарегистрирован" };
  }

  const hashedPassword = await bcrypt.hash(password, 12);

  const user = await db.user.create({
    data: {
      name: "Аида",
      email,
      password: hashedPassword,
    },
  });

  await db.couple.update({
    where: { id: couple.id },
    data: {
      user2Id: user.id,
      inviteToken: null,
    },
  });

  return { success: true };
}

export async function generateInviteToken() {
  const couple = await db.couple.findFirst();
  if (!couple) {
    throw new Error("Пара не найдена");
  }

  const token = crypto.randomUUID();

  await db.couple.update({
    where: { id: couple.id },
    data: { inviteToken: token },
  });

  return token;
}
