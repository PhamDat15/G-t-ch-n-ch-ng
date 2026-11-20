"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";

export interface HeroArticle {
  id: string;
  title: string;
  slug: string;
  sapo: string;
  thumbnail: string | null;
  readingTime: number;
  category: {
    name: string;
    slug: string;
  };
}

export default function HeroCarousel({ articles }: { articles: HeroArticle[] }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const touchStartX = useRef<number | null>(null);

  // Auto chuyển slide sau 5 giây nếu không hover
  useEffect(() => {
    if (articles.length <= 1 || isPaused) return;

    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % articles.length);
    }, 5500);

    return () => clearInterval(timer);
  }, [articles.length, isPaused]);

  if (!articles || articles.length === 0) return null;

  const current = articles[currentIndex];

  const handlePrev = (e: React.MouseEvent) => {
    e.preventDefault();
    setCurrentIndex((prev) => (prev - 1 + articles.length) % articles.length);
  };

  const handleNext = (e: React.MouseEvent) => {
    e.preventDefault();
    setCurrentIndex((prev) => (prev + 1) % articles.length);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const touchEndX = e.changedTouches[0].clientX;
    const diff = touchStartX.current - touchEndX;

    if (diff > 45) {
      // Vuốt sang trái -> xem bài tiếp theo
      setCurrentIndex((prev) => (prev + 1) % articles.length);
    } else if (diff < -45) {
      // Vuốt sang phải -> xem bài trước đó
      setCurrentIndex((prev) => (prev - 1 + articles.length) % articles.length);
    }
    touchStartX.current = null;
  };

  return (
    <article
      className="group relative overflow-hidden rounded-2xl shadow-xl shadow-slate-900/15 bg-slate-950 select-none"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      <Link
        href={`/bai-viet/${current.slug}`}
        className="block relative aspect-[16/10] sm:aspect-[16/9] w-full overflow-hidden"
      >
        {/* Hình ảnh bài viết với hiệu ứng fade mượt mà */}
        {current.thumbnail ? (
          <Image
            key={current.id}
            src={current.thumbnail}
            alt={current.title}
            fill
            priority
            sizes="(max-width: 1024px) 100vw, 66vw"
            className="object-cover brightness-[0.88] transition-all duration-700 group-hover:scale-105 group-hover:brightness-95 animate-fade-in"
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-[#0c1f33] to-[#123b5d]" />
        )}

        {/* Lớp phủ Gradient điện ảnh sắc nét */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/50 to-black/10" />

        {/* Nội dung thông tin bài viết */}
        <div className="absolute inset-0 flex flex-col justify-end p-5 sm:p-8 md:p-10 text-white">
          {/* Tag chuyên mục & Chỉ số slide */}
          <div className="mb-2.5 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-[#d49a37] font-black text-xs">|</span>
              <span className="text-[11px] sm:text-xs font-bold uppercase tracking-[0.2em] text-[#d49a37] drop-shadow">
                {current.category.name}
              </span>
              {current.category.slug === "multimedia" && (
                <span className="rounded bg-amber-500/90 px-1.5 py-0.5 text-[10px] font-bold text-slate-950 uppercase">
                  ▶ Video
                </span>
              )}
            </div>

            {/* Chỉ số slide 01 / 04 */}
            {articles.length > 1 && (
              <span className="text-xs font-mono font-bold tracking-widest text-slate-300/80 bg-black/40 px-2.5 py-1 rounded-full border border-white/10 backdrop-blur-sm">
                {String(currentIndex + 1).padStart(2, "0")} / {String(articles.length).padStart(2, "0")}
              </span>
            )}
          </div>

          {/* Tiêu đề bài viết */}
          <h1 className="font-serif text-2xl sm:text-3xl md:text-4xl lg:text-[38px] font-bold leading-tight sm:leading-tight text-white transition-colors duration-300 group-hover:text-amber-200 line-clamp-2">
            {current.title}
          </h1>

          {/* Sapo tóm tắt */}
          <p className="mt-2.5 line-clamp-2 sm:line-clamp-3 text-xs sm:text-sm md:text-base leading-relaxed text-slate-200/90 font-light max-w-3xl">
            {current.sapo}
          </p>

          {/* Nút Đọc bài viết & Pagination dots */}
          <div className="mt-5 flex items-center justify-between">
            <span className="inline-flex items-center gap-2 rounded-lg bg-[#d49a37] px-4 py-2 text-xs sm:text-sm font-bold text-slate-950 shadow-md transition group-hover:bg-[#b88226]">
              Đọc bài viết
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </span>

            {/* Dots chuyển đổi trực tiếp */}
            {articles.length > 1 && (
              <div
                className="flex items-center gap-2 py-1 px-2 rounded-full bg-black/30 backdrop-blur-sm border border-white/10"
                onClick={(e) => e.stopPropagation()}
              >
                {articles.map((art, idx) => (
                  <button
                    key={art.id}
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      setCurrentIndex(idx);
                    }}
                    aria-label={`Chuyển đến bài ${idx + 1}`}
                    className={`h-2 transition-all rounded-full ${
                      idx === currentIndex ? "w-6 bg-[#d49a37]" : "w-2 bg-white/40 hover:bg-white/70"
                    }`}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </Link>

      {/* Nút mũi tên lướt qua trái / phải (Hiện khi hover hoặc trên màn hình cảm ứng) */}
      {articles.length > 1 && (
        <>
          <button
            type="button"
            onClick={handlePrev}
            aria-label="Bài trước"
            className="absolute left-3 top-1/2 -translate-y-1/2 z-20 flex h-10 w-10 items-center justify-center rounded-full bg-black/50 text-white backdrop-blur-sm border border-white/20 opacity-0 transition-all duration-300 hover:bg-[#d49a37] hover:text-slate-950 hover:scale-110 group-hover:opacity-100"
          >
            <svg className="w-5 h-5 -ml-0.5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          <button
            type="button"
            onClick={handleNext}
            aria-label="Bài kế tiếp"
            className="absolute right-3 top-1/2 -translate-y-1/2 z-20 flex h-10 w-10 items-center justify-center rounded-full bg-black/50 text-white backdrop-blur-sm border border-white/20 opacity-0 transition-all duration-300 hover:bg-[#d49a37] hover:text-slate-950 hover:scale-110 group-hover:opacity-100"
          >
            <svg className="w-5 h-5 -mr-0.5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </>
      )}
    </article>
  );
}
