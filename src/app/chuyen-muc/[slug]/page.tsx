import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Link from "next/link";
import Image from "next/image";
import { prisma } from "@/lib/db";
import { notFound } from "next/navigation";

export const revalidate = 60;

// Danh sách các chủ đề con tương ứng cho từng chuyên mục
const SUB_CATEGORIES_MAP: Record<string, string[]> = {
  "van-hoa": ["Di sản", "Lễ hội", "Góc nhìn", "Sách & Nghệ thuật"],
  "kham-pha": ["Điểm đến mới", "Trekking", "Săn mây", "Mùa vàng"],
  "am-thuc": ["Món ngon phố cổ", "Đặc sản vùng miền", "Bản đồ ăn uống", "Quán quen"],
  "luu-tru": ["Resort cao cấp", "Homestay bản địa", "Khách sạn xanh", "Khu nghỉ dưỡng"],
  "con-nguoi": ["Nghệ nhân", "Người giữ hồn bản", "Câu chuyện truyền cảm hứng", "Đời sống"],
  "kinh-nghiem": ["Lịch trình gợi ý", "Chuẩn bị hành trang", "Mẹo tiết kiệm", "An toàn du lịch"],
  "multimedia": ["Phóng sự ảnh", "Video trải nghiệm", "Podcast du lịch", "Infographic"],
};

function CategoryArticleImage({
  thumbnail,
  title,
  isVideo = false,
  className = "",
}: {
  thumbnail: string | null;
  title: string;
  isVideo?: boolean;
  className?: string;
}) {
  return (
    <div className="relative h-full w-full overflow-hidden bg-slate-900 group">
      {thumbnail ? (
        <Image
          src={thumbnail}
          alt={title}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className={`object-cover transition-transform duration-500 group-hover:scale-105 ${className}`}
        />
      ) : (
        <div className="h-full w-full bg-gradient-to-br from-[#123b5d] to-[#0a1826]" />
      )}

      {isVideo && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/25 group-hover:bg-black/15 transition">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#d49a37]/90 text-white shadow-lg backdrop-blur-sm group-hover:scale-110 group-hover:bg-[#d49a37] transition duration-300">
            <svg className="w-3.5 h-3.5 fill-current ml-0.5" viewBox="0 0 24 24">
              <path d="M8 5v14l11-7z" />
            </svg>
          </div>
        </div>
      )}
    </div>
  );
}

