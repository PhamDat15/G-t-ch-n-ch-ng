import { NextResponse } from "next/server";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { s3Client } from "@/lib/r2";
import crypto from "crypto";

export async function POST(req: Request) {
  try {
    const { filename, contentType } = await req.json();
    const hash = crypto.randomBytes(8).toString("hex");
    const safeName = (filename || "document.docx").replace(/[^a-zA-Z0-9.-]/g, "_");
    const key = `temp-uploads/${Date.now()}-${hash}-${safeName}`;

    const command = new PutObjectCommand({
      Bucket: process.env.R2_BUCKET_NAME,
      Key: key,
      ContentType: contentType || "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    });

    // Link có hiệu lực trong 15 phút
    const uploadUrl = await getSignedUrl(s3Client, command, { expiresIn: 900 });

    return NextResponse.json({ uploadUrl, key });
  } catch (error: any) {
    console.error("Presign error:", error);
    return NextResponse.json({ error: error.message || "Lỗi tạo link upload trực tiếp" }, { status: 500 });
  }
}
