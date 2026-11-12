import { NextRequest, NextResponse } from "next/server";
import { uploadBufferToR2 } from "@/lib/r2";
import crypto from "crypto";
import { isAdminAuthenticated } from "@/lib/admin-auth";

export const maxDuration = 30;

export async function POST(req: NextRequest) {
  try {
    if (!(await isAdminAuthenticated())) {
      return NextResponse.json({ error: "Vui lòng đăng nhập quản trị" }, { status: 401 });
    }

    const formData = await req.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "Không tìm thấy file ảnh tải lên." }, { status: 400 });
    }

    // Kiểm tra định dạng ảnh
    const allowedTypes = ["image/jpeg", "image/png", "image/webp", "image/gif"];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { error: "Vui lòng chỉ tải file ảnh (JPG, PNG, WEBP, GIF)." },
        { status: 400 }
      );
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Tạo tên file an toàn duy nhất trên R2
    const hash = crypto.randomBytes(6).toString("hex");
    const safeExt = file.type.split("/")[1] || "jpg";
    const filename = `thumbnails/${Date.now()}-${hash}.${safeExt}`;

    // Upload lên Cloudflare R2
    const cdnUrl = await uploadBufferToR2(buffer, filename, file.type);

    return NextResponse.json({
      success: true,
      url: cdnUrl,
    });
  } catch (error) {
    console.error("Lỗi khi upload thumbnail:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Lỗi khi tải ảnh lên Cloudflare R2" },
      { status: 500 }
    );
  }
}

