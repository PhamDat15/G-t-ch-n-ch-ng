import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const existing = await prisma.comment.findUnique({
      where: { id },
    });

    if (!existing) {
      return NextResponse.json({ error: "Không tìm thấy bình luận" }, { status: 404 });
    }

    await prisma.comment.delete({
      where: { id },
    });

    return NextResponse.json({
      success: true,
      message: "Đã xóa bình luận thành công",
    });
  } catch (error: any) {
    console.error("Lỗi khi xóa bình luận:", error);
    return NextResponse.json(
      { error: error.message || "Lỗi khi xóa bình luận" },
      { status: 500 }
    );
  }
}
