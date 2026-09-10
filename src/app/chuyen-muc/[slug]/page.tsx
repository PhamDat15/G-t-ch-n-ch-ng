import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Link from "next/link";
import { prisma } from "@/lib/db";
import { notFound } from "next/navigation";

export const revalidate = 60;

export default async function CategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  const category = await prisma.category.findUnique({
    where: { slug },
    include: {
      articles: {
        orderBy: { publishedAt: "desc" },
        select: {
          id: true,
          title: true,
          slug: true,
          sapo: true,
          thumbnail: true,
          author: true,
          readingTime: true,
          publishedAt: true,
        },
      },
    },
  });

  if (!category) {
    notFound();
  }

  const articles = category.articles;
  const leadArticle = articles[0];
  const remainingArticles = articles.slice(1);

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header currentCategory={category.slug} />

      <main className="flex-1 max-w-7xl mx-auto px-4 py-8 w-full">
        {/* Banner Chuyên Mục Báo Chí (Xanh Dương & Trắng) */}
        <div className="border-b-2 border-[#0A2540] pb-4 mb-8">
          <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2">
            <h1 className="text-3xl font-extrabold uppercase tracking-tight text-[#0A2540] font-serif">
              {category.name}
            </h1>
            <span className="text-xs text-slate-500 font-mono">
              Tổng số: {articles.length} bài viết
            </span>
          </div>
          {category.description && (
            <p className="text-sm text-slate-600 mt-2 font-sans">{category.description}</p>
          )}
        </div>

        {articles.length === 0 ? (
          <div className="py-16 text-center border border-dashed border-slate-300 p-8 rounded">
            <p className="text-slate-600 mb-4">Chuyên mục này hiện chưa có bài viết nào.</p>
            <Link
              href="/admin/import"
              className="inline-block bg-[#0A2540] hover:bg-[#1A56DB] text-white text-xs font-bold uppercase tracking-wider px-5 py-2.5 transition"
            >
              Nhập bài từ file Word (.docx) vào mục này
            </Link>
          </div>
        ) : (
          <div className="space-y-10">
            {/* Bài Đinh (Lead Article) nếu có */}
            {leadArticle && (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pb-8 border-b border-slate-200">
                <div className="lg:col-span-7">
                  <div className="aspect-[16/10] w-full overflow-hidden bg-slate-100 border border-slate-200">
                    {leadArticle.thumbnail && (
                      <img
                        src={leadArticle.thumbnail}
                        alt={leadArticle.title}
                        className="w-full h-full object-cover"
                      />
                    )}
                  </div>
                </div>
                <div className="lg:col-span-5 flex flex-col justify-center space-y-3">
                  <span className="text-xs font-bold text-[#1A56DB] uppercase tracking-wider">
                    Tiêu điểm chuyên mục
                  </span>
                  <Link href={`/bai-viet/${leadArticle.slug}`}>
                    <h2 className="text-2xl font-bold text-slate-900 hover:text-[#1A56DB] transition font-serif leading-snug">
                      {leadArticle.title}
                    </h2>
                  </Link>
                  <p className="text-sm text-slate-600 leading-relaxed line-clamp-3">
                    {leadArticle.sapo}
                  </p>
                  <div className="text-xs text-slate-400 pt-2 flex items-center space-x-2">
                    <span className="font-semibold text-slate-700">{leadArticle.author}</span>
                    <span>•</span>
                    <span>{leadArticle.readingTime} phút đọc</span>
                  </div>
                </div>
              </div>
            )}

            {/* Danh sách các bài còn lại */}
            {remainingArticles.length > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {remainingArticles.map((art) => (
                  <article key={art.id} className="group space-y-3 pb-6 border-b border-slate-100">
                    <div className="aspect-[16/10] w-full overflow-hidden bg-slate-100 border border-slate-200">
                      {art.thumbnail && (
                        <img
                          src={art.thumbnail}
                          alt={art.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                        />
                      )}
                    </div>
                    <Link
                      href={`/bai-viet/${art.slug}`}
                      className="text-base font-bold text-slate-900 group-hover:text-[#1A56DB] transition font-serif leading-snug line-clamp-2 block"
                    >
                      {art.title}
                    </Link>
                    <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                      {art.sapo}
                    </p>
                    <div className="text-[11px] text-slate-400 flex items-center space-x-2 pt-1">
                      <span>{art.author}</span>
                      <span>•</span>
                      <span>{art.readingTime} phút đọc</span>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
