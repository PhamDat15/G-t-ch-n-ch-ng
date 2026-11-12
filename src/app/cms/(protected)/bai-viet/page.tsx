import { prisma } from "@/lib/db";
import ArticleTable, { ArticleItem } from "@/components/ArticleTable";
import Link from "next/link";
import { getCurrentUser } from "@/lib/admin-auth";

export const dynamic = "force-dynamic";

export default async function CmsArticlesPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; status?: string }>;
}) {
  const { q, status } = await searchParams;
  const currentUser = await getCurrentUser();
  const isLeader = currentUser?.role === "ADMIN" || currentUser?.role === "EDITOR";

  // Phóng viên xem bài của mình (hoặc bài có tên tác giả / username trùng)
  const whereCondition: any = {};
  if (q) {
    whereCondition.title = { contains: q, mode: "insensitive" };
  }

  // 1. Lọc theo trạng thái bài viết
  if (status === "PENDING") {
    // Chỉ lấy bài đang chờ duyệt (Pending) hoặc bản nháp
    whereCondition.status = { in: ["PENDING", "DRAFT"] };
  } else if (status === "PUBLISHED") {
    // Chỉ lấy bài đã được duyệt lên trang (Published)
    whereCondition.status = "PUBLISHED";
  }

  // 2. Phân quyền xem danh sách
  if (!isLeader && currentUser) {
    whereCondition.OR = [
      { authorId: currentUser.id },
      { author: currentUser.fullName },
      { author: currentUser.username },
    ];
  }

  const articles = (await prisma.article.findMany({
    where: whereCondition,
    take: 100,
    orderBy: { publishedAt: "desc" },
    include: { category: true },
  })) as unknown as ArticleItem[];

  // Đếm số lượng bài viết để hiển thị badge số lượng trên từng tab
  const countWhereBase: any = !isLeader && currentUser ? {
    OR: [
      { authorId: currentUser.id },
      { author: currentUser.fullName },
      { author: currentUser.username },
    ]
  } : {};

  const [totalCount, pendingCount, publishedCount] = await Promise.all([
    prisma.article.count({ where: countWhereBase }),
    prisma.article.count({ where: { ...countWhereBase, status: { in: ["PENDING", "DRAFT"] } } }),
    prisma.article.count({ where: { ...countWhereBase, status: "PUBLISHED" } }),
  ]);

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

      {/* Bộ lọc tab trạng thái (Cả Phóng Viên lẫn Trưởng mục đều dùng để lọc xem Lịch sử) */}
      <div className="flex flex-wrap gap-2 border-b border-slate-200 pb-3">
        <Link
          href="/cms/bai-viet"
          className={`inline-flex items-center gap-1.5 rounded-full px-4 py-1.5 text-xs font-bold transition ${
            !status
              ? "bg-[#123b5d] text-white shadow-sm"
              : "bg-slate-100 text-slate-600 hover:bg-slate-200"
          }`}
        >
          <span>Tất cả bài viết</span>
          <span className={`rounded-full px-1.5 py-0.2 text-[10px] ${!status ? "bg-white/20 text-white" : "bg-slate-200 text-slate-700"}`}>
            {totalCount}
          </span>
        </Link>
        <Link
          href="/cms/bai-viet?status=PENDING"
          className={`inline-flex items-center gap-1.5 rounded-full px-4 py-1.5 text-xs font-bold transition ${
            status === "PENDING"
              ? "bg-amber-500 text-white shadow-sm"
              : "bg-amber-50 text-amber-800 border border-amber-300 hover:bg-amber-100"
          }`}
        >
          <span>⏳ Chờ duyệt (Pending)</span>
          <span className={`rounded-full px-1.5 py-0.2 text-[10px] ${status === "PENDING" ? "bg-white/25 text-white" : "bg-amber-200 text-amber-900"}`}>
            {pendingCount}
          </span>
        </Link>
        <Link
          href="/cms/bai-viet?status=PUBLISHED"
          className={`inline-flex items-center gap-1.5 rounded-full px-4 py-1.5 text-xs font-bold transition ${
            status === "PUBLISHED"
              ? "bg-emerald-600 text-white shadow-sm"
              : "bg-emerald-50 text-emerald-800 border border-emerald-300 hover:bg-emerald-100"
          }`}
        >
          <span>✓ Đã lên trang (On-air)</span>
          <span className={`rounded-full px-1.5 py-0.2 text-[10px] ${status === "PUBLISHED" ? "bg-white/25 text-white" : "bg-emerald-200 text-emerald-900"}`}>
            {publishedCount}
          </span>
        </Link>
      </div>

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
