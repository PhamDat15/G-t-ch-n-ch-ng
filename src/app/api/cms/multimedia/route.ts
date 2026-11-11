import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import slugify from "slugify";

export async function POST(req: NextRequest) {
  try {
    const { videoId, title, sapo, author, isHero, isFeatured, customThumbnail } = await req.json();

    if (!videoId || !title) {
      return NextResponse.json(
        { error: "Thiếu Video ID hoặc Tiêu đề video." },
        { status: 400 }
      );
    }

    // 1. Tìm hoặc tạo danh mục "Multimedia"
    let category = await prisma.category.findUnique({
      where: { slug: "multimedia" },
    });

    if (!category) {
      category = await prisma.category.create({
        data: {
          name: "Multimedia",
          slug: "multimedia",
          description: "Video, phóng sự và hình ảnh du lịch sống động",
          order: 6,
        },
      });
    }

    // 2. Tạo slug độc nhất
    const baseSlug = slugify(title, { lower: true, strict: true, locale: "vi" }) || `video-${videoId}`;
    let finalSlug = baseSlug;
    let counter = 1;
    while (await prisma.article.findUnique({ where: { slug: finalSlug } })) {
      finalSlug = `${baseSlug}-${counter}`;
      counter++;
    }

    // 3. Xây dựng nội dung HTML nhúng video YouTube chuẩn responsive 16:9
    const thumbnail = customThumbnail || `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
    const cleanSapo = sapo || `Trải nghiệm video phóng sự du lịch sống động: ${title}.`;

    const contentHtml = `
      <div class="video-embed-wrapper my-6 aspect-video w-full overflow-hidden rounded-2xl shadow-xl bg-black">
        <iframe
          src="https://www.youtube.com/embed/${videoId}?autoplay=0&rel=0"
          title="${title.replace(/"/g, '&quot;')}"
          class="w-full h-full border-0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowfullscreen
        ></iframe>
      </div>
      <div class="video-meta-desc text-slate-700 leading-relaxed text-base md:text-lg my-6">
        <p>${cleanSapo}</p>
      </div>
    `;

    // 4. Nếu đặt làm Hero, gỡ Hero cũ
    if (isHero) {
      await prisma.article.updateMany({
        where: { isHero: true },
        data: { isHero: false },
      });
    }

    // 5. Lưu vào Database
    const article = await prisma.article.create({
      data: {
        title,
        slug: finalSlug,
        sapo: cleanSapo,
        content: contentHtml,
        thumbnail,
        author: author || "Ban Biên Tập Multimedia",
        isHero: Boolean(isHero),
        isFeatured: Boolean(isFeatured),
        readingTime: 3,
        categoryId: category.id,
      },
      include: {
        category: true,
      },
    });

    return NextResponse.json({
      success: true,
      article: {
        id: article.id,
        title: article.title,
        slug: article.slug,
        sapo: article.sapo,
        thumbnail: article.thumbnail,
      },
      message: "Đăng video Multimedia thành công!",
    });
  } catch (error) {
    console.error("Lỗi khi đăng bài Multimedia:", error);
    return NextResponse.json(
      { error: "Đã xảy ra lỗi khi lưu bài viết Multimedia." },
      { status: 500 }
    );
  }
}

