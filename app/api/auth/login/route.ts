import { NextRequest, NextResponse } from "next/server";
import { SignJWT } from "jose";

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET!);
const COOKIE_NAME = "our-space-auth";
const COOKIE_MAX_AGE = 90 * 24 * 60 * 60;

export async function POST(request: NextRequest) {
  try {
    const { key } = await request.json();

    if (!key || typeof key !== "string") {
      return NextResponse.json(
        { error: "Key is required" },
        { status: 400 }
      );
    }

    // Verify key
    let userId: number | null = null;
    if (key === process.env.SECRET_KEY_1) userId = 1;
    else if (key === process.env.SECRET_KEY_2) userId = 2;

    if (!userId) {
      return NextResponse.json(
        { error: "Invalid key" },
        { status: 401 }
      );
    }

    // Create JWT
    const token = await new SignJWT({ userId })
      .setProtectedHeader({ alg: "HS256" })
      .setIssuedAt()
      .setExpirationTime("90d")
      .sign(JWT_SECRET);

    // Set cookie via NextResponse
    const response = NextResponse.json({ success: true, userId });
    response.cookies.set(COOKIE_NAME, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: COOKIE_MAX_AGE,
      path: "/",
    });

    return response;
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
