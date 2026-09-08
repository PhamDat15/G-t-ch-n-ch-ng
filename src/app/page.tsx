import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Link from "next/link";
import Image from "next/image";
import { prisma } from "@/lib/db";
import { seedSampleArticles } from "@/lib/seed";
import { CATEGORIES } from "@/lib/categories";
import HotFlightRoutes from "@/components/HotFlightRoutes";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  await seedSampleArticles();

  // 1. Lấy bài tiêu điểm lớn (Hero)
  const heroArticle =
    (await prisma.article.findFirst({
      where: { isHero: true },
      include: { category: true },
    })) ||
    (await prisma.article.findFirst({
      orderBy: { publishedAt: "desc" },
      include: { category: true },
    }));

  // 2. Lấy 3 bài tiêu điểm phụ bên dưới Hero
  const subHeroArticles = await prisma.article.findMany({
    where: { id: { not: heroArticle?.id } },
    take: 3,
    orderBy: { publishedAt: "desc" },
    include: { category: true },
  });

  // 3. Lấy danh sách tin mới / tin thời sự cho cột bên trái
  const latestArticles = await prisma.article.findMany({
    take: 6,
    orderBy: { publishedAt: "desc" },
    include: { category: true },
  });

  // 4. Lấy danh sách bài nổi bật / đọc nhiều
  const trendingArticles = await prisma.article.findMany({
    take: 4,
    orderBy: { viewCount: "desc" },
    include: { category: true },
  });

  // 5. Lấy các bài viết nhóm theo chuyên mục để hiển thị bên dưới
  const categoriesWithArticles = await prisma.category.findMany({
    include: {
      articles: {
        take: 4,
        orderBy: { publishedAt: "desc" },
      },
    },
    orderBy: { order: "asc" },
  });

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />

      <main className="flex-1 max-w-7xl mx-auto px-4 py-6 w-full">
        {/* ============================================================ */}
        {/* KHU VỰC TIÊU ĐIỂM 3 CỘT (CẢM HỨNG TUỔI TRẺ ONLINE - STYLE XANH DƯƠNG) */}
        {/* ============================================================ */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 pb-10 border-b border-slate-200">
          {/* CỘT TRÁI (Lg: col-span-3) - Tin vắn, Góc nhìn & Dòng sự kiện */}
          <div className="lg:col-span-3 space-y-6 border-r-0 lg:border-r lg:border-slate-200 lg:pr-6">
            {/* Box Thời sự / Ngày giờ */}
            <div className="bg-[#F8FAFC] p-3.5 border-l-4 border-[#0F4C81] text-xs">
              <span className="font-bold text-[#0A2540] uppercase tracking-wider block">
                Dòng Sự Kiện
              </span>
              <p className="text-slate-600 mt-1 font-sans">
                Mùa săn mây Tây Bắc 2026: Những cung đèo lý tưởng nhất cho phượt thủ.
              </p>
            </div>

            {/* Box Góc nhìn / Nhân vật */}
            <div className="border border-slate-200 p-4 bg-white shadow-xs">
              <span className="text-xs uppercase font-bold text-[#1A56DB] tracking-wider block mb-2">
                Góc Nhìn • Người Đi
              </span>
              <div className="flex items-start space-x-3">
                <div className="w-12 h-12 rounded-full bg-slate-200 overflow-hidden flex-shrink-0 border border-slate-300">
                  <img
                    src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop"
                    alt="Tác giả"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <h4 className="font-bold text-sm text-slate-900 leading-snug hover:text-[#1A56DB] transition cursor-pointer">
                    Ai ra đời để kết nối những dặm trường?
                  </h4>
                  <p className="text-xs text-slate-500 mt-1">Trần Anh Khoa — Biên tập</p>
                </div>
              </div>
              <p className="text-xs text-slate-600 mt-3 line-clamp-2 leading-relaxed">
                Đôi khi, hành trình đẹp nhất không nằm ở đích đến mà ở khoảnh khắc bạn quyết định gạt chiếc chân chống và tiến về phía trước...
              </p>
            </div>

            {/* Danh sách Tin Nhanh Có Thứ Tự Tối Giản 01, 02, 03 */}
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-slate-200 pb-1.5">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900">
                  Tin Mới Cập Nhật
                </h3>
                <span className="text-[10px] text-sky-600 font-mono">24/7</span>
              </div>

              <div className="space-y-3.5">
                {latestArticles.map((art, idx) => (
                  <article key={art.id} className="group flex items-start space-x-3 pb-3 border-b border-slate-100 last:border-0">
                    <span className="text-sm font-serif font-bold text-[#1A56DB] select-none pt-0.5">
                      0{idx + 1}
                    </span>
                    <div className="flex-1">
                      <Link
                        href={`/bai-viet/${art.slug}`}
                        className="text-xs font-bold text-slate-800 group-hover:text-[#1A56DB] transition leading-snug block"
                      >
                        {art.title}
                      </Link>
                      <div className="flex items-center space-x-2 mt-1 text-[11px] text-slate-400">
                        <span>{art.category.name}</span>
                        <span>•</span>
                        <span>{art.readingTime} phút đọc</span>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          </div>

          {/* CỘT GIỮA (Lg: col-span-6) - HERO BÀI TIÊU ĐIỂM CHÍNH & 3 BÀI PHỤ */}
          <div className="lg:col-span-6 space-y-6">
            {heroArticle && (
              <article className="group">
                {/* Ảnh Tiêu Điểm To, Rõ Nét */}
                <div className="relative aspect-[16/10] w-full overflow-hidden bg-slate-100 border border-slate-200">
                  {heroArticle.thumbnail && (
                    <img
                      src={heroArticle.thumbnail}
                      alt={heroArticle.title}
                      className="w-full h-full object-cover group-hover:scale-[1.02] transition duration-500"
                    />
                  )}
                  <span className="absolute bottom-3 left-3 bg-[#0A2540]/90 text-white text-[11px] font-bold uppercase tracking-wider px-2.5 py-1 backdrop-blur-xs">
                    {heroArticle.category.name}
                  </span>
                </div>

                {/* Tiêu đề in đậm báo chí & Sapo */}
                <div className="mt-4">
                  <Link href={`/bai-viet/${heroArticle.slug}`}>
                    <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-[#0A2540] group-hover:text-[#1A56DB] transition leading-tight font-sans">
                      {heroArticle.title}
                    </h1>
                  </Link>
                  <p className="text-slate-700 text-base md:text-lg leading-relaxed mt-3 text-justify font-sans">
                    {heroArticle.sapo}
                  </p>
                  <div className="flex items-center space-x-3 text-sm text-slate-500 mt-4 pt-3 border-t border-slate-200">
                    <span className="font-bold text-slate-800">{heroArticle.author}</span>
                    <span>—</span>
                    <span>{heroArticle.readingTime} phút đọc</span>
                  </div>
                </div>
              </article>
            )}

            {/* Lưới 3 bài tiêu điểm phụ bên dưới Hero */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-slate-200">
              {subHeroArticles.map((art) => (
                <article key={art.id} className="group space-y-2">
                  <div className="aspect-[16/10] w-full overflow-hidden bg-slate-100 border border-slate-200">
                    {art.thumbnail && (
                      <img
                        src={art.thumbnail}
                        alt={art.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                      />
                    )}
                  </div>
                  <span className="text-[11px] font-bold text-[#1A56DB] uppercase tracking-wider block">
                    {art.category.name}
                  </span>
                  <Link
                    href={`/bai-viet/${art.slug}`}
                    className="text-xs font-bold text-slate-900 group-hover:text-[#1A56DB] transition leading-snug line-clamp-2 block"
                  >
                    {art.title}
                  </Link>
                </article>
              ))}
            </div>
          </div>

          {/* CỘT PHẢI (Lg: col-span-3) - Multimedia & Chuyên đề nổi bật */}
          <div className="lg:col-span-3 space-y-6 border-l-0 lg:border-l lg:border-slate-200 lg:pl-6">
            <div className="border-b-2 border-[#1A56DB] pb-1 flex items-center justify-between">
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#0A2540]">
                Ấn Tượng Multimedia
              </h3>
              <Link href="/chuyen-muc/multimedia" className="text-[11px] text-[#1A56DB] hover:underline">
                Xem tất cả »
              </Link>
            </div>

            {/* Card Multimedia Ảnh To */}
            <div className="space-y-4">
              {trendingArticles.map((art) => (
                <article key={art.id} className="group space-y-2 pb-4 border-b border-slate-100 last:border-0">
                  <div className="relative aspect-[16/9] w-full overflow-hidden bg-slate-900">
                    {art.thumbnail && (
                      <img
                        src={art.thumbnail}
                        alt={art.title}
                        className="w-full h-full object-cover opacity-90 group-hover:opacity-100 group-hover:scale-105 transition duration-300"
                      />
                    )}
                    <span className="absolute bottom-2 right-2 bg-black/70 text-white text-[10px] px-2 py-0.5 rounded font-mono">
                      PHOTO STORY
                    </span>
                  </div>
                  <Link
                    href={`/bai-viet/${art.slug}`}
                    className="text-xs font-bold text-slate-900 group-hover:text-[#1A56DB] transition leading-snug block line-clamp-2"
                  >
                    {art.title}
                  </Link>
                  <p className="text-[11px] text-slate-500 line-clamp-1">{art.sapo}</p>
                </article>
              ))}
            </div>

            {/* Widget Vé Máy Bay & Chặng Bay Hot */}
            <HotFlightRoutes />

            {/* Box Kêu gọi hành động Import Word */}
            <div className="bg-[#EFF6FF] border border-[#BFDBFE] p-4 rounded-sm text-center">
              <span className="text-xs font-bold uppercase text-[#1A56DB] block tracking-wider">
                Hệ Thống Tòa Soạn
              </span>
              <p className="text-xs text-slate-700 mt-2 leading-relaxed">
                Khách hàng hoặc biên tập viên có thể tự động tải bài viết định dạng <strong>.docx</strong> lên hệ thống chỉ với một cú click.
              </p>
              <Link
                href="/admin/import"
                className="mt-3 inline-block w-full bg-[#0A2540] hover:bg-[#1A56DB] text-white text-xs font-bold uppercase tracking-wider py-2.5 transition"
              >
                Nhập bài từ file Word
              </Link>
            </div>
          </div>
        </section>

        {/* ============================================================ */}
        {/* CÁC SECTION CHUYÊN MỤC THEO KHUÔN BÁO CHÍ (7 CHUYÊN MỤC) */}
        {/* ============================================================ */}
        <section className="py-12 space-y-14">
          {categoriesWithArticles.map((cat) => {
            const articles = cat.articles;
            if (articles.length === 0) return null;
            const mainArticle = articles[0];
            const otherArticles = articles.slice(1);

            return (
              <div key={cat.id} className="space-y-5">
                {/* Header Tiêu đề Chuyên mục (Dải xanh dương sang trọng) */}
                <div className="flex items-center justify-between border-b-2 border-[#0A2540] pb-2">
                  <div className="flex items-baseline space-x-3">
                    <Link
                      href={`/chuyen-muc/${cat.slug}`}
                      className="text-lg md:text-xl font-extrabold uppercase tracking-wide text-[#0A2540] hover:text-[#1A56DB] transition font-serif"
                    >
                      {cat.name}
                    </Link>
                    <span className="text-xs text-slate-400 hidden sm:inline">
                      {cat.description}
                    </span>
                  </div>
                  <Link
                    href={`/chuyen-muc/${cat.slug}`}
                    className="text-xs font-bold text-[#1A56DB] hover:text-[#0A2540] transition tracking-wider uppercase"
                  >
                    Xem thêm »
                  </Link>
                </div>

                {/* Grid Bài Viết của Chuyên Mục: 1 Bài Lớn + 3 Bài Vệ Tinh */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                  {/* Bài đinh của chuyên mục */}
                  <article className="md:col-span-6 group space-y-3">
                    <div className="aspect-[16/10] w-full overflow-hidden bg-slate-100 border border-slate-200">
                      {mainArticle.thumbnail && (
                        <img
                          src={mainArticle.thumbnail}
                          alt={mainArticle.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                        />
                      )}
                    </div>
                    <Link href={`/bai-viet/${mainArticle.slug}`}>
                      <h3 className="text-xl md:text-2xl font-bold text-slate-900 group-hover:text-[#1A56DB] transition leading-snug font-sans">
                        {mainArticle.title}
                      </h3>
                    </Link>
                    <p className="text-sm md:text-base text-slate-600 line-clamp-3 leading-relaxed">
                      {mainArticle.sapo}
                    </p>
                    <div className="text-xs text-slate-500 flex items-center space-x-2 pt-1">
                      <span className="font-bold text-slate-700">{mainArticle.author}</span>
                      <span>•</span>
                      <span>{mainArticle.readingTime} phút đọc</span>
                    </div>
                  </article>

                  {/* 3 Bài nhỏ vệ tinh */}
                  <div className="md:col-span-6 space-y-4">
                    {otherArticles.map((subArt) => (
                      <article
                        key={subArt.id}
                        className="group flex space-x-4 pb-4 border-b border-slate-100 last:border-0"
                      >
                        <div className="w-32 h-20 sm:w-44 sm:h-28 flex-shrink-0 overflow-hidden bg-slate-100 border border-slate-200">
                          {subArt.thumbnail && (
                            <img
                              src={subArt.thumbnail}
                              alt={subArt.title}
                              className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                            />
                          )}
                        </div>
                        <div className="flex-1 flex flex-col justify-between">
                          <Link
                            href={`/bai-viet/${subArt.slug}`}
                            className="text-sm sm:text-base font-bold text-slate-900 group-hover:text-[#1A56DB] transition leading-snug line-clamp-2 font-sans"
                          >
                            {subArt.title}
                          </Link>
                          <p className="text-xs sm:text-sm text-slate-500 line-clamp-2 mt-1 hidden sm:block">
                            {subArt.sapo}
                          </p>
                          <div className="text-xs text-slate-400 mt-2">
                            <span>{subArt.readingTime} phút đọc</span>
                          </div>
                        </div>
                      </article>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </section>
      </main>

      <Footer />
    </div>
  );
}
