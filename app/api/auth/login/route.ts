import { NextRequest, NextResponse } from "next/server";
import { verifyKey, setAuthCookie } from "@/lib/auth";

export async function POST(request: NextRequest) {
  try {
    const { key } = await request.json();

    if (!key || typeof key !== "string") {
      return NextResponse.json(
        { error: "Key is required" },
        { status: 400 }
      );
    }

    const userId = await verifyKey(key);

    if (!userId) {
      return NextResponse.json(
        { error: "Invalid key" },
        { status: 401 }
      );
    }

    // Set auth cookie
    await setAuthCookie(userId);

    return NextResponse.json({ success: true, userId });
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
