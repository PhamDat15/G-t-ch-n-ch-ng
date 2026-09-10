import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Link from "next/link";
import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q } = await searchParams;
  const query = q?.trim() || "";

  let articles: any[] = [];
  if (query) {
    articles = await prisma.article.findMany({
      where: {
        OR: [
          { title: { contains: query, mode: "insensitive" } },
          { sapo: { contains: query, mode: "insensitive" } },
          { content: { contains: query, mode: "insensitive" } },
          { author: { contains: query, mode: "insensitive" } },
        ],
      },
      select: {
        id: true,
        title: true,
        slug: true,
        sapo: true,
        thumbnail: true,
        author: true,
        readingTime: true,
        publishedAt: true,
        category: true,
      },
      orderBy: { publishedAt: "desc" },
    });
  }

  // Lấy thêm một số bài gợi ý nếu không có kết quả
  const suggestions = [
    "Mã Pí Lèng",
    "Sa Pa",
    "Phú Yên",
    "Phở bát đá",
    "Đà Lạt",
    "Độc hành",
    "Pù Luông",
  ];

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />

      <main className="flex-1 max-w-7xl mx-auto px-4 py-8 w-full">
        {/* Banner tiêu đề trang tìm kiếm */}
        <div className="border-b-2 border-[#0A2540] pb-4 mb-8">
          <span className="text-xs font-bold uppercase tracking-wider text-[#1A56DB]">
            Tra Cứu Dữ Liệu Tạp Chí
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0A2540] font-sans mt-1">
            {query ? `Kết quả tìm kiếm cho: "${query}"` : "Tìm kiếm bài viết & điểm đến"}
          </h1>
          <p className="text-xs text-slate-500 font-mono mt-1">
            {query ? `Tìm thấy ${articles.length} bài viết liên quan` : "Vui lòng nhập từ khóa để tìm kiếm"}
          </p>
        </div>

        {/* Danh sách bài viết tìm được */}
        {articles.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {articles.map((art) => (
              <article key={art.id} className="group space-y-3 pb-6 border-b border-slate-100 flex flex-col justify-between">
                <div>
                  <div className="aspect-[16/10] w-full overflow-hidden bg-slate-100 border border-slate-200">
                    {art.thumbnail && (
                      <img
                        src={art.thumbnail}
                        alt={art.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                      />
                    )}
                  </div>
                  <div className="mt-3">
                    <span className="text-[11px] font-bold text-[#1A56DB] uppercase tracking-wider block">
                      {art.category.name}
                    </span>
                    <Link
                      href={`/bai-viet/${art.slug}`}
                      className="text-base font-bold text-slate-900 group-hover:text-[#1A56DB] transition font-sans leading-snug line-clamp-2 block mt-1"
                    >
                      {art.title}
                    </Link>
                    <p className="text-xs text-slate-500 line-clamp-3 leading-relaxed mt-2">
                      {art.sapo}
                    </p>
                  </div>
                </div>

                <div className="text-[11px] text-slate-400 flex items-center space-x-2 pt-3 border-t border-slate-100">
                  <span className="font-semibold text-slate-600">{art.author}</span>
                  <span>•</span>
                  <span>{art.readingTime} phút đọc</span>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="py-12 bg-[#F8FAFC] border border-slate-200 rounded p-8 text-center space-y-4">
            <p className="text-base font-semibold text-slate-700">
              {query
                ? `Không tìm thấy bài viết nào phù hợp với từ khóa "${query}".`
                : "Bạn chưa nhập từ khóa tìm kiếm."}
            </p>
            <p className="text-xs text-slate-500">
              Hãy thử tìm kiếm với các từ khóa phổ biến dưới đây:
            </p>

            <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
              {suggestions.map((item) => (
                <Link
                  key={item}
                  href={`/tim-kiem?q=${encodeURIComponent(item)}`}
                  className="bg-white hover:bg-sky-50 border border-slate-300 hover:border-[#1A56DB] text-xs font-semibold text-[#0A2540] hover:text-[#1A56DB] px-3 py-1.5 rounded-full transition"
                >
                  {item}
                </Link>
              ))}
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
