import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { isAdminAuthenticated } from "@/lib/admin-auth";

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    if (!(await isAdminAuthenticated())) return NextResponse.json({ error: "Vui lòng đăng nhập quản trị" }, { status: 401 });
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
  } catch (error: unknown) {
    console.error("Lỗi khi xóa bình luận:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Lỗi khi xóa bình luận" },
      { status: 500 }
    );
  }
}
