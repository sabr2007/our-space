import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { s3, R2_BUCKET } from "@/lib/s3";
import { GetObjectCommand, PutObjectCommand } from "@aws-sdk/client-s3";
import sharp from "sharp";

export async function POST(request: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: { photoId?: string; key?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: "Invalid request body" },
      { status: 400 }
    );
  }

  const { photoId, key } = body;

  if (!photoId || !key) {
    return NextResponse.json(
      { error: "photoId and key are required" },
      { status: 400 }
    );
  }

  // Validate key format to prevent path traversal
  if (!key.startsWith("photos/") || key.includes("..")) {
    return NextResponse.json(
      { error: "Invalid key format" },
      { status: 400 }
    );
  }

  // Verify the photo belongs to the requesting user
  const photo = await db.photo.findUnique({
    where: { id: photoId },
    select: { authorId: true },
  });

  if (!photo || photo.authorId !== session.user.id) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  try {
    // Download original image from R2
    const getCommand = new GetObjectCommand({
      Bucket: R2_BUCKET,
      Key: key,
    });
    const response = await s3.send(getCommand);

    if (!response.Body) {
      return NextResponse.json(
        { error: "Failed to retrieve image" },
        { status: 500 }
      );
    }

    const imageBuffer = Buffer.from(await response.Body.transformToByteArray());

    // Generate thumbnail with sharp
    const thumbnailBuffer = await sharp(imageBuffer)
      .resize({ width: 400, withoutEnlargement: true })
      .webp({ quality: 80 })
      .toBuffer();

    // Upload thumbnail to R2
    const thumbnailKey = `thumbnails/${key}`;
    const putCommand = new PutObjectCommand({
      Bucket: R2_BUCKET,
      Key: thumbnailKey,
      Body: thumbnailBuffer,
      ContentType: "image/webp",
    });
    await s3.send(putCommand);

    // Build thumbnail URL
    const publicUrl = process.env.R2_PUBLIC_URL;
    const thumbnailUrl = publicUrl
      ? `${publicUrl}/${thumbnailKey}`
      : thumbnailKey;

    // Update photo record in DB
    await db.photo.update({
      where: { id: photoId },
      data: { thumbnail: thumbnailUrl },
    });

    return NextResponse.json({ success: true, thumbnailUrl });
  } catch (error) {
    console.error("Thumbnail generation failed:", error);
    return NextResponse.json(
      { error: "Failed to generate thumbnail" },
      { status: 500 }
    );
  }
}
