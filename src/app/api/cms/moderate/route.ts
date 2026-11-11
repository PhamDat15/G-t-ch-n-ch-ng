import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getCurrentUser } from "@/lib/admin-auth";

export async function POST(req: NextRequest) {
  try {
    const currentUser = await getCurrentUser();
    if (!currentUser || (currentUser.role !== "ADMIN" && currentUser.role !== "EDITOR")) {
      return NextResponse.json(
        { error: "Bạn không có quyền duyệt bài hoặc đảo vị trí bài viết." },
        { status: 403 }
      );
    }

    const { articleId, action, status, isHero, isFeatured } = await req.json();

    if (!articleId) {
      return NextResponse.json({ error: "Thiếu mã bài viết." }, { status: 400 });
    }

    // 1. Hành động DUYỆT BÀI / CHUYỂN TRẠNG THÁI
    if (action === "SET_STATUS") {
      const updated = await prisma.article.update({
        where: { id: articleId },
        data: {
          status: status || "PUBLISHED",
          publishedAt: new Date(),
        },
      });
      return NextResponse.json({ success: true, article: updated });
    }

    // 2. Hành động ĐẢO HEADLINE (HERO)
    if (action === "TOGGLE_HERO") {
      // Nếu bật Hero cho bài này, gỡ Hero của bài trước đó
      if (isHero) {
        await prisma.article.updateMany({
          where: { isHero: true },
          data: { isHero: false },
        });
      }
      const updated = await prisma.article.update({
        where: { id: articleId },
        data: { isHero: Boolean(isHero) },
      });
      return NextResponse.json({ success: true, article: updated });
    }

    // 3. Hành động ĐẶT NỔI BẬT (FEATURED)
    if (action === "TOGGLE_FEATURED") {
      const updated = await prisma.article.update({
        where: { id: articleId },
        data: { isFeatured: Boolean(isFeatured) },
      });
      return NextResponse.json({ success: true, article: updated });
    }

    return NextResponse.json({ error: "Hành động không hợp lệ." }, { status: 400 });
  } catch (error) {
    console.error("Lỗi khi kiểm duyệt/đảo headline:", error);
    return NextResponse.json(
      { error: "Đã xảy ra lỗi khi thực hiện thao tác." },
      { status: 500 }
    );
  }
}

