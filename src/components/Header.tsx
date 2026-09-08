"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { CATEGORIES } from "@/lib/constants";
import WorldClockWeather from "@/components/WorldClockWeather";

export default function Header({ currentCategory = "" }: { currentCategory?: string }) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const router = useRouter();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/tim-kiem?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  useEffect(() => {
    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const currentY = window.scrollY;

          // Sử dụng ngưỡng Hysteresis chống chớp giật (Flicker / Layout Thrashing):
          // Phải cuộn qua 150px mới co lại, và chỉ bung ra khi đã cuộn về sát đỉnh (< 60px)
          setIsScrolled((prev) => {
            if (!prev && currentY > 150) {
              return true;
            } else if (prev && currentY < 60) {
              return false;
            }
            return prev;
          });

          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      {/* ========================================================================= */}
      {/* 1. KHỐI HEADER TRÊN ĐẦU (TỰ NHIÊN CUỘN THEO TRANG, KHÔNG GÂY GIẬT NỀN) */}
      {/* ========================================================================= */}
      <div className="w-full bg-white border-b border-slate-200">
        {/* Top Utility Bar: Giờ quốc tế & Thời tiết */}
        <div className="bg-[#F8FAFC] border-b border-slate-200 text-xs text-slate-600 py-2">
          <div className="max-w-7xl mx-auto px-4 flex items-center justify-between">
            <WorldClockWeather />

            <div className="flex items-center space-x-4">
              <Link
                href="/admin/import"
                className="text-[#1A56DB] hover:text-[#0F4C81] font-bold transition"
              >
                [ + Nhập bài viết mới ]
              </Link>
              <span className="text-slate-300">|</span>
              <Link href="/admin" className="hover:text-slate-900 transition font-medium">
                Quản trị Tòa soạn
              </Link>
            </div>
          </div>
        </div>

        {/* Masthead Logo & Hotline */}
        <div className="max-w-7xl mx-auto px-4 py-5 flex flex-col md:flex-row items-center justify-between">
          <div className="flex items-baseline space-x-4">
            <Link href="/" className="group flex flex-col">
              <span className="text-3xl md:text-4xl lg:text-5xl font-black tracking-tight text-[#0A2540] group-hover:text-[#1A56DB] transition font-sans uppercase">
                GẠT CHÂN CHỐNG
              </span>
              <span className="text-xs uppercase tracking-[0.25em] text-[#0F4C81] font-bold mt-1.5">
                Tạp chí Du lịch • Khám phá • Trải nghiệm sống
              </span>
            </Link>
          </div>

          <div className="mt-4 md:mt-0 flex items-center space-x-5 text-sm">
            <form
              onSubmit={handleSearch}
              className="hidden lg:flex items-center border border-slate-300 rounded px-3 py-2 bg-slate-50 focus-within:border-[#1A56DB] transition"
            >
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Tìm kiếm điểm đến, bài viết..."
                className="bg-transparent text-sm text-slate-800 focus:outline-none w-64"
              />
              <button
                type="submit"
                className="text-xs font-bold text-[#1A56DB] hover:text-[#0A2540] uppercase tracking-wider ml-2 cursor-pointer"
              >
                Tìm
              </button>
            </form>

            <div className="text-xs text-slate-600 border-l border-slate-300 pl-4 hidden sm:block">
              <p className="font-bold text-slate-700">Đường dây nóng</p>
              <p className="text-[#1A56DB] font-mono font-bold text-base">0988.123.456</p>
            </div>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 2. THANH NAVIGATION DÍNH CỐ ĐỊNH (STICKY) - CO GỌN ÊM ÁI HOÀN TOÀN KHÔNG GIẬT */}
      {/* ========================================================================= */}
      <nav
        className={`w-full sticky top-0 z-50 bg-[#0A2540] text-white transition-all duration-200 ${
          isScrolled ? "shadow-lg py-1 border-b border-slate-700/50 backdrop-blur-md bg-[#0A2540]/95" : "py-0"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 flex items-center justify-between overflow-x-auto scrollbar-none">
          <div className="flex items-center space-x-4">
            {/* Logo thu nhỏ mượt mà khi cuộn xuống */}
            <div
              className={`overflow-hidden transition-all duration-200 flex items-center ${
                isScrolled ? "max-w-[200px] opacity-100 pr-3 mr-2 border-r border-slate-700" : "max-w-0 opacity-0"
              }`}
            >
              <Link href="/" className="whitespace-nowrap">
                <span className="text-base font-black tracking-tight text-white uppercase font-sans hover:text-sky-300 transition">
                  GẠT CHÂN CHỐNG
                </span>
              </Link>
            </div>

            <ul className="flex items-center space-x-1 py-0 text-sm tracking-wide font-semibold whitespace-nowrap">
              <li>
                <Link
                  href="/"
                  className={`inline-block py-2.5 px-3 uppercase text-xs tracking-wider transition rounded-xs ${
                    !currentCategory
                      ? "bg-[#1A56DB] text-white font-bold"
                      : "text-slate-200 hover:text-white hover:bg-white/10"
                  }`}
                >
                  Trang Chủ
                </Link>
              </li>

              {CATEGORIES.map((cat) => {
                const isActive = currentCategory === cat.slug;
                return (
                  <li key={cat.slug}>
                    <Link
                      href={`/chuyen-muc/${cat.slug}`}
                      className={`inline-block py-2.5 px-3 uppercase text-xs tracking-wider transition rounded-xs ${
                        isActive
                          ? "bg-[#1A56DB] text-white font-bold"
                          : "text-slate-200 hover:text-white hover:bg-white/10"
                      }`}
                    >
                      {cat.name}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>

          {/* Tiện ích bên phải khi cuộn */}
          <div className="flex items-center space-x-3 text-xs pl-3">
            {isScrolled && (
              <Link
                href="/admin/import"
                className="hidden md:inline-block bg-[#1A56DB] hover:bg-blue-600 text-white font-bold uppercase tracking-wider text-[11px] px-2.5 py-1 rounded-xs transition"
              >
                + Đăng bài
              </Link>
            )}
            <div className="hidden xl:flex items-center space-x-2 text-sky-200 font-mono text-xs">
              <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <span>TIN MỚI 24/7</span>
            </div>
          </div>
        </div>
      </nav>
    </>
  );
}
