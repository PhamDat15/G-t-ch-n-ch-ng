"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface ArticleItem {
  id: string;
  title: string;
  slug: string;
  author: string;
  isHero: boolean;
  isFeatured: boolean;
  publishedAt: string | Date;
  category: {
    name: string;
  };
}

export default function ArticleTable({ initialArticles }: { initialArticles: ArticleItem[] }) {
  const [articles, setArticles] = useState<ArticleItem[]>(initialArticles);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const router = useRouter();

  const handleDelete = async (id: string, title: string) => {
    const confirmed = window.confirm(`Bạn có chắc chắn muốn gỡ bài báo: "${title}" không?`);
    if (!confirmed) return;

    setDeletingId(id);
    try {
      const res = await fetch(`/api/articles/${id}`, {
        method: "DELETE",
      });
      const data = await res.json();

      if (data.success) {
        // Cập nhật danh sách hiển thị tức thì trên giao diện
        setArticles((prev) => prev.filter((art) => art.id !== id));
        router.refresh();
      } else {
        alert(data.error || "Không thể gỡ bài viết. Vui lòng thử lại.");
      }
    } catch (err: any) {
      alert("Lỗi kết nối mạng: " + err.message);
    } finally {
      setDeletingId(null);
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
            <th className="p-3.5">Vị trí</th>
            <th className="p-3.5">Ngày đăng</th>
            <th className="p-3.5 text-right">Thao tác</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {articles.length === 0 ? (
            <tr>
              <td colSpan={6} className="p-8 text-center text-slate-500">
                Chưa có bài viết nào hoặc toàn bộ bài viết đã được gỡ.
              </td>
            </tr>
          ) : (
            articles.map((art) => (
              <tr key={art.id} className="hover:bg-slate-50 transition">
                <td className="p-3.5 font-bold text-slate-900 max-w-md truncate">
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
                <td className="p-3.5">
                  {art.isHero ? (
                    <span className="bg-amber-100 text-amber-900 font-bold px-1.5 py-0.5 rounded text-[10px]">
                      HERO TRANG CHỦ
                    </span>
                  ) : art.isFeatured ? (
                    <span className="bg-slate-100 text-slate-800 px-1.5 py-0.5 rounded text-[10px]">
                      NỔI BẬT
                    </span>
                  ) : (
                    <span className="text-slate-400">—</span>
                  )}
                </td>
                <td className="p-3.5 text-slate-500 font-mono">
                  {new Date(art.publishedAt).toLocaleDateString("vi-VN")}
                </td>
                <td className="p-3.5 text-right space-x-3 whitespace-nowrap">
                  <Link
                    href={`/bai-viet/${art.slug}`}
                    className="text-[#1A56DB] hover:underline font-semibold"
                  >
                    Xem bài »
                  </Link>

                  <button
                    onClick={() => handleDelete(art.id, art.title)}
                    disabled={deletingId === art.id}
                    className="text-rose-600 hover:text-rose-800 font-semibold cursor-pointer disabled:opacity-50 transition"
                  >
                    {deletingId === art.id ? "Đang gỡ..." : "[ Gỡ bài ]"}
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
