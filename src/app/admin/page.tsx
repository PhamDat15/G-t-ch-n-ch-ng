import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Link from "next/link";
import { prisma } from "@/lib/db";
import { CATEGORIES } from "@/lib/categories";
import ArticleTable from "@/components/ArticleTable";

export const dynamic = "force-dynamic";

export default async function AdminDashboard() {
  const totalArticles = await prisma.article.count();
  const articles = await prisma.article.findMany({
    take: 20,
    orderBy: { publishedAt: "desc" },
    include: { category: true },
  });

  return (
    <div className="min-h-screen flex flex-col bg-[#F8FAFC]">
      <Header />

      <main className="flex-1 max-w-7xl mx-auto px-4 py-8 w-full">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4 mb-6">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-[#1A56DB]">
              Bàn Làm Việc Tòa Soạn
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0A2540] font-serif mt-1">
              Bảng Điều Khiển & Quản Lý Nội Dung
            </h1>
          </div>

          <div className="flex items-center space-x-3">
            <Link
              href="/admin/import"
              className="bg-[#0A2540] hover:bg-[#1A56DB] text-white text-xs font-bold uppercase tracking-wider px-4 py-2.5 transition rounded-sm"
            >
              + Nhập bài viết từ file Word (.docx)
            </Link>
          </div>
        </div>

        {/* Các thẻ thống kê */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-5 border border-slate-200 rounded-sm shadow-xs">
            <span className="text-xs text-slate-500 font-semibold uppercase tracking-wider">
              Tổng số bài viết
            </span>
            <p className="text-3xl font-extrabold text-[#0A2540] mt-2 font-mono">{totalArticles}</p>
          </div>

          <div className="bg-white p-5 border border-slate-200 rounded-sm shadow-xs">
            <span className="text-xs text-slate-500 font-semibold uppercase tracking-wider">
              Số chuyên mục
            </span>
            <p className="text-3xl font-extrabold text-[#1A56DB] mt-2 font-mono">
              {CATEGORIES.length}
            </p>
          </div>

          <div className="bg-white p-5 border border-slate-200 rounded-sm shadow-xs">
            <span className="text-xs text-slate-500 font-semibold uppercase tracking-wider">
              Trạng thái hệ thống
            </span>
            <p className="text-sm font-bold text-emerald-600 mt-3 flex items-center space-x-2">
              <span className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-ping inline-block"></span>
              <span>Sẵn sàng tiếp nhận tài liệu</span>
            </p>
          </div>
        </div>

        {/* Bảng danh sách bài viết gần đây */}
        <div className="bg-white border border-slate-200 rounded-sm shadow-xs overflow-hidden">
          <div className="p-4 border-b border-slate-200 flex items-center justify-between">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900">
              Danh sách bài viết đã xuất bản
            </h3>
            <span className="text-xs text-slate-500 font-mono">Hiển thị {articles.length} bài mới nhất</span>
          </div>

          <ArticleTable initialArticles={articles} />
        </div>
      </main>

      <Footer />
    </div>
  );
}
