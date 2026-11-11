import Link from "next/link";
import { prisma } from "@/lib/db";

export default async function CmsDashboard() {
  const articles = await prisma.article.count();
  const comments = await prisma.comment.count();
  const categories = await prisma.category.count();
  const latest = await prisma.article.findMany({
    take: 5,
    orderBy: { publishedAt: "desc" },
    include: { category: true },
  });
  return <div><div className="mb-8"><p className="text-sm font-bold uppercase tracking-wider text-[#b46b2a]">Tổng quan</p><h1 className="mt-1 font-serif text-3xl font-black text-[#123b5d]">Bàn làm việc tòa soạn</h1><p className="mt-2 text-sm text-slate-500">Quản lý nội dung và thông tin của Tạp chí Việt Nam Travel.</p></div>
    <div className="grid gap-4 sm:grid-cols-3">{[["Bài viết", articles], ["Bình luận", comments], ["Chuyên mục", categories]].map(([label, value]) => <div key={label} className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm"><p className="text-sm font-semibold text-slate-500">{label}</p><p className="mt-2 text-3xl font-black text-[#175b8f]">{value}</p></div>)}</div>
    <div className="mt-8 rounded-xl border border-slate-200 bg-white shadow-sm"><div className="flex items-center justify-between border-b border-slate-200 p-5"><h2 className="font-serif text-xl font-bold text-[#123b5d]">Bài mới xuất bản</h2><Link href="/cms/bai-viet" className="text-sm font-bold text-[#2576ae]">Quản lý tất cả →</Link></div><div className="divide-y divide-slate-100">{latest.map((article) => <div key={article.id} className="flex items-center justify-between gap-4 p-4"><div><Link href={`/bai-viet/${article.slug}`} target="_blank" className="font-bold text-slate-800 hover:text-[#2576ae]">{article.title}</Link><p className="mt-1 text-xs text-slate-500">{article.category.name} · {article.author}</p></div><span className="text-xs text-slate-400">{new Date(article.publishedAt).toLocaleDateString("vi-VN")}</span></div>)}</div></div>
  </div>;
}