export default async function CategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  const category = await prisma.category.findUnique({
    where: { slug },
    include: {
      articles: {
        where: { status: "PUBLISHED" },
        orderBy: { publishedAt: "desc" },
        take: 35,
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
  const isVideoCategory = category.slug === "multimedia";
  const subCategories = SUB_CATEGORIES_MAP[category.slug] || ["Nổi bật", "Mới nhất", "Tiêu điểm", "Góc nhìn"];

  // 1. TẦNG 1: Cụm Tiêu điểm đầu trang (Hero Cluster)
  // Bài 1 là bài đinh lớn nhất; Bài 2, 3, 4, 5 là 4 bài vệ tinh xếp lưới 2x2 bên cạnh
  const leadArticle = articles[0];
  const clusterArticles = articles.slice(1, 5);

  // 2. TẦNG 2: Khối Top 6 Tin Nổi Bật (Trending Grid 1-6 chuẩn báo Tiền Phong)
  const trendingArticles = articles.slice(5, 11);

  // 3. TẦNG 3: Dòng chảy tin tức chuyên sâu (Feed danh sách cổ điển)
  const feedArticles = articles.slice(11);

  return (
    <div className="min-h-screen flex flex-col bg-[#fcfbf9] text-slate-900 antialiased selection:bg-[#d49a37] selection:text-white">
      <Header currentCategory={category.slug} />

      <main className="flex-1 max-w-7xl mx-auto px-4 py-6 md:py-8 w-full space-y-10">
        {/* HEADER CHUYÊN MỤC TRANG TRỌNG CĂN GIỮA (CHUẨN BÁO TIỀN PHONG) */}
        <div className="text-center border-b border-stone-200 pb-5">
          <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-black uppercase tracking-tight text-slate-900">
            {category.name}
          </h1>
          {/* Sub-categories nằm ngang */}
          <div className="mt-3 flex flex-wrap items-center justify-center gap-4 sm:gap-6 text-xs sm:text-sm font-semibold text-slate-600">
            {subCategories.map((sub, idx) => (
              <span key={sub} className="hover:text-[#b88226] cursor-pointer transition flex items-center gap-4 sm:gap-6">
                <span>{sub}</span>
                {idx < subCategories.length - 1 && <span className="text-slate-300 font-light">•</span>}
              </span>
            ))}
          </div>
          {category.description && (
            <p className="mt-2 text-xs sm:text-sm text-slate-500 font-light max-w-2xl mx-auto">
              {category.description}
            </p>
          )}
        </div>

        {articles.length === 0 ? (
          <div className="py-16 text-center border border-dashed border-stone-300 p-8 rounded-xl bg-white shadow-xs">
            <p className="text-slate-600 mb-4">Chuyên mục này hiện chưa có bài viết nào.</p>
            <Link
              href="/"
              className="inline-block rounded-lg bg-[#175b8f] px-5 py-2.5 text-sm font-bold text-white transition hover:bg-[#2576ae]"
            >
              Trở về trang chủ
            </Link>
          </div>
        ) : (
          <>
            {/* ============================================================== */}
            {/* TẦNG 1: HERO CLUSTER ĐẦU TRANG (1 BÀI ĐINH + 4 BÀI VỆ TINH 2x2) */}
            {/* ============================================================== */}
            {leadArticle && (
              <section className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 pb-8 border-b border-stone-200">
                {/* CỘT TRÁI (7/12): BÀI TIÊU ĐIỂM SỐ 1 CỦA CHUYÊN MỤC */}
                <article className="lg:col-span-7 group">
                  <Link href={`/bai-viet/${leadArticle.slug}`} className="block">
                    <div className="relative aspect-[16/10] w-full overflow-hidden rounded-xl bg-stone-100 shadow-sm">
                      <CategoryArticleImage
                        thumbnail={leadArticle.thumbnail}
                        title={leadArticle.title}
                        isVideo={isVideoCategory}
                      />
                    </div>
                    <h2 className="mt-3.5 font-serif text-xl sm:text-2xl md:text-3xl font-bold leading-snug text-slate-900 group-hover:text-[#b88226] transition">
                      {leadArticle.title}
                    </h2>
                    <p className="mt-2 text-xs sm:text-sm text-slate-600 leading-relaxed font-light line-clamp-3">
                      <span className="font-bold text-slate-800 uppercase mr-1">VNT —</span>
                      {leadArticle.sapo}
                    </p>
                    <div className="mt-2.5 flex items-center gap-2 text-[11px] text-slate-400">
                      <span className="font-semibold text-slate-700">{leadArticle.author}</span>
                      <span>•</span>
                      <span>
                        {isVideoCategory
                          ? `${leadArticle.readingTime} phút xem`
                          : `${leadArticle.readingTime} phút đọc`}
                      </span>
                    </div>
                  </Link>
                </article>

                {/* CỘT PHẢI (5/12): LƯỚI 4 BÀI VỆ TINH (2 HÀNG x 2 CỘT) */}
                <div className="lg:col-span-5 grid grid-cols-1 sm:grid-cols-2 gap-4.5 content-start">
                  {clusterArticles.map((art) => (
                    <article key={art.id} className="group">
                      <Link href={`/bai-viet/${art.slug}`} className="block space-y-2">
                        <div className="relative aspect-[16/10] w-full overflow-hidden rounded-lg bg-stone-100 shadow-xs">
                          <CategoryArticleImage
                            thumbnail={art.thumbnail}
                            title={art.title}
                            isVideo={isVideoCategory}
                          />
                        </div>
                        <h3 className="font-serif text-xs sm:text-sm font-bold leading-snug text-slate-900 group-hover:text-[#b88226] transition line-clamp-2">
                          {isVideoCategory && <span className="mr-1 text-red-600">▶</span>}
                          {art.title}
                        </h3>
                      </Link>
                    </article>
                  ))}
                </div>
              </section>
            )}

            {/* ============================================================== */}
            {/* TẦNG 2: DẢI TOP 6 TIN NỔI BẬT (ĐÁNH SỐ 1 ĐẾN 6 TIỀN PHONG)    */}
            {/* ============================================================== */}
            {trendingArticles.length > 0 && (
              <section className="py-2 pb-8 border-b border-stone-200">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {trendingArticles.map((art, idx) => {
                    const number = idx + 1;
                    const isTopThree = idx < 3;

                    return (
                      <article key={art.id} className="group flex flex-col justify-between">
                        <Link href={`/bai-viet/${art.slug}`} className="block">
                          {/* 3 bài đầu có thumbnail phía trên */}
                          {isTopThree && (
                            <div className="relative aspect-[16/10] w-full overflow-hidden rounded-lg bg-stone-100 shadow-xs mb-3">
                              <CategoryArticleImage
                                thumbnail={art.thumbnail}
                                title={art.title}
                                isVideo={isVideoCategory}
                              />
                            </div>
                          )}

                          <div className="flex items-start gap-3">
                            {/* Số thứ tự 1-6 in to màu pastel nhạt */}
                            <span className="font-serif text-3xl sm:text-4xl font-black text-rose-300/80 leading-none shrink-0 select-none">
                              {number}
                            </span>
                            <div className="min-w-0">
                              <h4 className="font-serif text-sm sm:text-[15px] font-bold leading-snug text-slate-900 group-hover:text-[#b88226] transition line-clamp-2">
                                {art.title}
                              </h4>
                              {!isTopThree && (
                                <p className="mt-1 text-xs text-slate-500 line-clamp-2 font-light">
                                  {art.sapo}
                                </p>
                              )}
                            </div>
                          </div>
                        </Link>
                      </article>
                    );
                  })}
                </div>
              </section>
            )}

            {/* ============================================================== */}
            {/* TẦNG 3: DÒNG CHẢY TIN TỨC CHUYÊN SÂU (CLASSIC LIST FEED)      */}
            {/* ============================================================== */}
            {feedArticles.length > 0 && (
              <section className="space-y-6 pt-2">
                <div className="flex items-center justify-between border-b-2 border-slate-900 pb-2">
                  <h3 className="font-serif text-lg font-black uppercase tracking-wide text-slate-900">
                    Tin Mới Nhất Trong Chuyên Mục
                  </h3>
                </div>

                <div className="space-y-5 divide-y divide-stone-200">
                  {feedArticles.map((art) => (
                    <article key={art.id} className="pt-5 first:pt-0 group">
                      <Link
                        href={`/bai-viet/${art.slug}`}
                        className="grid grid-cols-1 sm:grid-cols-[220px_1fr] md:grid-cols-[260px_1fr] gap-4 sm:gap-6 items-start"
                      >
                        <div className="relative aspect-[16/10] w-full overflow-hidden rounded-lg bg-stone-100 shadow-xs shrink-0">
                          <CategoryArticleImage
                            thumbnail={art.thumbnail}
                            title={art.title}
                            isVideo={isVideoCategory}
                          />
                        </div>
                        <div className="min-w-0">
                          <h4 className="font-serif text-base sm:text-lg font-bold leading-snug text-slate-900 group-hover:text-[#b88226] transition">
                            {art.title}
                          </h4>
                          <p className="mt-2 text-xs sm:text-sm text-slate-600 line-clamp-3 leading-relaxed font-light">
                            <span className="font-bold text-slate-800 uppercase mr-1">VNT —</span>
                            {art.sapo}
                          </p>
                          <div className="mt-2 flex items-center gap-2 text-[11px] text-slate-400">
                            <span className="font-semibold text-slate-600">{art.author}</span>
                            <span>•</span>
                            <span>
                              {isVideoCategory
                                ? `${art.readingTime} phút xem`
                                : `${art.readingTime} phút đọc`}
                            </span>
                          </div>
                        </div>
                      </Link>
                    </article>
                  ))}
                </div>
              </section>
            )}
          </>
        )}
      </main>

      <Footer />
    </div>
  );
}
