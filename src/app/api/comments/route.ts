import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { articleId, author, email, content } = body;

    if (!articleId || !author || !content) {
      return NextResponse.json(
        { error: "Vui lòng nhập đầy đủ họ tên và nội dung bình luận" },
        { status: 400 }
      );
    }

    // Kiểm tra bài viết tồn tại
    const article = await prisma.article.findUnique({
      where: { id: articleId },
    });

    if (!article) {
      return NextResponse.json({ error: "Bài viết không tồn tại" }, { status: 404 });
    }

    const comment = await prisma.comment.create({
      data: {
        articleId,
        author: author.trim(),
        email: email ? email.trim() : null,
        content: content.trim(),
      },
    });

    return NextResponse.json({
      success: true,
      comment,
      message: "Bình luận của bạn đã được đăng thành công!",
    });
  } catch (error: any) {
    console.error("Lỗi đăng bình luận:", error);
    return NextResponse.json(
      { error: error.message || "Lỗi máy chủ khi đăng bình luận" },
      { status: 500 }
    );
  }
}
