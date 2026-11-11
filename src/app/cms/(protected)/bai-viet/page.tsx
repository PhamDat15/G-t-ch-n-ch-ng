import { prisma } from "@/lib/db";
import ArticleTable from "@/components/ArticleTable";
import Link from "next/link";

export default async function CmsArticlesPage({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
  const { q } = await searchParams;
  const articles = await prisma.article.findMany({ where: q ? { title: { contains: q, mode: "insensitive" } } : {}, take: 50, orderBy: { publishedAt: "desc" }, include: { category: true } });
  return <div><div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end"><div><p className="text-sm font-bold uppercase tracking-wider text-[#b46b2a]">Nội dung</p><h1 className="font-serif text-3xl font-black text-[#123b5d]">Quản lý bài viết</h1></div><Link href="/cms/them-bai" className="rounded-lg bg-[#175b8f] px-4 py-2.5 text-sm font-bold text-white hover:bg-[#2576ae]">+ Thêm bài mới</Link></div>
    <form className="my-6 flex max-w-lg gap-2"><input name="q" defaultValue={q} placeholder="Tìm theo tiêu đề..." className="min-w-0 flex-1 rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm outline-none focus:border-[#2576ae]" /><button className="rounded-lg border border-slate-300 bg-white px-4 text-sm font-bold text-[#175b8f]">Tìm kiếm</button></form>
    <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm"><ArticleTable initialArticles={articles} /></div></div>;
}
