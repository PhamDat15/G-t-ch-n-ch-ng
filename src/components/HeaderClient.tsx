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
    const onScroll = () => setCompact(window.scrollY > 120);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className="bg-white">
      <div className="border-b border-slate-200 bg-[#f8fbff]">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-2 text-[13px] text-slate-600">
          <WorldClockWeather />
          <span className="hidden font-medium text-[#175b8f] md:block">Thông tin chọn lọc về du lịch, văn hóa và di sản Việt Nam</span>
        </div>
      </div>
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-5 px-4 py-7 md:flex-row">
        <Link href="/" className="group text-center md:text-left">
          <span className="block font-serif text-3xl font-black tracking-tight text-[#123b5d] transition group-hover:text-[#2576ae] md:text-5xl">{siteName}</span>
          <span className="mt-1.5 block text-sm font-semibold tracking-[0.16em] text-[#b46b2a]">{slogan}</span>
        </Link>
        <form
          onSubmit={(event) => { event.preventDefault(); if (query.trim()) router.push(`/tim-kiem?q=${encodeURIComponent(query.trim())}`); }}
          className="flex w-full max-w-md items-center rounded-full border border-slate-300 bg-white px-4 py-2.5 shadow-sm focus-within:border-[#2576ae] md:w-auto"
        >
          <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Tìm kiếm điểm đến, di sản..." aria-label="Tìm kiếm bài viết" className="min-w-0 flex-1 bg-transparent text-sm text-slate-800 outline-none md:w-64" />
          <button className="ml-3 text-sm font-bold text-[#2576ae]" type="submit">Tìm kiếm</button>
        </form>
      </div>
      <nav className={`sticky top-0 z-50 border-y border-slate-200 bg-white/95 backdrop-blur transition-shadow ${compact ? "shadow-md" : ""}`}>
        <div className="mx-auto flex max-w-7xl items-center overflow-x-auto px-4">
          <Link href="/" className={`whitespace-nowrap border-b-2 px-3 py-3 text-sm font-bold ${!currentCategory ? "border-[#d3843b] text-[#175b8f]" : "border-transparent text-slate-600 hover:text-[#175b8f]"}`}>Trang chủ</Link>
          {CATEGORIES.map((category) => (
            <Link key={category.slug} href={`/chuyen-muc/${category.slug}`} className={`whitespace-nowrap border-b-2 px-3 py-3 text-sm font-semibold ${currentCategory === category.slug ? "border-[#d3843b] text-[#175b8f]" : "border-transparent text-slate-600 hover:text-[#175b8f]"}`}>{category.name}</Link>
          ))}
        </div>
      </nav>
    </header>
  );
}
