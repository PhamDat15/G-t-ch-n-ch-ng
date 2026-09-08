"use client";

import { useState } from "react";

export interface CommentData {
  id: string;
  author: string;
  content: string;
  createdAt: string | Date;
}

export default function CommentSection({
  articleId,
  initialComments,
}: {
  articleId: string;
  initialComments: CommentData[];
}) {
  const [comments, setComments] = useState<CommentData[]>(initialComments);
  const [author, setAuthor] = useState("");
  const [email, setEmail] = useState("");
  const [content, setContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!author.trim() || !content.trim()) {
      setMessage({ type: "error", text: "Vui lòng nhập họ tên và nội dung bình luận của bạn." });
      return;
    }

    setIsSubmitting(true);
    setMessage(null);

    try {
      const res = await fetch("/api/comments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          articleId,
          author: author.trim(),
          email: email.trim(),
          content: content.trim(),
        }),
      });

      const data = await res.json();

      if (data.success && data.comment) {
        setComments((prev) => [data.comment, ...prev]);
        setContent("");
        setMessage({ type: "success", text: "✓ Ý kiến của bạn đã được đăng thành công!" });
      } else {
        setMessage({ type: "error", text: data.error || "Không thể đăng bình luận." });
      }
    } catch (err: any) {
      setMessage({ type: "error", text: "Lỗi kết nối mạng: " + err.message });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="mt-12 pt-8 border-t-2 border-slate-200">
      {/* Tiêu đề mục bình luận */}
      <div className="flex items-center justify-between border-b-2 border-[#0A2540] pb-2 mb-6">
        <h3 className="text-lg md:text-xl font-extrabold uppercase tracking-wide text-[#0A2540] font-sans">
          Ý Kiến Độc Giả ({comments.length})
        </h3>
        <span className="text-xs text-slate-500 font-mono">Bình luận văn minh & tôn trọng</span>
      </div>

      {/* Form nhập bình luận */}
      <form onSubmit={handleSubmit} className="bg-[#F8FAFC] border border-slate-200 p-5 rounded-sm mb-8 space-y-4 shadow-xs">
        <span className="text-xs font-bold uppercase tracking-wider text-[#1A56DB] block">
          Gửi ý kiến của bạn về bài viết này
        </span>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Họ và tên của bạn *
            </label>
            <input
              type="text"
              required
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
              placeholder="Ví dụ: Hoàng Nam, Minh Thư..."
              className="w-full bg-white border border-slate-300 rounded px-3 py-2 text-xs text-slate-800 focus:outline-none focus:border-[#1A56DB]"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Email liên hệ (không bắt buộc)
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="email@example.com (được bảo mật)"
              className="w-full bg-white border border-slate-300 rounded px-3 py-2 text-xs text-slate-800 focus:outline-none focus:border-[#1A56DB]"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            Nội dung bình luận *
          </label>
          <textarea
            required
            rows={3}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Chia sẻ cảm nhận hoặc kinh nghiệm thực tế của bạn về địa điểm/nội dung này..."
            className="w-full bg-white border border-slate-300 rounded p-3 text-sm text-slate-800 focus:outline-none focus:border-[#1A56DB] leading-relaxed"
          />
        </div>

        {message && (
          <div
            className={`p-3 rounded text-xs font-medium ${
              message.type === "success" ? "bg-emerald-50 text-emerald-800 border border-emerald-200" : "bg-rose-50 text-rose-800 border border-rose-200"
            }`}
          >
            {message.text}
          </div>
        )}

        <div className="flex items-center justify-end">
          <button
            type="submit"
            disabled={isSubmitting}
            className={`px-5 py-2.5 bg-[#0A2540] hover:bg-[#1A56DB] text-white text-xs font-bold uppercase tracking-wider transition rounded-xs cursor-pointer ${
              isSubmitting ? "opacity-60 cursor-not-allowed" : ""
            }`}
          >
            {isSubmitting ? "Đang gửi..." : "Gửi Ý Kiến"}
          </button>
        </div>
      </form>

      {/* Danh sách các bình luận */}
      <div className="space-y-4">
        {comments.length === 0 ? (
          <p className="text-xs text-slate-500 italic py-4">
            Chưa có bình luận nào. Hãy là người đầu tiên chia sẻ cảm nghĩ về bài viết này!
          </p>
        ) : (
          comments.map((cm) => {
            const firstLetter = cm.author ? cm.author.charAt(0).toUpperCase() : "Đ";
            const dateStr = new Date(cm.createdAt).toLocaleDateString("vi-VN", {
              hour: "2-digit",
              minute: "2-digit",
              day: "2-digit",
              month: "2-digit",
              year: "numeric",
            });

            return (
              <div
                key={cm.id}
                className="p-4 bg-white border border-slate-200 rounded-sm space-y-2 hover:border-slate-300 transition"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2.5">
                    <div className="w-8 h-8 rounded-full bg-sky-100 text-[#1A56DB] flex items-center justify-center font-bold text-xs">
                      {firstLetter}
                    </div>
                    <div>
                      <span className="text-xs font-bold text-slate-900 block">{cm.author}</span>
                      <span className="text-[10px] text-slate-400 font-mono">{dateStr}</span>
                    </div>
                  </div>
                </div>

                <p className="text-xs sm:text-sm text-slate-700 leading-relaxed pl-10 font-sans">
                  {cm.content}
                </p>
              </div>
            );
          })
        )}
      </div>
    </section>
  );
}
