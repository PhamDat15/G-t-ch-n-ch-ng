"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { CATEGORIES } from "@/lib/constants";
import WorldClockWeather from "@/components/WorldClockWeather";

export default function HeaderClient({ currentCategory, siteName, slogan }: { currentCategory: string; siteName: string; slogan: string }) {
  const [compact, setCompact] = useState(false);
  const [query, setQuery] = useState("");
  const router = useRouter();

  useEffect(() => {
    const onScroll = () => setCompact(window.scrollY > 140);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className="relative w-full text-slate-100">
      {/* 1. TOP BAR ĐEN NHÁM (DARK SLATE) */}
      <div className="border-b border-white/10 bg-[#08131e] text-[12px] text-slate-300">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-1.5">
          <WorldClockWeather />
          <div className="flex items-center gap-4 text-xs">
            <div className="hidden sm:flex items-center gap-3 text-slate-300">
              <Link href="/thong-tin" className="hover:text-amber-300 transition">Thông tin du lịch</Link>
              <span className="text-white/20">|</span>
              <Link href="/su-kien" className="hover:text-amber-300 transition">Sự kiện</Link>
              <span className="text-white/20">|</span>
              <Link href="/lien-he" className="hover:text-amber-300 transition">Liên hệ</Link>
            </div>
            <div className="flex items-center gap-2.5 pl-2 border-l border-white/15">
              {/* Social icons */}
              <a href="https://facebook.com" target="_blank" rel="noreferrer" aria-label="Facebook" className="text-slate-300 hover:text-white transition">
                <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24"><path d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.84 3.44 8.87 8 9.8V15H8v-3h2V9.5C10 7.57 11.57 6 13.5 6H16v3h-2c-.55 0-1 .45-1 1v2h3v3h-3v6.95C18.05 21.45 22 17.19 22 12z"/></svg>
              </a>
              <a href="https://youtube.com" target="_blank" rel="noreferrer" aria-label="YouTube" className="text-slate-300 hover:text-white transition">
                <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
              </a>
              <a href="https://instagram.com" target="_blank" rel="noreferrer" aria-label="Instagram" className="text-slate-300 hover:text-white transition">
                <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* 2. MASTHEAD HERO NỀN SƯƠNG NÚI TỐI MÀU (DEEP NAVY / HERITAGE MOUNTAIN) */}
      <div 
        className="relative border-b border-white/10 overflow-hidden bg-[#0c1f33]"
        style={{
          backgroundImage: "radial-gradient(ellipse at 50% 20%, rgba(29, 78, 126, 0.45), transparent 70%), linear-gradient(180deg, #091724 0%, #0d2740 60%, #0a1b2d 100%)"
        }}
      >
        {/* Họa tiết núi non mờ phía sau */}
        <div 
          aria-hidden="true" 
          className="absolute inset-0 opacity-25 mix-blend-screen pointer-events-none bg-cover bg-center"
          style={{
            backgroundImage: "url('https://images.unsplash.com/photo-1528127269322-539801943592?auto=format&fit=crop&w=1920&q=80')"
          }}
        />

        <div className="relative mx-auto flex max-w-7xl flex-col items-center justify-between gap-6 px-4 pt-7 pb-6 md:flex-row">
          {/* Logo Báo & Slogan */}
          <Link href="/" className="group text-center md:text-left">
            <span className="block font-serif text-3xl font-black tracking-tight text-[#fbf7ee] transition duration-300 group-hover:text-amber-300 md:text-5xl drop-shadow-md">
              {siteName || "Việt Nam Travel"}
            </span>
            <span className="mt-1.5 block text-[11px] font-bold tracking-[0.24em] text-[#d49a37] uppercase drop-shadow">
              {slogan || "TẠP CHÍ DU LỊCH & DI SẢN VIỆT NAM"}
            </span>
          </Link>

          {/* Quick tools & Search */}
          <div className="flex w-full max-w-xl items-center gap-3 md:w-auto">
            {/* Thanh Tìm Kiếm Tròn Bo Góc với Nút Vàng Tròn */}
            <form
              onSubmit={(event) => { 
                event.preventDefault(); 
                if (query.trim()) router.push(`/tim-kiem?q=${encodeURIComponent(query.trim())}`); 
              }}
              className="relative flex min-w-0 flex-1 items-center rounded-full bg-white/95 backdrop-blur-md px-4 py-1.5 shadow-lg shadow-black/20 focus-within:ring-2 focus-within:ring-[#d49a37] md:w-80"
            >
              <svg className="w-4 h-4 text-slate-500 shrink-0 mr-2.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
              <input 
                value={query} 
                onChange={(event) => setQuery(event.target.value)} 
                placeholder="Tìm kiếm điểm đến, di sản, trải nghiệm..." 
                aria-label="Tìm kiếm bài viết" 
                className="min-w-0 flex-1 bg-transparent text-xs text-slate-800 placeholder:text-slate-400 outline-none" 
              />
              <button 
                type="submit" 
                aria-label="Tìm kiếm"
                className="ml-2 flex h-7 w-7 items-center justify-center rounded-full bg-[#d49a37] text-white shadow hover:bg-[#b88226] transition shrink-0"
              >
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3"/></svg>
              </button>
            </form>
          </div>
        </div>

        {/* 3. THANH MENU ĐIỀU HƯỚNG NẰM TRONG NỀN TỐI SANG TRỌNG */}
        <nav className={`border-t border-white/10 bg-[#091827]/90 backdrop-blur-md transition-all ${compact ? "fixed top-0 left-0 right-0 z-50 shadow-xl border-b border-white/15 bg-[#091827]/95" : ""}`}>
          <div className="mx-auto flex max-w-7xl items-center overflow-x-auto px-4 py-0 scrollbar-none">
            {/* Nút Trang chủ nền vàng hổ phách nổi bật */}
            <Link 
              href="/" 
              className={`inline-flex items-center justify-center px-6 py-3 text-sm font-bold transition whitespace-nowrap ${
                !currentCategory 
                  ? "bg-[#d49a37] text-slate-900 shadow-md hover:bg-[#b88226]" 
                  : "text-slate-200 hover:text-white hover:bg-white/10"
              }`}
            >
              Trang chủ
            </Link>

            {/* Các chuyên mục */}
            {CATEGORIES.map((category) => (
              <Link 
                key={category.slug} 
                href={`/chuyen-muc/${category.slug}`} 
                className={`whitespace-nowrap px-4 py-3 text-sm font-semibold transition hover:text-amber-300 ${
                  currentCategory === category.slug 
                    ? "text-amber-300 border-b-2 border-amber-400 bg-white/5" 
                    : "text-slate-200 hover:bg-white/5"
                }`}
              >
                {category.name}
              </Link>
            ))}
          </div>
        </nav>
      </div>
    </header>
  );
}
