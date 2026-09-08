import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Link from "next/link";
import { prisma } from "@/lib/db";
import { notFound } from "next/navigation";
import ReadingProgressBar from "@/components/ReadingProgressBar";

export const dynamic = "force-dynamic";

export default async function ArticleDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  const article = await prisma.article.findUnique({
    where: { slug },
    include: { category: true },
  });

  if (!article) {
    notFound();
  }

  // Tăng viewCount
  await prisma.article.update({
    where: { id: article.id },
    data: { viewCount: { increment: 1 } },
  });

  // Bài viết liên quan cùng chuyên mục
  const relatedArticles = await prisma.article.findMany({
    where: {
      categoryId: article.categoryId,
      id: { not: article.id },
    },
    take: 4,
    orderBy: { publishedAt: "desc" },
  });

  const formattedDate = new Date(article.publishedAt).toLocaleDateString("vi-VN", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <ReadingProgressBar />
      <Header currentCategory={article.category.slug} />

      <main className="flex-1 max-w-5xl mx-auto px-4 py-8 w-full">
        {/* Breadcrumb tối giản text */}
        <nav className="text-xs text-slate-500 mb-6 flex items-center space-x-2">
          <Link href="/" className="hover:text-[#1A56DB] transition">
            Trang chủ
          </Link>
          <span>/</span>
          <Link href={`/chuyen-muc/${article.category.slug}`} className="text-[#1A56DB] font-semibold hover:underline">
            {article.category.name}
          </Link>
          <span>/</span>
          <span className="text-slate-400 truncate max-w-md">{article.title}</span>
        </nav>

        {/* Tiêu đề H1 Báo chí & Metadata */}
        <div className="space-y-4 border-b border-slate-200 pb-6 mb-8">
          <span className="inline-block text-xs font-bold uppercase tracking-wider text-[#1A56DB] bg-sky-50 px-2.5 py-1 border border-sky-200">
            {article.category.name}
          </span>

          <h1 className="text-2xl sm:text-3xl md:text-5xl font-extrabold text-[#0A2540] font-sans leading-tight">
            {article.title}
          </h1>

          <div className="flex flex-wrap items-center justify-between gap-4 text-sm text-slate-500 pt-2">
            <div className="flex items-center space-x-3">
              <span className="font-bold text-slate-800 text-base">{article.author}</span>
              <span>—</span>
              <time dateTime={article.publishedAt.toISOString()}>{formattedDate}</time>
            </div>
            <div className="flex items-center space-x-3 font-mono text-xs text-slate-500">
              <span>{article.readingTime} phút đọc</span>
              <span>•</span>
              <span>{article.viewCount + 1} lượt xem</span>
            </div>
          </div>
        </div>

        {/* Đoạn Sapo Báo Chí */}
        <div className="bg-[#F8FAFC] border-l-4 border-[#0F4C81] p-5 my-6 text-base md:text-lg font-medium text-slate-800 leading-relaxed font-sans text-justify">
          {article.sapo}
        </div>

        {/* Nội dung bài viết (Định dạng khuôn báo chí chuẩn) */}
        <article
          className="article-body max-w-none text-slate-800"
          dangerouslySetInnerHTML={{ __html: article.content }}
        />

        {/* Tác giả & Nguồn bài viết */}
        <div className="mt-10 pt-6 border-t-2 border-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <p className="text-xs text-slate-400 uppercase tracking-wider">Tác giả bài viết</p>
            <p className="text-base font-bold text-slate-900 mt-0.5">{article.author}</p>
            <p className="text-xs text-slate-500 mt-1">Theo {article.source || "Tạp chí Gạt Chân Chống"}</p>
          </div>

          <div className="flex items-center space-x-2 text-xs">
            <Link
              href="/admin/import"
              className="bg-slate-100 hover:bg-slate-200 text-slate-700 px-3 py-2 transition"
            >
              [ + Tải bài Word khác ]
            </Link>
          </div>
        </div>

        {/* Khối Bài viết liên quan cùng chuyên mục */}
        {relatedArticles.length > 0 && (
          <section className="mt-14 pt-8 border-t border-slate-200">
            <div className="flex items-center justify-between border-b-2 border-[#0A2540] pb-2 mb-6">
              <h3 className="text-base font-bold uppercase tracking-wider text-[#0A2540] font-serif">
                Bài viết cùng chuyên mục {article.category.name}
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-5">
              {relatedArticles.map((rel) => (
                <article key={rel.id} className="group space-y-2">
                  <div className="aspect-[16/10] w-full overflow-hidden bg-slate-100 border border-slate-200">
                    {rel.thumbnail && (
                      <img
                        src={rel.thumbnail}
                        alt={rel.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                      />
                    )}
                  </div>
                  <Link
                    href={`/bai-viet/${rel.slug}`}
                    className="text-xs font-bold text-slate-900 group-hover:text-[#1A56DB] transition leading-snug line-clamp-2 block"
                  >
                    {rel.title}
                  </Link>
                </article>
              ))}
            </div>
          </section>
        )}
      </main>

      <Footer />
    </div>
  );
}
