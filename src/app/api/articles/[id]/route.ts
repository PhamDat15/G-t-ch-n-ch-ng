import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db";
import { deleteFilesFromR2 } from "@/lib/r2";

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const existing = await prisma.article.findUnique({
      where: { id },
      include: { category: true },
    });

    if (!existing) {
      return NextResponse.json({ error: "Không tìm thấy bài viết" }, { status: 404 });
    }

    // 1. Tự động tìm và xóa sạch toàn bộ các file ảnh của bài viết này trên Cloudflare R2
    const regex = /article-img-[a-zA-Z0-9_-]+\.webp/g;
    const contentKeys = existing.content.match(regex) || [];
    const thumbnailKey = existing.thumbnail?.match(regex)?.[0];
    const allR2Keys = Array.from(new Set([...contentKeys, ...(thumbnailKey ? [thumbnailKey] : [])]));

    if (allR2Keys.length > 0) {
      await deleteFilesFromR2(allR2Keys);
    }

    // 2. Xóa bài viết khỏi cơ sở dữ liệu Neon (các bình luận liên quan tự động xóa theo Cascade)
    await prisma.article.delete({
      where: { id },
    });

    // 3. Làm mới cache ngay lập tức cho Trang chủ, Chuyên mục và Admin
    try {
      revalidatePath("/");
      revalidatePath("/admin");
      if (existing.category?.slug) {
        revalidatePath(`/chuyen-muc/${existing.category.slug}`);
      }
    } catch (e) {
      console.warn("Lỗi revalidate khi xóa bài:", e);
    }

    return NextResponse.json({
      success: true,
      message: `Đã gỡ bài viết "${existing.title}" và dọn sạch ${allR2Keys.length} ảnh trên Cloudflare R2 thành công`,
    });
  } catch (error: any) {
    console.error("Lỗi khi gỡ bài viết:", error);
    return NextResponse.json(
      { error: error.message || "Lỗi khi gỡ bài viết" },
      { status: 500 }
    );
  }
}
