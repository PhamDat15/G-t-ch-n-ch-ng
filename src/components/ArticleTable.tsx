"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export interface ArticleItem {
  id: string;
  title: string;
  slug: string;
  author: string;
  status: "DRAFT" | "PENDING" | "PUBLISHED" | "REJECTED";
  isHero: boolean;
  isFeatured: boolean;
  publishedAt: string | Date;
  category: {
    name: string;
  };
}

export default function ArticleTable({
  initialArticles,
  isLeader = false,
}: {
  initialArticles: ArticleItem[];
  isLeader?: boolean;
}) {
  const [articles, setArticles] = useState<ArticleItem[]>(initialArticles);
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const router = useRouter();

  // 1. Duyệt bài / Gỡ duyệt (On-air / Pending)
  const handleToggleStatus = async (id: string, currentStatus: string) => {
    const newStatus = currentStatus === "PUBLISHED" ? "PENDING" : "PUBLISHED";
    setLoadingId(id);
    try {
      const res = await fetch("/api/cms/moderate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          articleId: id,
          action: "SET_STATUS",
          status: newStatus,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setArticles((prev) =>
          prev.map((art) => (art.id === id ? { ...art, status: newStatus as any } : art))
        );
        router.refresh();
      } else {
        alert(data.error || "Thao tác thất bại.");
      }
    } catch {
      alert("Lỗi kết nối mạng.");
    } finally {
      setLoadingId(null);
    }
  };

  // 2. Đảo Headline (Hero)
  const handleToggleHero = async (id: string, currentIsHero: boolean) => {
    setLoadingId(id);
    try {
      const res = await fetch("/api/cms/moderate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          articleId: id,
          action: "TOGGLE_HERO",
          isHero: !currentIsHero,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setArticles((prev) =>
          prev.map((art) => {
            if (art.id === id) return { ...art, isHero: !currentIsHero };
            if (!currentIsHero) return { ...art, isHero: false }; // gỡ Hero bài khác
            return art;
          })
        );
        router.refresh();
      } else {
        alert(data.error || "Thao tác thất bại.");
      }
    } catch {
      alert("Lỗi kết nối mạng.");
    } finally {
      setLoadingId(null);
    }
  };

  // 3. Xóa bài
  const handleDelete = async (id: string, title: string) => {
    const confirmed = window.confirm(`Bạn có chắc chắn muốn gỡ/xóa bài báo: "${title}" không?`);
    if (!confirmed) return;

    setLoadingId(id);
    try {
      const res = await fetch(`/api/articles/${id}`, {
        method: "DELETE",
      });
      const data = await res.json();

      if (data.success) {
        setArticles((prev) => prev.filter((art) => art.id !== id));
        router.refresh();
      } else {
        alert(data.error || "Không thể gỡ bài viết. Vui lòng thử lại.");
      }
    } catch {
      alert("Lỗi kết nối mạng.");
    } finally {
      setLoadingId(null);
    }
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left text-xs text-slate-700">
        <thead className="bg-slate-50 text-slate-600 uppercase font-semibold border-b border-slate-200">
          <tr>
            <th className="p-3.5">Tiêu đề bài viết</th>
            <th className="p-3.5">Chuyên mục</th>
            <th className="p-3.5">Tác giả</th>
            <th className="p-3.5">Trạng thái duyệt</th>
            <th className="p-3.5">Vị trí</th>
            <th className="p-3.5 text-right">Thao tác</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {articles.length === 0 ? (
            <tr>
              <td colSpan={6} className="p-8 text-center text-slate-500">
                Chưa có bài viết nào trong danh sách.
              </td>
            </tr>
          ) : (
            articles.map((art) => (
              <tr key={art.id} className="hover:bg-slate-50 transition">
                <td className="p-3.5 font-bold text-slate-900 max-w-xs md:max-w-md truncate">
                  <Link href={`/bai-viet/${art.slug}`} className="hover:text-[#1A56DB] transition">
                    {art.title}
                  </Link>
                </td>
                <td className="p-3.5">
                  <span className="bg-sky-50 text-[#1A56DB] font-semibold px-2 py-0.5 rounded border border-sky-200">
                    {art.category.name}
                  </span>
                </td>
                <td className="p-3.5 text-slate-600">{art.author}</td>

                {/* Cột Trạng thái duyệt */}
                <td className="p-3.5">
                  {art.status === "PENDING" ? (
                    <span className="inline-flex items-center gap-1 rounded bg-amber-50 px-2.5 py-1 font-bold text-amber-800 border border-amber-300">
                      <span className="h-2 w-2 rounded-full bg-amber-500 animate-ping" />
                      Chờ duyệt
                    </span>
                  ) : art.status === "DRAFT" ? (
                    <span className="rounded bg-slate-100 px-2 py-0.5 text-slate-600 font-medium">
                      Bản nháp
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 rounded bg-emerald-50 px-2.5 py-1 font-bold text-emerald-700 border border-emerald-200">
                      <span className="h-2 w-2 rounded-full bg-emerald-500" />
                      Đã lên trang
                    </span>
                  )}
                </td>

                {/* Cột Vị trí / Headline */}
                <td className="p-3.5">
                  {art.isHero ? (
                    <span className="rounded bg-amber-400 px-2 py-0.5 text-[10px] font-black uppercase text-slate-950 shadow-sm">
                      ★ HERO TIÊU ĐIỂM
                    </span>
                  ) : art.isFeatured ? (
                    <span className="rounded bg-slate-200 px-1.5 py-0.5 text-[10px] font-bold text-slate-700">
                      ĐỌC NHIỀU
                    </span>
                  ) : (
                    <span className="text-slate-400">—</span>
                  )}
                </td>

                {/* Cột Thao tác */}
                <td className="p-3.5 text-right space-x-2 whitespace-nowrap">
                  {/* Nút Duyệt / Gỡ duyệt (Dành cho Ban Biên Tập / Trưởng mục) */}
                  {isLeader && (
                    <>
                      {art.status !== "PUBLISHED" ? (
                        <button
                          onClick={() => handleToggleStatus(art.id, art.status)}
                          disabled={loadingId === art.id}
                          className="rounded bg-emerald-600 px-2.5 py-1 text-xs font-bold text-white hover:bg-emerald-700 transition cursor-pointer shadow-sm"
                        >
                          Duyệt lên trang ✓
                        </button>
                      ) : (
                        <button
                          onClick={() => handleToggleStatus(art.id, art.status)}
                          disabled={loadingId === art.id}
                          title="Hạ bài về trạng thái chờ duyệt"
                          className="rounded border border-amber-300 bg-amber-50 px-2 py-1 text-[11px] font-bold text-amber-800 hover:bg-amber-100 transition cursor-pointer"
                        >
                          Hạ bài
                        </button>
                      )}

                      {/* Nút Đảo Headline */}
                      <button
                        onClick={() => handleToggleHero(art.id, art.isHero)}
                        disabled={loadingId === art.id}
                        className={`rounded px-2 py-1 text-[11px] font-bold transition cursor-pointer ${
                          art.isHero
                            ? "bg-slate-200 text-slate-700 hover:bg-slate-300"
                            : "border border-[#d49a37] text-[#b88226] hover:bg-[#d49a37] hover:text-white"
                        }`}
                      >
                        {art.isHero ? "Bỏ Hero" : "Đặt Headline"}
                      </button>
                    </>
                  )}

                  <Link
                    href={`/cms/bai-viet/${art.id}`}
                    className="font-semibold text-sky-700 hover:underline px-1"
                  >
                    Sửa
                  </Link>

                  <Link
                    href={`/bai-viet/${art.slug}`}
                    target="_blank"
                    className="text-slate-600 hover:underline px-1"
                  >
                    Xem ↗
                  </Link>

                  {/* Nút Xóa bài (Chỉ Trưởng mục / Admin có quyền xóa) */}
                  {isLeader && (
                    <button
                      onClick={() => handleDelete(art.id, art.title)}
                      disabled={loadingId === art.id}
                      className="text-rose-600 hover:text-rose-800 font-bold cursor-pointer disabled:opacity-50 transition px-1"
                    >
                      Gỡ bài
                    </button>
                  )}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
