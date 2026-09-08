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
    const handleScroll = () => {
      // Khi cuộn quá 70px thì kích hoạt trạng thái co gọn
      if (window.scrollY > 70) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Lấy ngày tháng tiếng Việt chuẩn
  const today = new Date();
  const daysOfWeek = ["Chủ nhật", "Thứ hai", "Thứ ba", "Thứ tư", "Thứ năm", "Thứ sáu", "Thứ bảy"];
  const dayName = daysOfWeek[today.getDay()];
  const formattedDate = `${dayName}, ngày ${String(today.getDate()).padStart(2, "0")}-${String(
    today.getMonth() + 1
  ).padStart(2, "0")}-${today.getFullYear()}`;

  return (
    <header className="w-full sticky top-0 z-50 bg-white transition-all duration-300 shadow-xs">
      {/* 1. Top Utility Bar: Giờ quốc tế & Thời tiết thực tế */}
      <div
        className={`bg-[#F8FAFC] border-b border-slate-200 text-xs text-slate-600 overflow-hidden transition-all duration-300 ${
          isScrolled ? "max-h-0 opacity-0 border-none py-0" : "max-h-12 opacity-100 py-2"
        }`}
      >
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

      {/* 2. Main Masthead: Khi cuộn xuống thì ẩn phần slogan và ô tìm kiếm lớn, chỉ giữ logo thu nhỏ trong thanh bar */}
      <div
        className={`max-w-7xl mx-auto px-4 overflow-hidden transition-all duration-300 ${
          isScrolled ? "max-h-0 opacity-0 py-0" : "max-h-32 opacity-100 py-5 border-b border-slate-100"
        }`}
      >
        <div className="flex flex-col md:flex-row items-center justify-between">
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

      {/* 3. Sticky Navigation Bar: Tự động co gọn thành thanh điều hướng thanh mảnh khi cuộn */}
      <nav className={`bg-[#0A2540] text-white transition-all duration-300 ${isScrolled ? "shadow-md py-0.5" : ""}`}>
        <div className="max-w-7xl mx-auto px-4 flex items-center justify-between overflow-x-auto scrollbar-none">
          <div className="flex items-center space-x-4">
            {/* Logo thu nhỏ xuất hiện tức thì khi cuộn trang */}
            {isScrolled && (
              <Link
                href="/"
                className="flex items-center space-x-2 py-2 pr-3 border-r border-slate-700 transition animate-fade-in"
              >
                <span className="text-base font-black tracking-tight text-white uppercase font-sans hover:text-sky-300 transition">
                  GẠT CHÂN CHỐNG
                </span>
              </Link>
            )}

            <ul className="flex items-center space-x-1 py-0 text-sm tracking-wide font-semibold whitespace-nowrap">
              <li>
                <Link
                  href="/"
                  className={`inline-block py-2.5 px-3 uppercase text-xs tracking-wider transition ${
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
                      className={`inline-block py-2.5 px-3 uppercase text-xs tracking-wider transition relative ${
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
              <span>TIN MỚI</span>
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
}
