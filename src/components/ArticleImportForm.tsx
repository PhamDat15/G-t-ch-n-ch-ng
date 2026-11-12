"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import Image from "next/image";

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

export default function ArticleImportForm() {
  // State chung
  const [selectedCategory, setSelectedCategory] = useState("kham-pha");
  const [author, setAuthor] = useState("Ban Biên tập Việt Nam Travel");
  const [isHero, setIsHero] = useState(false);
  const [isFeatured, setIsFeatured] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState("");
  const [result, setResult] = useState<ImportResult | null>(null);

  // State cho ảnh đại diện Thumbnail tùy chỉnh (Custom Thumbnail Upload)
  const [customThumbnail, setCustomThumbnail] = useState<string>("");
  const [isUploadingThumb, setIsUploadingThumb] = useState(false);
  const thumbInputRef = useRef<HTMLInputElement>(null);

  // State cho bài viết Word thông thường
  const [file, setFile] = useState<File | null>(null);

  // State riêng cho Multimedia (YouTube)
  const [youtubeUrl, setYoutubeUrl] = useState("");
  const [youtubeVideoId, setYoutubeVideoId] = useState("");
  const [videoTitle, setVideoTitle] = useState("");
  const [videoSapo, setVideoSapo] = useState("");
  const [isFetchingYt, setIsFetchingYt] = useState(false);
  const [ytError, setYtError] = useState("");

  const isMultimedia = selectedCategory === "multimedia";

  // Hàm xử lý upload ảnh đại diện tùy chỉnh lên Cloudflare R2
  const handleUploadThumbnail = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const thumbFile = e.target.files?.[0];
    if (!thumbFile) return;

    setIsUploadingThumb(true);
    try {
      const formData = new FormData();
      formData.append("file", thumbFile);

      const res = await fetch("/api/cms/upload-thumbnail", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Không thể tải ảnh lên");
      }

      setCustomThumbnail(data.url);
    } catch (err: unknown) {
      alert("Lỗi tải ảnh đại diện: " + (err instanceof Error ? err.message : "Thất bại"));
    } finally {
      setIsUploadingThumb(false);
    }
  };

  // Lấy thông tin video từ YouTube API
  const handleFetchYoutubeInfo = async () => {
    if (!youtubeUrl.trim()) {
      setYtError("Vui lòng dán đường link YouTube.");
      return;
    }

    setIsFetchingYt(true);
    setYtError("");

    try {
      const res = await fetch("/api/cms/youtube-info", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: youtubeUrl.trim() }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Không thể lấy thông tin video.");
      }

      setYoutubeVideoId(data.videoId);
      setVideoTitle(data.title);
      // Gán thumbnail mặc định của YouTube nếu người dùng chưa tự up ảnh riêng
      if (!customThumbnail) {
        setCustomThumbnail(data.thumbnail);
      }
      if (data.author) setAuthor(data.author);
      if (!videoSapo) {
        setVideoSapo(`Cùng Việt Nam Travel khám phá video: ${data.title}.`);
      }
    } catch (err: unknown) {
      setYtError(err instanceof Error ? err.message : "Đã xảy ra lỗi khi lấy thông tin YouTube.");
    } finally {
      setIsFetchingYt(false);
    }
  };

  // Submit bài viết Multimedia
  const handleMultimediaSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!youtubeVideoId) {
      alert("Vui lòng nhập link YouTube và bấm 'Lấy thông tin' trước khi đăng.");
      return;
    }
    if (!videoTitle.trim()) {
      alert("Vui lòng nhập tiêu đề cho video.");
      return;
    }

    setIsLoading(true);
    setLoadingMessage("Đang đăng video Multimedia lên hệ thống...");
    setResult(null);

    try {
      const res = await fetch("/api/cms/multimedia", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          videoId: youtubeVideoId,
          title: videoTitle.trim(),
          sapo: videoSapo.trim(),
          author: author.trim(),
          isHero,
          isFeatured,
          customThumbnail: customThumbnail || undefined,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Đăng bài video thất bại.");
      }

      setResult(data);
      setYoutubeUrl("");
      setYoutubeVideoId("");
      setVideoTitle("");
      setVideoSapo("");
      setCustomThumbnail("");
    } catch (err: unknown) {
      setResult({ success: false, error: err instanceof Error ? err.message : "Lỗi khi lưu video." });
    } finally {
      setIsLoading(false);
      setLoadingMessage("");
    }
  };

  // Hỗ trợ kéo thả file Word
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

  // Submit bài viết Word thông thường
  const handleWordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) {
      alert("Vui lòng chọn file Word (.docx)");
      return;
    }

    setIsLoading(true);
    setResult(null);

    try {
      let res: Response;

      if (file.size > 3.5 * 1024 * 1024) {
        setLoadingMessage("Đang tải file lớn trực tiếp lên Cloudflare R2...");
        const presignRes = await fetch("/api/upload-presigned", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ filename: file.name, contentType: file.type || "application/vnd.openxmlformats-officedocument.wordprocessingml.document" }),
        });

        if (!presignRes.ok) throw new Error("Không thể khởi tạo phiên tải lên R2");
        const { uploadUrl, key } = await presignRes.json();

        const uploadToR2Res = await fetch(uploadUrl, {
          method: "PUT",
          headers: { "Content-Type": file.type || "application/vnd.openxmlformats-officedocument.wordprocessingml.document" },
          body: file,
        });

        if (!uploadToR2Res.ok) throw new Error("Tải file lên Cloudflare R2 thất bại");

        setLoadingMessage("Đang bóc tách hình ảnh và chuyển đổi định dạng bài viết...");
        res = await fetch("/api/import-word", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            r2Key: key,
            categorySlug: selectedCategory,
            author,
            isHero,
            isFeatured,
            customThumbnail: customThumbnail || undefined,
          }),
        });
      } else {
        setLoadingMessage("Đang phân tích Word & bóc tách hình ảnh sắc nét...");
        const formData = new FormData();
        formData.append("file", file);
        formData.append("categorySlug", selectedCategory);
        formData.append("author", author);
        formData.append("isHero", String(isHero));
        formData.append("isFeatured", String(isFeatured));
        if (customThumbnail) {
          formData.append("customThumbnail", customThumbnail);
        }

        res = await fetch("/api/import-word", {
          method: "POST",
          body: formData,
        });
      }

      if (!res.ok) {
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
        setCustomThumbnail("");
      }
    } catch (error: unknown) {
      setResult({ success: false, error: error instanceof Error ? error.message : "Lỗi mạng khi tải file" });
    } finally {
      setIsLoading(false);
      setLoadingMessage("");
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Tiêu đề & Giới thiệu */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0A2540]">
          Thêm Bài Viết Mới
        </h1>
        <p className="mt-2 text-sm text-slate-600">
          Hỗ trợ tải lên ảnh Thumbnail riêng, nhập bài tự động từ file Word (.docx) hoặc link Video YouTube.
        </p>
      </div>

      {/* Form chính */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 sm:p-8 shadow-sm">
        {/* Chọn chuyên mục đầu tiên để đổi chế độ nhập liệu */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-6 border-b border-slate-100">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
              Chuyên mục đăng bài *
            </label>
            <select
              value={selectedCategory}
              onChange={(e) => {
                setSelectedCategory(e.target.value);
                setResult(null);
              }}
              className="w-full bg-white border border-slate-300 rounded px-3 py-2.5 text-sm font-semibold text-slate-800 focus:outline-none focus:border-[#d49a37] focus:ring-1 focus:ring-[#d49a37]"
            >
              {CATEGORIES.map((cat) => (
                <option key={cat.slug} value={cat.slug}>
                  {cat.name} {cat.slug === "multimedia" ? "(Video YouTube)" : ""}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
              Tác giả / Kênh phát hành
            </label>
            <input
              type="text"
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
              placeholder="Ví dụ: Ban Biên Tập, Tên Kênh..."
              className="w-full bg-white border border-slate-300 rounded px-3 py-2.5 text-sm text-slate-800 focus:outline-none focus:border-[#d49a37]"
            />
          </div>
        </div>

        {/* ------------------------------------------------------------- */}
        {/* KHỐI ẢNH ĐẠI DIỆN (THUMBNAIL) TÙY CHỌN CHO MỌI LOẠI BÀI VIẾT  */}
        {/* ------------------------------------------------------------- */}
        <div className="py-6 border-b border-slate-100">
          <div className="flex items-center justify-between mb-2">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
              Ảnh đại diện bài viết (Thumbnail)
            </label>
            <span className="text-xs text-slate-500">
              Tùy chọn: tải ảnh ngang 16:9 sắc nét từ máy tính
            </span>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-5">
            {/* Khung Preview ảnh Thumbnail */}
            <div className="relative h-28 w-44 shrink-0 overflow-hidden rounded-xl border border-slate-200 bg-slate-100 shadow-inner flex items-center justify-center">
              {customThumbnail ? (
                <img
                  src={customThumbnail}
                  alt="Thumbnail xem trước"
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="text-center p-3 text-slate-400">
                  <svg className="w-8 h-8 mx-auto mb-1 stroke-current fill-none" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <span className="text-[10px]">Chưa có ảnh bìa</span>
                </div>
              )}
            </div>

            {/* Nút bấm tải ảnh */}
            <div className="flex-1 space-y-2">
              <input
                ref={thumbInputRef}
                type="file"
                accept="image/*"
                onChange={handleUploadThumbnail}
                className="hidden"
              />
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => thumbInputRef.current?.click()}
                  disabled={isUploadingThumb}
                  className="px-4 py-2 bg-slate-800 text-white font-bold text-xs rounded-lg hover:bg-slate-700 transition disabled:opacity-50 cursor-pointer"
                >
                  {isUploadingThumb ? "Đang tải ảnh..." : "Chọn ảnh bìa từ máy tính ↗"}
                </button>
                {customThumbnail && (
                  <button
                    type="button"
                    onClick={() => setCustomThumbnail("")}
                    className="px-3 py-2 border border-slate-300 text-slate-600 font-semibold text-xs rounded-lg hover:bg-slate-100 transition"
                  >
                    Xóa ảnh
                  </button>
                )}
              </div>
              <p className="text-[11px] text-slate-500 leading-normal">
                Nếu không tải ảnh riêng: Hệ thống sẽ tự động dùng ảnh đầu tiên trong file Word hoặc ảnh mặc định từ YouTube.
              </p>
            </div>
          </div>
        </div>

        {/* ------------------------------------------------------------- */}
        {/* KHỐI 1: NẾU LÀ CHUYÊN MỤC MULTIMEDIA (DÁN LINK YOUTUBE)       */}
        {/* ------------------------------------------------------------- */}
        {isMultimedia ? (
          <form onSubmit={handleMultimediaSubmit} className="space-y-6 pt-6">
            <div className="rounded-xl border border-amber-200 bg-[#fffdfa] p-4 text-xs text-amber-900 leading-relaxed">
              💡 <strong>Chế độ Video Multimedia:</strong> Bạn chỉ cần dán đường link video từ YouTube (kể cả YouTube Shorts), hệ thống sẽ tự động trích xuất tiêu đề, tích hợp trình phát video và dùng ảnh đại diện ở trên.
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                Đường link Video YouTube *
              </label>
              <div className="flex gap-2">
                <input
                  type="url"
                  value={youtubeUrl}
                  onChange={(e) => setYoutubeUrl(e.target.value)}
                  placeholder="https://www.youtube.com/watch?v=... hoặc https://youtu.be/..."
                  className="flex-1 bg-white border border-slate-300 rounded px-3 py-2.5 text-sm text-slate-800 focus:outline-none focus:border-[#d49a37]"
                />
                <button
                  type="button"
                  onClick={handleFetchYoutubeInfo}
                  disabled={isFetchingYt || !youtubeUrl.trim()}
                  className="shrink-0 px-4 py-2.5 bg-[#d49a37] text-white font-bold text-xs uppercase tracking-wider rounded hover:bg-[#b88226] transition disabled:opacity-50"
                >
                  {isFetchingYt ? "Đang tải..." : "Lấy thông tin"}
                </button>
              </div>
              {ytError && <p className="mt-2 text-xs text-red-600">{ytError}</p>}
            </div>

            {/* Khung xem trước và tùy chỉnh khi đã lấy được video */}
            {youtubeVideoId && (
              <div className="space-y-5 rounded-xl border border-slate-200 bg-slate-50 p-5 animate-fade-in">
                <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                    Xem trước Video YouTube
                  </h3>
                  <span className="text-[11px] font-mono text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                    ID: {youtubeVideoId}
                  </span>
                </div>

                {/* Trình phát nhúng thử */}
                <div className="aspect-video w-full max-w-xl mx-auto overflow-hidden rounded-xl bg-black shadow">
                  <iframe
                    src={`https://www.youtube.com/embed/${youtubeVideoId}`}
                    title="YouTube video player"
                    className="w-full h-full border-0"
                    allowFullScreen
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                    Tiêu đề video (có thể chỉnh sửa lại) *
                  </label>
                  <input
                    type="text"
                    value={videoTitle}
                    onChange={(e) => setVideoTitle(e.target.value)}
                    className="w-full bg-white border border-slate-300 rounded px-3 py-2 text-sm text-slate-800 font-bold focus:outline-none focus:border-[#d49a37]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                    Đoạn mô tả ngắn (Sapo)
                  </label>
                  <textarea
                    rows={3}
                    value={videoSapo}
                    onChange={(e) => setVideoSapo(e.target.value)}
                    placeholder="Mô tả tóm tắt nội dung video..."
                    className="w-full bg-white border border-slate-300 rounded px-3 py-2 text-sm text-slate-800 focus:outline-none focus:border-[#d49a37]"
                  />
                </div>
              </div>
            )}

            {/* Checkbox vị trí hiển thị */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-3 sm:space-y-0 sm:space-x-8 pt-2">
              <label className="flex items-center space-x-2 text-sm text-slate-800 cursor-pointer">
                <input
                  type="checkbox"
                  checked={isHero}
                  onChange={(e) => setIsHero(e.target.checked)}
                  className="rounded border-slate-300 text-[#d49a37] focus:ring-[#d49a37]"
                />
                <span className="font-medium">Đặt làm bài tiêu điểm lớn nhất (Hero)</span>
              </label>

              <label className="flex items-center space-x-2 text-sm text-slate-800 cursor-pointer">
                <input
                  type="checkbox"
                  checked={isFeatured}
                  onChange={(e) => setIsFeatured(e.target.checked)}
                  className="rounded border-slate-300 text-[#d49a37] focus:ring-[#d49a37]"
                />
                <span className="font-medium">Đánh dấu nổi bật (Đọc nhiều)</span>
              </label>
            </div>

            {/* Nút bấm Submit */}
            <div className="pt-4">
              <button
                type="submit"
                disabled={isLoading || !youtubeVideoId}
                className="w-full sm:w-auto px-8 py-3 bg-[#d49a37] text-white font-bold text-sm uppercase tracking-wider rounded-lg shadow hover:bg-[#b88226] transition disabled:opacity-50 cursor-pointer"
              >
                {isLoading ? (loadingMessage || "Đang xử lý...") : "Đăng Video Multimedia"}
              </button>
            </div>
          </form>
        ) : (
          /* ------------------------------------------------------------- */
          /* KHỐI 2: CÁC CHUYÊN MỤC BÀI VIẾT THÔNG THƯỜNG (FILE WORD)     */
          /* ------------------------------------------------------------- */
          <form onSubmit={handleWordSubmit} className="space-y-6 pt-6">
            <div
              onDrop={handleDrop}
              onDragOver={(e) => e.preventDefault()}
              className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                file
                  ? "border-emerald-500 bg-emerald-50/30"
                  : "border-slate-300 hover:border-[#1A56DB] bg-slate-50/50"
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

            {/* Checkbox vị trí hiển thị */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-3 sm:space-y-0 sm:space-x-8 pt-2">
              <label className="flex items-center space-x-2 text-sm text-slate-800 cursor-pointer">
                <input
                  type="checkbox"
                  checked={isHero}
                  onChange={(e) => setIsHero(e.target.checked)}
                  className="rounded border-slate-300 text-[#1A56DB] focus:ring-[#1A56DB]"
                />
                <span className="font-medium">Đặt làm bài tiêu điểm lớn nhất (Hero)</span>
              </label>

              <label className="flex items-center space-x-2 text-sm text-slate-800 cursor-pointer">
                <input
                  type="checkbox"
                  checked={isFeatured}
                  onChange={(e) => setIsFeatured(e.target.checked)}
                  className="rounded border-slate-300 text-[#1A56DB] focus:ring-[#1A56DB]"
                />
                <span className="font-medium">Đánh dấu nổi bật (Đọc nhiều)</span>
              </label>
            </div>

            {/* Nút bấm Submit */}
            <div className="pt-4">
              <button
                type="submit"
                disabled={isLoading || !file}
                className="w-full sm:w-auto px-8 py-3 bg-[#1A56DB] text-white font-bold text-sm uppercase tracking-wider rounded shadow hover:bg-[#1546B0] transition disabled:opacity-50 cursor-pointer"
              >
                {isLoading ? (loadingMessage || "Đang bóc tách bài viết...") : "Xuất bản bài viết"}
              </button>
            </div>
          </form>
        )}
      </div>

      {/* Hiển thị kết quả thành công / thất bại */}
      {result && (
        <div
          className={`border p-6 rounded-xl animate-fade-in ${
            result.success
              ? "bg-emerald-50 border-emerald-200 text-emerald-900"
              : "bg-red-50 border-red-200 text-red-900"
          }`}
        >
          {result.success ? (
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <span className="font-bold text-lg">Đăng bài thành công!</span>
              </div>
              {result.article && (
                <div className="pt-2">
                  <p className="font-semibold text-base">{result.article.title}</p>
                  <div className="mt-3 flex items-center space-x-4">
                    <Link
                      href={`/bai-viet/${result.article.slug}`}
                      target="_blank"
                      className="text-xs font-bold uppercase tracking-wider bg-emerald-600 text-white px-4 py-2 rounded hover:bg-emerald-700 transition"
                    >
                      Xem bài viết thực tế ↗
                    </Link>
                    <Link
                      href="/cms/bai-viet"
                      className="text-xs font-bold uppercase tracking-wider text-emerald-800 underline hover:text-emerald-950"
                    >
                      Về danh sách bài viết
                    </Link>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-2">
              <span className="font-bold text-lg text-red-800">Đã xảy ra lỗi:</span>
              <p className="text-sm text-red-700">{result.error}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
