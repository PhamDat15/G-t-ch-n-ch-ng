"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface CommentItem {
  id: string;
  author: string;
  content: string;
  createdAt: string | Date;
  article: {
    title: string;
    slug: string;
  };
}

export default function CommentTable({ initialComments }: { initialComments: CommentItem[] }) {
  const [comments, setComments] = useState<CommentItem[]>(initialComments);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const router = useRouter();

  const handleDelete = async (id: string) => {
    if (!window.confirm("Bạn có chắc chắn muốn xóa bình luận này không?")) return;

    setDeletingId(id);
    try {
      const res = await fetch(`/api/comments/${id}`, { method: "DELETE" });
      const data = await res.json();
      if (data.success) {
        setComments((prev) => prev.filter((c) => c.id !== id));
        router.refresh();
      } else {
        alert(data.error || "Không thể xóa bình luận");
      }
    } catch (err: any) {
      alert("Lỗi kết nối: " + err.message);
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left text-xs text-slate-700">
        <thead className="bg-slate-50 text-slate-600 uppercase font-semibold border-b border-slate-200">
          <tr>
            <th className="p-3.5">Người gửi</th>
            <th className="p-3.5">Nội dung ý kiến</th>
            <th className="p-3.5">Bài viết</th>
            <th className="p-3.5">Thời gian</th>
            <th className="p-3.5 text-right">Thao tác</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {comments.length === 0 ? (
            <tr>
              <td colSpan={5} className="p-8 text-center text-slate-400">
                Chưa có bình luận nào của độc giả.
              </td>
            </tr>
          ) : (
            comments.map((cm) => (
              <tr key={cm.id} className="hover:bg-slate-50 transition">
                <td className="p-3.5 font-bold text-slate-900 whitespace-nowrap">
                  {cm.author}
                </td>
                <td className="p-3.5 max-w-sm text-slate-800 leading-relaxed">
                  {cm.content}
                </td>
                <td className="p-3.5 max-w-xs truncate text-[#1A56DB]">
                  <Link href={`/bai-viet/${cm.article.slug}`} className="hover:underline">
                    {cm.article.title}
                  </Link>
                </td>
                <td className="p-3.5 text-slate-500 font-mono whitespace-nowrap">
                  {new Date(cm.createdAt).toLocaleDateString("vi-VN", {
                    hour: "2-digit",
                    minute: "2-digit",
                    day: "2-digit",
                    month: "2-digit",
                  })}
                </td>
                <td className="p-3.5 text-right whitespace-nowrap">
                  <button
                    onClick={() => handleDelete(cm.id)}
                    disabled={deletingId === cm.id}
                    className="text-rose-600 hover:text-rose-800 font-semibold cursor-pointer disabled:opacity-50 transition"
                  >
                    {deletingId === cm.id ? "Đang xóa..." : "[ Xóa ]"}
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
