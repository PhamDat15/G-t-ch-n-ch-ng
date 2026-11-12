import { prisma } from "@/lib/db";
import ArticleTable, { ArticleItem } from "@/components/ArticleTable";
import Link from "next/link";
import { getCurrentUser } from "@/lib/admin-auth";

export default async function CmsArticlesPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; status?: string }>;
}) {
  const { q, status } = await searchParams;
  const currentUser = await getCurrentUser();
  const isLeader = currentUser?.role === "ADMIN" || currentUser?.role === "EDITOR";

  // Phóng viên xem bài của mình (hoặc bài có tên tác giả trùng)
  const whereCondition: any = {};
  if (q) {
    whereCondition.title = { contains: q, mode: "insensitive" };
  }
  if (status) {
    if (status === "PENDING") {
      whereCondition.status = { in: ["PENDING", "DRAFT"] };
    } else {
      whereCondition.status = status;
    }
  }
  if (!isLeader && currentUser) {
    whereCondition.OR = [
      { authorId: currentUser.id },
      { author: currentUser.fullName },
    ];
  }

  const articles = (await prisma.article.findMany({
    where: whereCondition,
    take: 100,
    orderBy: { publishedAt: "desc" },
    include: { category: true },
  })) as unknown as ArticleItem[];

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <p className="text-xs font-bold uppercase tracking-wider text-[#b46b2a]">
            {isLeader ? "Tòa Soạn Quản Trị" : "Phóng Viên"}
          </p>
          <h1 className="font-serif text-3xl font-black text-[#123b5d]">
            {isLeader ? "Quản lý & Kiểm duyệt bài viết" : "Bài viết của tôi"}
          </h1>
        </div>
        <Link
          href="/cms/them-bai"
          className="rounded-lg bg-[#175b8f] px-4 py-2.5 text-sm font-bold text-white hover:bg-[#2576ae] transition"
        >
          + Viết bài mới
        </Link>
      </div>

      {/* Bộ lọc tab trạng thái dành cho Trưởng mục */}
      {isLeader && (
        <div className="flex flex-wrap gap-2 border-b border-slate-200 pb-3">
          <Link
            href="/cms/bai-viet"
            className={`rounded-full px-4 py-1.5 text-xs font-bold transition ${
              !status
                ? "bg-[#123b5d] text-white"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200"
            }`}
          >
            Tất cả bài viết
          </Link>
          <Link
            href="/cms/bai-viet?status=PENDING"
            className={`rounded-full px-4 py-1.5 text-xs font-bold transition ${
              status === "PENDING"
                ? "bg-amber-500 text-white shadow"
                : "bg-amber-50 text-amber-800 border border-amber-300 hover:bg-amber-100"
            }`}
          >
            ⏳ Chờ duyệt (Pending)
          </Link>
          <Link
            href="/cms/bai-viet?status=PUBLISHED"
            className={`rounded-full px-4 py-1.5 text-xs font-bold transition ${
              status === "PUBLISHED"
                ? "bg-emerald-600 text-white"
                : "bg-emerald-50 text-emerald-800 border border-emerald-300 hover:bg-emerald-100"
            }`}
          >
            ✓ Đã lên trang (On-air)
          </Link>
        </div>
      )}

      {/* Ô tìm kiếm */}
      <form className="flex max-w-lg gap-2">
        <input
          name="q"
          defaultValue={q}
          placeholder="Tìm theo tiêu đề bài viết..."
          className="min-w-0 flex-1 rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm outline-none focus:border-[#2576ae]"
        />
        <button className="rounded-lg border border-slate-300 bg-white px-4 text-sm font-bold text-[#175b8f] hover:bg-slate-50">
          Tìm kiếm
        </button>
      </form>

      {/* Bảng bài viết có quyền duyệt và đảo Headline */}
      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        <ArticleTable initialArticles={articles} isLeader={isLeader} />
      </div>
    </div>
  );
}
