"use client";

import { useState, useEffect } from "react";
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
  currentFilter,
}: {
  initialArticles: ArticleItem[];
  isLeader?: boolean;
  currentFilter?: string;
}) {
  const [articles, setArticles] = useState<ArticleItem[]>(initialArticles);
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    setArticles(initialArticles);
  }, [initialArticles]);

  // 1. Duyệt bài / Hạ bài (On-air / Pending)
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
        if (currentFilter === "PENDING" || currentFilter === "PUBLISHED") {
          setArticles((prev) => prev.filter((art) => art.id !== id));
        } else {
          setArticles((prev) =>
            prev.map((art) => (art.id === id ? { ...art, status: newStatus as any } : art))
          );
        }
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

  // 2. Đảo vị trí Headline (Hero)
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
            if (!currentIsHero) return { ...art, isHero: false };
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

  // 3. Xóa bài viết
  const handleDelete = async (id: string, title: string) => {
    const confirmed = window.confirm(`Bạn có chắc chắn muốn gỡ vĩnh viễn bài báo: "${title}" không?`);
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
    <div className="w-full">
      <table className="w-full table-fixed text-left text-xs text-slate-700">
        <thead className="bg-slate-50 text-slate-600 uppercase font-semibold border-b border-slate-200">
          <tr>
            <th className="py-3 px-4 w-[46%]">Bài viết & Tác giả</th>
            <th className="py-3 px-3 w-[16%]">Trạng thái</th>
            <th className="py-3 px-3 w-[16%]">Vị trí</th>
            <th className="py-3 px-4 w-[22%] text-right">Thao tác</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {articles.length === 0 ? (
            <tr>
              <td colSpan={4} className="p-8 text-center text-slate-500">
                Chưa có bài viết nào trong danh sách.
              </td>
            </tr>
          ) : (
            articles.map((art) => (
              <tr key={art.id} className="hover:bg-slate-50/80 transition">
                {/* CỘT 1: BÀI VIẾT & TÁC GIẢ (TÍCH HỢP ĐA TẦNG, CLICK TIÊU ĐỀ LÀ XEM BÀI) */}
                <td className="py-3.5 px-4">
                  <Link
                    href={`/bai-viet/${art.slug}`}
                    target="_blank"
                    title="Bấm để xem bài viết thực tế"
                    className="font-bold text-slate-900 hover:text-[#1A56DB] transition line-clamp-2 leading-snug"
                  >
                    {art.title}
                  </Link>
                  <div className="mt-1 flex flex-wrap items-center gap-2 text-[11px] text-slate-500">
                    <span className="inline-block rounded bg-sky-50 px-2 py-0.2 font-semibold text-[#1A56DB] border border-sky-200">
                      {art.category.name}
                    </span>
                    <span>·</span>
                    <span className="font-medium text-slate-600 truncate max-w-[140px]">
                      {art.author}
                    </span>
                    <span>·</span>
                    <span className="text-slate-400">
                      {new Date(art.publishedAt).toLocaleDateString("vi-VN", {
                        day: "2-digit",
                        month: "2-digit",
                      })}
                    </span>
                  </div>
                </td>

                {/* CỘT 2: TRẠNG THÁI KIỂM DUYỆT */}
                <td className="py-3.5 px-3">
                  {art.status === "PENDING" ? (
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 px-2.5 py-1 font-bold text-[11px] text-amber-800 border border-amber-300">
                      <span className="h-1.5 w-1.5 rounded-full bg-amber-500 animate-ping" />
                      Chờ duyệt
                    </span>
                  ) : art.status === "DRAFT" ? (
                    <span className="inline-block rounded-full bg-slate-100 px-2.5 py-0.5 text-slate-600 font-medium text-[11px]">
                      Bản nháp
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-1 font-bold text-[11px] text-emerald-700 border border-emerald-200">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                      Đã lên trang
                    </span>
                  )}
                </td>

                {/* CỘT 3: VỊ TRÍ & NÚT HEADLINE TRỰC TIẾP (GỘP THÀNH 1 CỘT GỌN GÀNG) */}
                <td className="py-3.5 px-3">
                  {art.isHero ? (
                    <div className="flex items-center gap-1.5">
                      <span className="rounded bg-amber-400 px-2 py-0.5 text-[10px] font-black uppercase text-slate-950 shadow-xs">
                        ★ HERO
                      </span>
                      {isLeader && (
                        <button
                          onClick={() => handleToggleHero(art.id, true)}
                          disabled={loadingId === art.id}
                          title="Hủy bài tiêu điểm Hero"
                          className="text-[10px] text-slate-400 hover:text-rose-600 underline cursor-pointer"
                        >
                          Bỏ
                        </button>
                      )}
                    </div>
                  ) : (
                    isLeader && (
                      <button
                        onClick={() => handleToggleHero(art.id, false)}
                        disabled={loadingId === art.id}
                        className="rounded border border-amber-300 bg-amber-50/60 px-2 py-0.5 text-[10px] font-bold text-amber-800 hover:bg-amber-100 transition cursor-pointer"
                      >
                        + Headline
                      </button>
                    )
                  )}
                </td>

                {/* CỘT 4: THAO TÁC THIẾT YẾU (KHÔNG DƯ THỪA) */}
                <td className="py-3.5 px-4 text-right space-x-1.5 whitespace-nowrap">
                  {isLeader && (
                    <>
                      {art.status !== "PUBLISHED" ? (
                        <button
                          onClick={() => handleToggleStatus(art.id, art.status)}
                          disabled={loadingId === art.id}
                          className="rounded-md bg-emerald-600 px-2.5 py-1 text-[11px] font-bold text-white hover:bg-emerald-700 transition cursor-pointer shadow-xs disabled:opacity-50"
                        >
                          Duyệt ✓
                        </button>
                      ) : (
                        <button
                          onClick={() => handleToggleStatus(art.id, art.status)}
                          disabled={loadingId === art.id}
                          title="Hạ bài về danh sách chờ duyệt"
                          className="rounded-md border border-slate-300 bg-white px-2 py-1 text-[11px] font-semibold text-slate-700 hover:bg-slate-100 transition cursor-pointer disabled:opacity-50"
                        >
                          Hạ bài
                        </button>
                      )}
                    </>
                  )}

                  {/* Nút sửa */}
                  <Link
                    href={`/cms/bai-viet/${art.id}`}
                    className="inline-block rounded-md border border-sky-200 bg-sky-50 px-2.5 py-1 text-[11px] font-semibold text-sky-700 hover:bg-sky-100 transition"
                  >
                    Sửa
                  </Link>

                  {/* Nút gỡ bài */}
                  {isLeader && (
                    <button
                      onClick={() => handleDelete(art.id, art.title)}
                      disabled={loadingId === art.id}
                      className="inline-block rounded-md border border-rose-200 bg-rose-50 px-2 py-1 text-[11px] font-semibold text-rose-600 hover:bg-rose-100 transition cursor-pointer disabled:opacity-50"
                    >
                      Gỡ
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
