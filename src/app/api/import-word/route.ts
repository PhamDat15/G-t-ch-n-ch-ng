import { NextResponse } from "next/server";
import { parseDocxBuffer } from "@/lib/docx-parser";
import { prisma } from "@/lib/db";
import { seedCategories } from "@/lib/categories";
import slugify from "slugify";

export async function POST(req: Request) {
  try {
    // Đảm bảo 7 danh mục đã được seed
    await seedCategories();

    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    const categorySlug = formData.get("categorySlug") as string | null;
    const isHero = formData.get("isHero") === "true";
    const isFeatured = formData.get("isFeatured") === "true";
    const author = (formData.get("author") as string) || "Ban Biên Tập Gạt Chân Chống";

    if (!file) {
      return NextResponse.json({ error: "Vui lòng chọn file Word (.docx)" }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Bóc tách text và ảnh chất lượng cao
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
