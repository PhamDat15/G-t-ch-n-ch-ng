import Header from "@/components/Header";
import Footer from "@/components/Footer";
import HotFlightRoutes from "@/components/HotFlightRoutes";
import VietnamWeatherWidget from "@/components/VietnamWeatherWidget";
import TravelAdviceWidget from "@/components/TravelAdviceWidget";
import Link from "next/link";
import Image from "next/image";
import { prisma } from "@/lib/db";

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
  viewCount: true,
  readingTime: true,
  publishedAt: true,
  category: true,
};

function ArticleImage({
  article,
  className = "",
}: {
  article: { thumbnail: string | null; title: string };
  className?: string;
}) {
  return article.thumbnail ? (
    <Image
      fill
      sizes="(max-width: 768px) 100vw, 50vw"
      src={article.thumbnail}
      alt={article.title}
      className={`object-cover transition duration-500 group-hover:scale-[1.03] ${className}`}
    />
  ) : (
    <div className="h-full w-full bg-gradient-to-br from-slate-800 to-slate-900" />
  );
}

export default async function HomePage() {
  const articles = await prisma.article.findMany({
    take: 30,
    orderBy: { publishedAt: "desc" },
    select: CARD_SELECT,
  });

  const hero = articles.find((article) => article.isHero) ?? articles[0];
  const afterHero = articles.filter((article) => article.id !== hero?.id);

  // Nhóm bài đọc nhiều (Trending / Featured) bên phải
  const mostRead = afterHero.slice(0, 3);
  const remaining = afterHero.slice(3);

  // Tin mới cập nhật (Hàng ngang 3 bài phía dưới Hero)
  const recentUpdates = remaining.slice(0, 3);
  const nextArticles = remaining.slice(3);

  // Luồng tin dòng chảy Việt Nam (phía dưới)
  const streamArticles = nextArticles.slice(0, 8);

  return (
    <div className="min-h-screen bg-[#fcfbf9] text-slate-900 antialiased selection:bg-[#d49a37] selection:text-white">
      <Header />

      <main className="mx-auto max-w-7xl px-4 py-6 md:py-8">
        {/* ============================================================== */}
        {/* SECTION 1: HERO SPOTLIGHT (BÊN TRÁI) & ĐỌC NHIỀU (BÊN PHẢI)    */}
        {/* ============================================================== */}
        <section className="grid grid-cols-1 gap-6 lg:grid-cols-12 lg:gap-8">
          {/* CỘT CHÍNH HERO BANNER (8/12) */}
          <div className="lg:col-span-8">
            {hero && (
              <article className="group relative overflow-hidden rounded-2xl shadow-xl shadow-slate-900/10 bg-slate-900">
                <Link href={`/bai-viet/${hero.slug}`} className="block relative aspect-[16/10] sm:aspect-[16/9] w-full overflow-hidden">
                  <ArticleImage
                    article={hero}
                    className="brightness-[0.9] group-hover:brightness-95 transition-all duration-700"
                  />
                  {/* Lớp phủ Gradient điện ảnh chuẩn tạp chí */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/45 to-transparent" />

                  {/* Nội dung chữ đè trên ảnh */}
                  <div className="absolute inset-0 flex flex-col justify-end p-5 sm:p-8 md:p-10 text-white">
                    {/* Category tag */}
                    <div className="mb-2.5 flex items-center gap-2">
                      <span className="text-[#d49a37] font-black text-xs">|</span>
                      <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#d49a37]">
                        {hero.category.name}
                      </span>
                    </div>

                    {/* Tiêu đề bài viết */}
                    <h1 className="font-serif text-2xl sm:text-3xl md:text-4xl lg:text-[40px] font-bold leading-tight sm:leading-tight text-white transition-colors duration-300 group-hover:text-amber-200">
                      {hero.title}
                    </h1>

                    {/* Tóm tắt Sapo */}
                    <p className="mt-3 line-clamp-2 sm:line-clamp-3 text-xs sm:text-sm md:text-base leading-relaxed text-slate-200/90 font-light max-w-3xl">
                      {hero.sapo}
                    </p>

                    {/* Nút Đọc bài viết & Dots */}
                    <div className="mt-5 flex items-center justify-between">
                      <span className="inline-flex items-center gap-2 rounded-lg bg-[#d49a37] px-4 py-2 text-xs sm:text-sm font-bold text-slate-950 shadow-md transition group-hover:bg-[#b88226]">
                        Đọc bài viết
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3"/></svg>
                      </span>

                      {/* Slider Dots trang trí */}
                      <div className="flex items-center gap-2">
                        <span className="h-2 w-2 rounded-full bg-[#d49a37]" />
                        <span className="h-2 w-2 rounded-full bg-white/40" />
                        <span className="h-2 w-2 rounded-full bg-white/40" />
                      </div>
                    </div>
                  </div>
                </Link>
              </article>
            )}
          </div>

          {/* CỘT PHẢI: ĐỌC NHIỀU (4/12) */}
          <aside className="lg:col-span-4 flex flex-col justify-between">
            <div className="rounded-2xl border border-stone-200/80 bg-white p-5 sm:p-6 shadow-sm">
              {/* Header "ĐỌC NHIỀU" phong cách Serif cổ điển */}
              <div className="mb-5 flex items-center gap-3 border-b border-stone-200 pb-3">
                <h2 className="font-serif text-xl sm:text-2xl font-black tracking-wide text-slate-900 uppercase">
                  Đọc Nhiều
                </h2>
                <div className="h-0.5 flex-1 bg-gradient-to-r from-[#d49a37] to-transparent" />
              </div>

              {/* Danh sách bài đọc nhiều 01, 02, 03 */}
              <div className="divide-y divide-stone-100">
                {mostRead.map((article, index) => (
                  <article key={article.id} className="group py-3.5 first:pt-0 last:pb-0">
                    <Link href={`/bai-viet/${article.slug}`} className="flex items-start gap-4">
                      {/* Số thứ tự lớn màu vàng Gold */}
                      <span className="font-serif text-2xl sm:text-3xl font-black text-[#d49a37] shrink-0 w-8">
                        {String(index + 1).padStart(2, "0")}
                      </span>

                      {/* Thumbnail nhỏ vuông bo góc */}
                      <div className="relative h-16 w-20 sm:h-18 sm:w-24 shrink-0 overflow-hidden rounded-lg bg-stone-100 shadow-sm">
                        <ArticleImage article={article} />
                      </div>

                      {/* Tiêu đề & meta */}
                      <div className="min-w-0 flex-1">
                        <h3 className="font-serif text-sm font-bold leading-snug text-slate-900 transition group-hover:text-[#b88226] line-clamp-2">
                          {article.title}
                        </h3>
                        <p className="mt-1 text-[11px] font-medium text-slate-400">
                          <span className="text-[#d49a37] font-semibold">{article.category.name}</span> · {article.readingTime} phút đọc
                        </p>
                      </div>
                    </Link>
                  </article>
                ))}
              </div>
            </div>

            {/* Dòng sự kiện 24/7 (Khối banner dưới đọc nhiều) */}
            <div className="mt-5 relative overflow-hidden rounded-2xl border border-amber-200/80 bg-gradient-to-br from-[#fffdfa] to-[#fef6e9] p-5 shadow-sm">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="flex h-6 w-6 items-center justify-center rounded-md bg-[#d49a37]/15 text-[#b88226]">
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>
                  </span>
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-800">
                    Dòng Sự Kiện
                  </span>
                </div>
                <Link href="/su-kien" aria-label="Xem dòng sự kiện" className="flex h-6 w-6 items-center justify-center rounded-full border border-stone-300 text-stone-500 hover:text-stone-900 transition">
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7"/></svg>
                </Link>
              </div>

              <div className="flex items-start gap-3 mt-3 pt-2 border-t border-amber-200/60">
                <span className="text-base font-black text-[#d49a37] font-mono leading-none pt-0.5">
                  24/7
                </span>
                <p className="text-xs font-medium leading-relaxed text-slate-700">
                  Những hành trình chạm vào vẻ đẹp văn hóa, con người và di sản Việt Nam.
                </p>
              </div>
            </div>
          </aside>
        </section>

        {/* ============================================================== */}
        {/* SECTION 2: TIN MỚI CẬP NHẬT (GRID 3 CỘT NGANG)               */}
        {/* ============================================================== */}
        <section className="mt-10 sm:mt-12 pt-8 border-t border-stone-200">
          <div className="mb-6 flex items-baseline justify-between">
            <h2 className="font-serif text-2xl sm:text-3xl font-black text-slate-900">
              Tin mới cập nhật
            </h2>
            <Link
              href="/tim-kiem"
              className="group flex items-center gap-1.5 text-xs sm:text-sm font-bold text-slate-600 hover:text-[#b88226] transition"
            >
              <span>Xem tất cả</span>
              <svg className="w-3.5 h-3.5 transition transform group-hover:translate-x-1" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3"/></svg>
            </Link>
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3">
            {recentUpdates.map((article) => (
              <article key={article.id} className="group flex flex-col">
                <Link href={`/bai-viet/${article.slug}`} className="block overflow-hidden rounded-xl bg-stone-100 shadow-sm">
                  <div className="relative aspect-[16/10] w-full overflow-hidden">
                    <ArticleImage article={article} />
                  </div>
                </Link>
                <div className="mt-3 flex flex-1 flex-col">
                  <p className="text-[11px] font-bold uppercase tracking-wider text-[#d49a37]">
                    {article.category.name}
                  </p>
                  <Link href={`/bai-viet/${article.slug}`} className="mt-1">
                    <h3 className="font-serif text-base font-bold leading-snug text-slate-900 group-hover:text-[#b88226] transition line-clamp-2">
                      {article.title}
                    </h3>
                  </Link>
                  <p className="mt-1.5 line-clamp-2 text-xs leading-relaxed text-slate-500">
                    {article.sapo}
                  </p>
                  <p className="mt-auto pt-2 text-[11px] text-slate-400">
                    {article.readingTime} phút đọc
                  </p>
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* ============================================================== */}
        {/* SECTION 3: TIỆN ÍCH DÀNH CHO DU KHÁCH & VÉ MÁY BAY / TOUR      */}
        {/* ============================================================== */}
        <section className="mt-12 rounded-2xl border border-stone-200 bg-white p-6 shadow-sm">
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

        {/* ============================================================== */}
        {/* SECTION 4: DÒNG CHẢY VIỆT NAM (LUỒNG BÀI VIẾT TẠP CHÍ)         */}
        {/* ============================================================== */}
        <section className="mt-12 pt-8 border-t border-stone-200">
          <div className="mb-8 flex items-end justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#d49a37]">
                Dòng chảy Việt Nam
              </p>
              <h2 className="mt-1 font-serif text-3xl font-black text-slate-900">
                Câu chuyện & Di sản
              </h2>
            </div>
            <Link
              href="/tim-kiem"
              className="text-xs sm:text-sm font-bold text-[#175b8f] hover:text-[#b88226] hover:underline"
            >
              Xem thêm bài viết →
            </Link>
          </div>

          {streamArticles.length > 0 ? (
            <div className="grid gap-x-8 gap-y-7 md:grid-cols-2">
              {streamArticles.map((article) => (
                <article
                  key={article.id}
                  className="group grid grid-cols-[130px_1fr] sm:grid-cols-[170px_1fr] gap-4 rounded-xl border border-stone-100 bg-white p-3.5 shadow-sm hover:shadow-md transition"
                >
                  <Link
                    href={`/bai-viet/${article.slug}`}
                    className="relative aspect-[16/11] overflow-hidden rounded-lg bg-stone-100"
                  >
                    <ArticleImage article={article} />
                  </Link>
                  <div className="flex flex-col justify-between min-w-0">
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-[#d49a37]">
                        {article.category.name}
                      </span>
                      <Link href={`/bai-viet/${article.slug}`}>
                        <h3 className="mt-1 font-serif text-sm sm:text-base font-bold leading-snug text-slate-900 group-hover:text-[#b88226] transition line-clamp-2">
                          {article.title}
                        </h3>
                      </Link>
                      <p className="mt-1.5 hidden sm:line-clamp-2 text-xs leading-relaxed text-slate-500">
                        {article.sapo}
                      </p>
                    </div>
                    <p className="mt-2 text-[11px] text-slate-400">
                      {article.author} · {article.readingTime} phút đọc
                    </p>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <div className="rounded-xl border border-dashed border-stone-300 bg-stone-50 p-10 text-center text-sm text-slate-500">
              Các bài viết tiếp theo sẽ xuất hiện tại đây.
            </div>
          )}
        </section>
      </main>

      <Footer />
    </div>
  );
}
