import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Link from "next/link";
import Image from "next/image";
import { prisma } from "@/lib/db";
import VietnamWeatherWidget from "@/components/VietnamWeatherWidget";
import HotFlightRoutes from "@/components/HotFlightRoutes";
import TravelAdviceWidget from "@/components/TravelAdviceWidget";
import HeroCarousel from "@/components/HeroCarousel";

export const revalidate = 60;

const CARD_SELECT = {
  id: true,
  title: true,
  slug: true,
  sapo: true,
  thumbnail: true,
  author: true,
  isHero: true,
  isFeatured: true,
  readingTime: true,
  publishedAt: true,
  category: {
    select: {
      name: true,
      slug: true,
    },
  },
} as const;

type CardArticle = {
  id: string;
  title: string;
  slug: string;
  sapo: string;
  thumbnail: string | null;
  author: string;
  isHero: boolean;
  isFeatured: boolean;
  readingTime: number;
  publishedAt: Date | string;
  category: {
    name: string;
    slug: string;
  };
};

function ArticleImage({
  article,
  className = "",
}: {
  article: { thumbnail: string | null; title: string; category?: { slug: string } };
  className?: string;
}) {
  const isVideo = article.category?.slug === "multimedia";

  return (
    <div className="relative h-full w-full overflow-hidden bg-slate-900 group">
      {article.thumbnail ? (
        <Image
          src={article.thumbnail}
          alt={article.title}
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

// Component Box chuyên mục chuẩn 100% bố cục VnExpress
function VnExpressCategorySection({
  title,
  slug,
  subCategories,
  accentColor = "#9b2c2c",
  articles,
}: {
  title: string;
  slug: string;
  subCategories: string[];
  accentColor?: string;
  articles: CardArticle[];
}) {
  if (!articles || articles.length === 0) return null;

  const lead1 = articles[0];
  const lead2 = articles[1];
  const subBullets = articles.slice(2, 5);

  return (
    <div className="space-y-4">
      {/* 1. HEADER CHUYÊN MỤC CÓ GẠCH CHÂN MÀU VÀ TIỂU MỤC NẰM NGANG */}
      <div className="flex flex-wrap items-baseline justify-between border-b border-stone-200 pb-1.5 gap-2">
        <div className="flex items-baseline gap-4 flex-wrap">
          <Link
            href={`/chuyen-muc/${slug}`}
            className="font-serif text-xl sm:text-2xl font-black text-slate-900 hover:text-amber-700 transition relative pb-1.5"
            style={{ borderBottom: `2px solid ${accentColor}` }}
          >
            {title}
          </Link>
          {/* Sub-categories ngang phong cách VNE */}
          <div className="hidden sm:flex items-center gap-3 text-xs text-slate-500 font-sans">
            {subCategories.map((sub) => (
              <span key={sub} className="hover:text-slate-900 cursor-pointer transition">
                {sub}
              </span>
            ))}
          </div>
        </div>
        <Link
          href={`/chuyen-muc/${slug}`}
          className="text-xs font-semibold text-slate-400 hover:text-slate-800 transition"
        >
          Xem thêm →
        </Link>
      </div>

      {/* 2. HÀNG TRÊN: 2 BÀI NỔI BẬT SONG SONG */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 items-start">
        {/* Bài 1 (trái): Ảnh ngang bên trái + Tiêu đề & Sapo bên phải */}
        {lead1 && (
          <article className="group">
            <Link href={`/bai-viet/${lead1.slug}`} className="block">
              <div className="grid grid-cols-[140px_1fr] sm:grid-cols-[160px_1fr] gap-3.5 items-start">
                <div className="relative aspect-[16/11] overflow-hidden rounded bg-stone-100 shadow-xs shrink-0">
                  <ArticleImage article={lead1} />
                </div>
                <div className="min-w-0">
                  <h4 className="font-serif text-[15px] sm:text-base font-bold leading-snug text-slate-900 group-hover:text-[#b88226] transition line-clamp-2">
                    {lead1.title}
                  </h4>
                  <p className="mt-1.5 text-xs text-slate-600 line-clamp-3 leading-relaxed font-light">
                    {lead1.sapo}
                  </p>
                </div>
              </div>
            </Link>
          </article>
        )}

        {/* Bài 2 (phải): Tiêu đề in đậm & Sapo đầy đủ (có hoặc không ảnh) */}
        {lead2 && (
          <article className="group md:border-l md:border-stone-200 md:pl-5">
            <Link href={`/bai-viet/${lead2.slug}`} className="block">
              <h4 className="font-serif text-[15px] sm:text-base font-bold leading-snug text-slate-900 group-hover:text-[#b88226] transition line-clamp-2">
                {lead2.title}
              </h4>
              <p className="mt-2 text-xs text-slate-600 line-clamp-4 leading-relaxed font-light">
                {lead2.sapo}
              </p>
              <span className="mt-2 inline-block text-[11px] text-slate-400">
                {lead2.author} · {lead2.readingTime} phút đọc
              </span>
            </Link>
          </article>
        )}
      </div>

      {/* 3. HÀNG DƯỚI: 3 TIN GẠCH ĐẦU DÒNG NẰM TRÊN 3 CỘT SONG SONG (GRID 3 CỘT VNE) */}
      {subBullets.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-3.5 border-t border-stone-200">
          {subBullets.map((sub) => (
            <article key={sub.id} className="group">
              <Link href={`/bai-viet/${sub.slug}`} className="flex items-start gap-2">
                <span className="text-slate-400 font-bold text-sm leading-none shrink-0 mt-0.5">•</span>
                <h5 className="font-serif text-[13px] font-semibold leading-relaxed text-slate-800 group-hover:text-[#b88226] transition line-clamp-2">
                  {sub.title}
                </h5>
              </Link>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}

export default async function HomePage() {
  let articles: CardArticle[] = [];
  try {
    articles = (await prisma.article.findMany({
      where: { status: "PUBLISHED" },
      take: 60,
      orderBy: { publishedAt: "desc" },
      select: CARD_SELECT,
    })) as unknown as CardArticle[];
  } catch (err) {
    console.error("Lỗi truy vấn bài viết trang chủ:", err);
    articles = [];
  }

  // 1. Nhóm bài tiêu điểm cho Hero Carousel (Ưu tiên bài isHero + các bài mới nhất, lấy 4 bài)
  const heroCandidates = articles.filter((a) => a.isHero);
  const otherCandidates = articles.filter((a) => !a.isHero);
  const heroArticles = [...heroCandidates, ...otherCandidates].slice(0, 4);
  const heroIds = new Set(heroArticles.map((a) => a.id));

  // Các bài còn lại sau nhóm Hero
  const remainingAfterHero = articles.filter((a) => !heroIds.has(a.id));

  // 2. Nhóm Đọc Nhiều (3 bài)
  const mostRead = remainingAfterHero.slice(0, 3);
  const remainingAfterMostRead = remainingAfterHero.slice(3);

  // 3. Cột trái: Dòng thời sự du lịch chuẩn VnExpress (5 bài)
  const streamNews = remainingAfterMostRead.slice(0, 5);
  const blockPool = remainingAfterMostRead.slice(5);

  // 4. Nhóm chuyên mục chuẩn VnExpress (Khối Khám phá & Khối Văn hóa)
  const khamPhaArticles = blockPool.filter(
    (a) => a.category.slug === "kham-pha" || a.category.slug === "kinh-nghiem" || a.category.slug === "luu-tru"
  );
  const vanHoaArticles = blockPool.filter(
    (a) => a.category.slug === "van-hoa" || a.category.slug === "con-nguoi" || a.category.slug === "am-thuc"
  );
  const multimediaArticles = articles.filter((a) => a.category.slug === "multimedia").slice(0, 4);

  // Fallback đảm bảo đủ bài cho 2 block chuyên mục
  const blockAArticles = khamPhaArticles.length >= 5 ? khamPhaArticles.slice(0, 5) : blockPool.slice(0, 5);
  const blockBArticles = vanHoaArticles.length >= 5 ? vanHoaArticles.slice(0, 5) : blockPool.slice(5, 10);

  return (
    <div className="min-h-screen bg-[#fcfbf9] text-slate-900 antialiased selection:bg-[#d49a37] selection:text-white">
      <Header />

      <main className="mx-auto max-w-7xl px-4 py-6 md:py-8 space-y-10">
        {/* ============================================================== */}
        {/* SECTION 1: HERO SPOTLIGHT CAROUSEL & ĐỌC NHIỀU                */}
        {/* ============================================================== */}
        <section className="grid grid-cols-1 gap-6 lg:grid-cols-12 lg:gap-8">
          {/* CỘT CHÍNH HERO CAROUSEL LƯỚT SLIDE (8/12) */}
          <div className="lg:col-span-8">
            <HeroCarousel articles={heroArticles} />
          </div>

          {/* CỘT PHẢI: ĐỌC NHIỀU (4/12) */}
          <aside className="lg:col-span-4 flex flex-col justify-between">
            <div className="rounded-2xl border border-stone-200/80 bg-white p-5 sm:p-6 shadow-sm">
              <div className="mb-4 flex items-center gap-3 border-b border-stone-200 pb-3">
                <h2 className="font-serif text-lg sm:text-xl font-black tracking-wide text-slate-900 uppercase">
                  Đọc Nhiều
                </h2>
                <div className="h-0.5 flex-1 bg-gradient-to-r from-[#d49a37] to-transparent" />
              </div>

              {/* Danh sách bài đọc nhiều với số thứ tự tinh gọn */}
              <div className="divide-y divide-stone-100">
                {mostRead.map((article, index) => (
                  <article key={article.id} className="group py-3 first:pt-0 last:pb-0">
                    <Link href={`/bai-viet/${article.slug}`} className="flex items-start gap-3">
                      <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded bg-amber-50 text-[11px] font-black text-[#b88226] border border-amber-200/70 font-mono mt-0.5">
                        {index + 1}
                      </span>

                      <div className="relative h-14 w-20 sm:h-16 sm:w-22 shrink-0 overflow-hidden rounded-md bg-stone-100 shadow-sm">
                        <ArticleImage article={article} />
                      </div>

                      <div className="min-w-0 flex-1">
                        <h3 className="font-serif text-xs sm:text-[13px] font-bold leading-snug text-slate-900 transition group-hover:text-[#b88226] line-clamp-2">
                          {article.title}
                        </h3>
                        <p className="mt-1 text-[10px] font-medium text-slate-400">
                          <span className="text-[#d49a37] font-semibold">{article.category.name}</span>
                          {" · "}
                          {article.category.slug === "multimedia" ? (
                            <span className="text-amber-700 font-bold">
                              {article.readingTime} phút xem
                            </span>
                          ) : (
                            `${article.readingTime} phút đọc`
                          )}
                        </p>
                      </div>
                    </Link>
                  </article>
                ))}
              </div>
            </div>

            {/* Dòng sự kiện 24/7 */}
            <div className="mt-4 relative overflow-hidden rounded-2xl border border-amber-200/80 bg-gradient-to-br from-[#fffdfa] to-[#fef6e9] p-4 shadow-sm">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="flex h-5 w-5 items-center justify-center rounded bg-[#d49a37]/15 text-[#b88226]">
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </span>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-800">
                    Dòng Sự Kiện 24/7
                  </span>
                </div>
                <Link href="/su-kien" aria-label="Xem dòng sự kiện" className="text-stone-400 hover:text-stone-700 transition">
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7"/></svg>
                </Link>
              </div>

              <div className="flex items-start gap-2 pt-1 border-t border-amber-200/50">
                <span className="text-xs font-black text-[#d49a37] font-mono">TIN MỚI:</span>
                <p className="text-[11px] font-medium leading-relaxed text-slate-700">
                  Khám phá vẻ đẹp bất tận của non nước, văn hóa truyền thống và ẩm thực tinh hoa đất Việt.
                </p>
              </div>
            </div>
          </aside>
        </section>

        {/* ============================================================== */}
        {/* SECTION 2: BỐ CỤC 100% CHUẨN VNEXPRESS                          */}
        {/* ============================================================== */}
        <section className="pt-6 border-t-2 border-stone-200">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            {/* CỘT TRÁI (4.5/12): DÒNG THỜI SỰ CHUẨN VNE (TIÊU ĐỀ TRÊN, ẢNH + SAPO DƯỚI) */}
            <div className="lg:col-span-5 space-y-5 divide-y divide-stone-200">
              <div className="pb-1 border-b-2 border-slate-900">
                <h2 className="font-serif text-lg font-black uppercase tracking-wide text-slate-900">
                  Thời sự Du lịch & Di sản
                </h2>
              </div>

              {streamNews.map((article) => (
                <article key={article.id} className="pt-4 first:pt-0 group">
                  <Link href={`/bai-viet/${article.slug}`} className="block">
                    {/* TIÊU ĐỀ NẰM TRÊN CÙNG CHUẨN VNE */}
                    <h3 className="font-serif text-sm sm:text-[15px] font-bold leading-snug text-slate-900 group-hover:text-[#b88226] transition">
                      {article.title}
                    </h3>

                    {/* DƯỚI TIÊU ĐỀ: ẢNH VUÔNG BÊN TRÁI + ĐOẠN SAPO BÊN PHẢI */}
                    <div className="mt-2.5 grid grid-cols-[110px_1fr] sm:grid-cols-[130px_1fr] gap-3 items-start">
                      <div className="relative aspect-[16/11] overflow-hidden rounded bg-stone-100 shadow-xs shrink-0">
                        <ArticleImage article={article} />
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed font-light">
                          {article.sapo}
                        </p>
                        <span className="mt-1.5 inline-block text-[10px] font-medium text-slate-400">
                          {article.author} ·{" "}
                          {article.category.slug === "multimedia" ? (
                            <span className="text-amber-700 font-bold">
                              {article.readingTime} phút xem
                            </span>
                          ) : (
                            `${article.readingTime} phút đọc`
                          )}
                        </span>
                      </div>
                    </div>
                  </Link>
                </article>
              ))}
            </div>

            {/* CỘT PHẢI (7.5/12): CÁC BOX CHUYÊN MỤC BÁO CHÍ CHUẨN 100% VNE */}
            <div className="lg:col-span-7 space-y-8 lg:border-l lg:border-stone-200 lg:pl-8">
              
              {/* BOX 1: KHÁM PHÁ & TRẢI NGHIỆM */}
              <VnExpressCategorySection
                title="Khám phá"
                slug="kham-pha"
                subCategories={["Điểm đến", "Kinh nghiệm", "Mùa vàng", "Lưu trú", "Phượt"]}
                accentColor="#b88226"
                articles={blockAArticles}
              />

              {/* BOX 2: VĂN HÓA & DI SẢN */}
              <VnExpressCategorySection
                title="Văn hóa"
                slug="van-hoa"
                subCategories={["Di sản", "Lễ hội", "Con người", "Ẩm thực truyền thống"]}
                accentColor="#175b8f"
                articles={blockBArticles}
              />

              {/* BOX 3: MULTIMEDIA VIDEO PHÓNG SỰ */}
              {multimediaArticles.length > 0 && (
                <div className="rounded-xl bg-[#0c1f33] p-5 text-white shadow-md">
                  <div className="flex items-center justify-between border-b border-white/10 pb-3 mb-4">
                    <div className="flex items-center gap-2">
                      <span className="flex h-5 w-5 items-center justify-center rounded-full bg-red-600 text-white text-[10px]">
                        ▶
                      </span>
                      <h3 className="font-serif text-base font-bold uppercase tracking-wider text-amber-300">
                        Video Phóng sự Multimedia
                      </h3>
                    </div>
                    <Link href="/chuyen-muc/multimedia" className="text-xs text-slate-300 hover:text-amber-300">
                      Xem tất cả video →
                    </Link>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {multimediaArticles.slice(0, 2).map((vid) => (
                      <article key={vid.id} className="group">
                        <Link href={`/bai-viet/${vid.slug}`} className="block">
                          <div className="relative aspect-video overflow-hidden rounded-lg bg-black">
                            <ArticleImage article={vid} />
                          </div>
                          <h4 className="mt-2 font-serif text-xs sm:text-sm font-bold text-white group-hover:text-amber-300 transition line-clamp-2">
                            {vid.title}
                          </h4>
                        </Link>
                      </article>
                    ))}
                  </div>
                </div>
              )}

            </div>
          </div>
        </section>

        {/* ============================================================== */}
        {/* SECTION 3: TIỆN ÍCH DÀNH CHO DU KHÁCH & VÉ MÁY BAY / TOUR      */}
        {/* ============================================================== */}
        <section className="rounded-2xl border border-stone-200 bg-white p-6 shadow-sm">
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
            <div className="lg:col-span-7 space-y-6">
              <VietnamWeatherWidget />
              <TravelAdviceWidget />
            </div>
            <div className="lg:col-span-5 border-t lg:border-t-0 lg:border-l border-stone-200 pt-6 lg:pt-0 lg:pl-8">
              <HotFlightRoutes />
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
