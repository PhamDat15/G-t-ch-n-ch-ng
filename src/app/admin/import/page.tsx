"use client";

import { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Link from "next/link";

interface ImportResult {
  success: boolean;
  article?: {
    id: string;
    title: string;
    slug: string;
    sapo: string;
    thumbnail: string | null;
  };
  imageCount?: number;
  message?: string;
  error?: string;
}

const CATEGORIES = [
  { name: "Văn hóa", slug: "van-hoa" },
  { name: "Lưu trú", slug: "luu-tru" },
  { name: "Khám phá", slug: "kham-pha" },
  { name: "Con người", slug: "con-nguoi" },
  { name: "Ẩm thực", slug: "am-thuc" },
  { name: "Multimedia", slug: "multimedia" },
  { name: "Kinh nghiệm", slug: "kinh-nghiem" },
];

export default function ImportWordPage() {
  const [file, setFile] = useState<File | null>(null);
  const [selectedCategory, setSelectedCategory] = useState("kham-pha");
  const [author, setAuthor] = useState("Ban Biên Tập Gạt Chân Chống");
  const [isHero, setIsHero] = useState(false);
  const [isFeatured, setIsFeatured] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<ImportResult | null>(null);

  // Hỗ trợ kéo thả file
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const droppedFile = e.dataTransfer.files[0];
      if (droppedFile.name.endsWith(".docx")) {
        setFile(droppedFile);
      } else {
        alert("Vui lòng chỉ chọn file Word có định dạng .docx");
      }
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) {
      alert("Vui lòng chọn file Word (.docx)");
      return;
    }

    setIsLoading(true);
    setResult(null);

    const formData = new FormData();
    formData.append("file", file);
    formData.append("categorySlug", selectedCategory);
    formData.append("author", author);
    formData.append("isHero", String(isHero));
    formData.append("isFeatured", String(isFeatured));

    try {
      const res = await fetch("/api/import-word", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        if (res.status === 413) {
          throw new Error("File có dung lượng quá lớn (vượt quá giới hạn cho phép của máy chủ). Hãy nén bớt hình ảnh trong file Word hoặc thử lại.");
        }
        const text = await res.text();
        try {
          const parsedError = JSON.parse(text);
          throw new Error(parsedError.error || `Lỗi máy chủ (${res.status})`);
        } catch {
          throw new Error(`Máy chủ phản hồi lỗi (${res.status}): ${text.slice(0, 100)}...`);
        }
      }

      const data = await res.json();
      setResult(data);
      if (data.success) {
        setFile(null);
      }
    } catch (err: any) {
      setResult({ success: false, error: err.message || "Lỗi mạng khi tải file" });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F8FAFC]">
      <Header />

      <main className="flex-1 max-w-4xl mx-auto px-4 py-10 w-full">
        {/* Banner tiêu đề trang import */}
        <div className="bg-white border border-slate-200 p-6 md:p-8 rounded-sm mb-8 shadow-xs">
          <div className="border-b border-slate-200 pb-4 mb-6">
            <span className="text-xs font-bold uppercase tracking-wider text-[#1A56DB]">
              Hệ Thống Tự Động Hóa Tòa Soạn
            </span>
            <h1 className="text-2xl md:text-3xl font-extrabold text-[#0A2540] font-serif mt-1">
              Nhập Bài Viết Tự Động Từ File Word (.docx)
            </h1>
            <p className="text-sm text-slate-600 mt-2 leading-relaxed">
              Tải lên file văn bản Word của bạn. Hệ thống sẽ tự động bóc tách tiêu đề, sapo, các đoạn văn và <strong>trích xuất toàn bộ hình ảnh ở độ nét tối đa (WebP 95%)</strong> rồi đóng gói vào đúng khuôn thiết kế của tạp chí Gạt Chân Chống.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Vùng kéo thả file */}
            <div
              onDragOver={(e) => e.preventDefault()}
              onDrop={handleDrop}
              className={`border-2 border-dashed rounded p-8 text-center transition cursor-pointer ${
                file ? "border-[#1A56DB] bg-sky-50/50" : "border-slate-300 hover:border-[#1A56DB] bg-white"
              }`}
            >
              <input
                type="file"
                id="wordFileInput"
                accept=".docx"
                onChange={handleFileChange}
                className="hidden"
              />
              <label htmlFor="wordFileInput" className="cursor-pointer block">
                <div className="space-y-2">
                  <span className="text-sm font-bold text-[#0A2540] block">
                    {file ? file.name : "Kéo thả file .docx vào đây, hoặc bấm để chọn file"}
                  </span>
                  <p className="text-xs text-slate-500">
                    {file
                      ? `Kích thước: ${(file.size / 1024 / 1024).toFixed(2)} MB`
                      : "Hỗ trợ định dạng Microsoft Word (.docx) chứa văn bản xen kẽ hình ảnh"}
                  </p>
                  <span className="inline-block text-xs font-semibold text-[#1A56DB] underline pt-2">
                    [ Chọn file từ máy tính ]
                  </span>
                </div>
              </label>
            </div>

            {/* Các tùy chọn chuyên mục và bài viết */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                  Chuyên mục đăng bài (1 trong 7 mục) *
                </label>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full bg-white border border-slate-300 rounded px-3 py-2 text-sm text-slate-800 focus:outline-none focus:border-[#1A56DB]"
                >
                  {CATEGORIES.map((cat) => (
                    <option key={cat.slug} value={cat.slug}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                  Tác giả / Nguồn tin
                </label>
                <input
                  type="text"
                  value={author}
                  onChange={(e) => setAuthor(e.target.value)}
                  placeholder="Ví dụ: Trần Nam, Ban Biên Tập..."
                  className="w-full bg-white border border-slate-300 rounded px-3 py-2 text-sm text-slate-800 focus:outline-none focus:border-[#1A56DB]"
                />
              </div>
            </div>

            {/* Checkbox vị trí hiển thị */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-3 sm:space-y-0 sm:space-x-8 pt-2">
              <label className="flex items-center space-x-2 text-sm text-slate-800 cursor-pointer">
                <input
                  type="checkbox"
                  checked={isHero}
                  onChange={(e) => setIsHero(e.target.checked)}
                  className="w-4 h-4 text-[#1A56DB] rounded border-slate-300 focus:ring-0"
                />
                <span className="font-semibold">Đặt làm Bài Tiêu Điểm Lớn (Hero Trang Chủ)</span>
              </label>

              <label className="flex items-center space-x-2 text-sm text-slate-800 cursor-pointer">
                <input
                  type="checkbox"
                  checked={isFeatured}
                  onChange={(e) => setIsFeatured(e.target.checked)}
                  className="w-4 h-4 text-[#1A56DB] rounded border-slate-300 focus:ring-0"
                />
                <span>Đánh dấu là Tin nổi bật</span>
              </label>
            </div>

            {/* Nút bấm Submit */}
            <div className="pt-4 border-t border-slate-200">
              <button
                type="submit"
                disabled={isLoading || !file}
                className={`w-full py-3.5 px-6 font-bold uppercase tracking-wider text-xs transition rounded-sm text-white ${
                  isLoading || !file
                    ? "bg-slate-400 cursor-not-allowed"
                    : "bg-[#0A2540] hover:bg-[#1A56DB] cursor-pointer"
                }`}
              >
                {isLoading ? "Đang phân tích Word & bóc tách hình ảnh sắc nét..." : "Bắt đầu Xử Lý & Xuất Bản Lên Web"}
              </button>
            </div>
          </form>

          {/* Kết quả sau khi Import */}
          {result && (
            <div className="mt-8 pt-6 border-t border-slate-200">
              {result.success && result.article ? (
                <div className="bg-emerald-50 border border-emerald-300 p-5 rounded">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-bold text-emerald-900 uppercase">
                      ✓ Đã nhập thành công bài viết lên website!
                    </h3>
                    <span className="text-xs text-emerald-700 font-mono">
                      {result.imageCount} ảnh chất lượng cao đã trích xuất
                    </span>
                  </div>
                  <p className="text-base font-bold text-slate-900 mt-2 font-serif">
                    {result.article.title}
                  </p>
                  <p className="text-xs text-slate-600 mt-1 line-clamp-2">{result.article.sapo}</p>

                  <div className="mt-4 flex items-center space-x-4">
                    <Link
                      href={`/bai-viet/${result.article.slug}`}
                      className="bg-[#0A2540] hover:bg-[#1A56DB] text-white text-xs font-bold px-4 py-2 uppercase tracking-wider transition inline-block"
                    >
                      Xem Bài Viết Vừa Đăng »
                    </Link>
                    <Link
                      href="/"
                      className="text-xs font-semibold text-slate-700 hover:underline"
                    >
                      Về Trang Chủ Kiểm Tra
                    </Link>
                  </div>
                </div>
              ) : (
                <div className="bg-rose-50 border border-rose-300 p-4 rounded text-xs text-rose-800">
                  <p className="font-bold">Đã xảy ra lỗi khi xử lý:</p>
                  <p className="mt-1">{result.error}</p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Hướng dẫn dành cho khách hàng */}
        <div className="bg-white border border-slate-200 p-6 rounded-sm text-xs text-slate-600 space-y-3">
          <h4 className="font-bold text-slate-800 uppercase tracking-wider text-sm border-b border-slate-100 pb-2">
            Quy chuẩn soạn thảo bài viết trong Word (.docx) để lên khuôn đẹp nhất:
          </h4>
          <ul className="space-y-2 list-disc pl-5 leading-relaxed">
            <li><strong>Dòng đầu tiên:</strong> Tiêu đề chính của bài báo (hoặc dùng Style Heading 1).</li>
            <li><strong>Đoạn văn thứ hai:</strong> Đoạn Sapo tóm tắt mở đầu (ngắn gọn 2-3 câu).</li>
            <li><strong>Hình ảnh:</strong> Chèn ảnh trực tiếp vào file Word (Insert &gt; Pictures). Giữ ảnh gốc nét nhất có thể, hệ thống sẽ tự động chuyển đổi sang định dạng WebP 95% siêu nét.</li>
            <li><strong>Chú thích ảnh (Caption):</strong> Gõ dòng chú thích ngay bên dưới ảnh, hệ thống sẽ tự động ghép thành khung hình có chú thích chuẩn báo chí.</li>
            <li><strong>Tiêu đề mục con:</strong> Dùng Style Heading 2 hoặc Heading 3 để tự động tạo thanh gạch phân đoạn màu xanh sang trọng.</li>
          </ul>
        </div>
      </main>

      <Footer />
    </div>
  );
}
