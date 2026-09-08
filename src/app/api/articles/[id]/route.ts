import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const existing = await prisma.article.findUnique({
      where: { id },
    });

    if (!existing) {
      return NextResponse.json({ error: "Không tìm thấy bài viết" }, { status: 404 });
    }

    // Xóa bài viết khỏi cơ sở dữ liệu
    await prisma.article.delete({
      where: { id },
    });

    return NextResponse.json({
      success: true,
      message: `Đã gỡ bài viết "${existing.title}" thành công`,
    });
  } catch (error: any) {
    console.error("Lỗi khi gỡ bài viết:", error);
    return NextResponse.json(
      { error: error.message || "Lỗi khi gỡ bài viết" },
      { status: 500 }
    );
  }
}
