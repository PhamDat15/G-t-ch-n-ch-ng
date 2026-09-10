import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { parseDocxBuffer } from "@/lib/docx-parser";
import { prisma } from "@/lib/db";
import { seedCategories } from "@/lib/categories";
import { s3Client } from "@/lib/r2";
import { GetObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";
import slugify from "slugify";

// Cho phép function chạy tối đa 60 giây trên Vercel để xử lý các file nhiều ảnh
export const maxDuration = 60;

export async function POST(req: Request) {
  try {
    // Đảm bảo 7 danh mục đã được seed
    await seedCategories();

    const contentType = req.headers.get("content-type") || "";
    let buffer: Buffer;
    let categorySlug: string | null = null;
    let isHero = false;
    let isFeatured = false;
    let author = "Ban Biên Tập Gạt Chân Chống";
    let tempR2Key: string | null = null;

    if (contentType.includes("application/json")) {
      // Phương thức Upload trực tiếp (Presigned URL) cho file lớn
      const body = await req.json();
      tempR2Key = body.r2Key;
      categorySlug = body.categorySlug;
      isHero = !!body.isHero;
      isFeatured = !!body.isFeatured;
      if (body.author) author = body.author;

      if (!tempR2Key) {
        return NextResponse.json({ error: "Không tìm thấy file trên R2" }, { status: 400 });
      }

      // Tải buffer từ R2 về serverless function để giải nén
      const getCommand = new GetObjectCommand({
        Bucket: process.env.R2_BUCKET_NAME,
        Key: tempR2Key,
      });
      const s3Item = await s3Client.send(getCommand);
      const bytes = await s3Item.Body?.transformToByteArray();
      if (!bytes) {
        throw new Error("Không thể đọc nội dung file từ Cloudflare R2");
      }
      buffer = Buffer.from(bytes);
    } else {
      // Phương thức FormData truyền thống cho file nhỏ (< 4MB)
      const formData = await req.formData();
      const file = formData.get("file") as File | null;
      categorySlug = formData.get("categorySlug") as string | null;
      isHero = formData.get("isHero") === "true";
      isFeatured = formData.get("isFeatured") === "true";
      author = (formData.get("author") as string) || "Ban Biên Tập Gạt Chân Chống";

      if (!file) {
        return NextResponse.json({ error: "Vui lòng chọn file Word (.docx)" }, { status: 400 });
      }

      const bytes = await file.arrayBuffer();
      buffer = Buffer.from(bytes);
    }

    // Bóc tách text và ảnh chất lượng cao (ảnh tự nén và đẩy vào R2)
    const parsed = await parseDocxBuffer(buffer);

    // Tìm danh mục
    let category = null;
    if (categorySlug) {
      category = await prisma.category.findUnique({ where: { slug: categorySlug } });
    }
    if (!category) {
      category = await prisma.category.findFirst({ where: { slug: "kham-pha" } });
    }

    if (!category) {
      return NextResponse.json({ error: "Không tìm thấy danh mục bài viết" }, { status: 400 });
    }

    // Tạo unique slug
    let baseSlug = slugify(parsed.title, { lower: true, strict: true, locale: "vi" });
    if (!baseSlug) baseSlug = `bai-viet-${Date.now()}`;
    let uniqueSlug = baseSlug;
    let counter = 1;
    while (await prisma.article.findUnique({ where: { slug: uniqueSlug } })) {
      uniqueSlug = `${baseSlug}-${counter}`;
      counter++;
    }

    // Nếu bài viết này được đặt làm Hero, gỡ Hero cũ
    if (isHero) {
      await prisma.article.updateMany({
        where: { isHero: true },
        data: { isHero: false },
      });
    }

    // Tính thời gian đọc ước tính (~250 từ / phút)
    const wordCount = parsed.content.replace(/<[^>]*>/g, "").split(/\s+/).length;
    const readingTime = Math.max(2, Math.ceil(wordCount / 200));

    // Lưu vào CSDL
    const article = await prisma.article.create({
      data: {
        title: parsed.title,
        slug: uniqueSlug,
        sapo: parsed.sapo,
        content: parsed.content,
        thumbnail: parsed.thumbnail,
        author: author,
        source: "Tạp chí Gạt chân chống",
        isHero: isHero,
        isFeatured: isFeatured,
        readingTime: readingTime,
        categoryId: category.id,
      },
    });

    // Dọn dẹp file tạm trên R2 nếu có
    if (tempR2Key) {
      try {
        await s3Client.send(
          new DeleteObjectCommand({
            Bucket: process.env.R2_BUCKET_NAME,
            Key: tempR2Key,
          })
        );
      } catch (err) {
        console.warn("Không thể xóa file docx tạm:", err);
      }
    }

    // Làm mới cache ngay lập tức cho Trang chủ, Chuyên mục và Trang Admin
    try {
      revalidatePath("/");
      revalidatePath("/admin");
      if (categorySlug) {
        revalidatePath(`/chuyen-muc/${categorySlug}`);
      }
    } catch (e) {
      console.warn("Không thể xóa cache ISR:", e);
    }

    return NextResponse.json({
      success: true,
      article,
      message: `Đã import thành công bài viết: "${article.title}"`,
      imageCount: parsed.imageCount,
    });
  } catch (error: any) {
    console.error("Error importing docx:", error);
    return NextResponse.json({ error: error.message || "Lỗi xử lý file Word" }, { status: 500 });
  }
}
