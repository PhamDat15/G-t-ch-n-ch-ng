"use client";
import { useState } from "react";
import Link from "next/link";
import { CATEGORIES } from "@/lib/constants";

export default function CmsImportForm() {
  const [file, setFile] = useState<File | null>(null); const [categorySlug, setCategorySlug] = useState("kham-pha"); const [author, setAuthor] = useState("Ban Biên tập Việt Nam Travel"); const [isHero, setIsHero] = useState(false); const [isFeatured, setIsFeatured] = useState(false); const [loading, setLoading] = useState(false); const [result, setResult] = useState<{ error?: string; article?: { title: string; slug: string } } | null>(null);
  return <form className="space-y-6 rounded-xl border border-slate-200 bg-white p-6 shadow-sm" onSubmit={async (event) => {
    event.preventDefault(); if (!file) return; setLoading(true); setResult(null);
    try {
      let response: Response;
      if (file.size > 3.5 * 1024 * 1024) {
        const presign = await fetch("/api/upload-presigned", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ filename: file.name, contentType: file.type }) });
        const signed = await presign.json(); if (!presign.ok) throw new Error(signed.error || "Không thể tạo liên kết tải lên");
        const uploaded = await fetch(signed.uploadUrl, { method: "PUT", headers: { "Content-Type": file.type || "application/vnd.openxmlformats-officedocument.wordprocessingml.document" }, body: file }); if (!uploaded.ok) throw new Error("Tải file lên kho lưu trữ thất bại");
        response = await fetch("/api/import-word", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ r2Key: signed.key, categorySlug, author, isHero, isFeatured }) });
      } else {
        const data = new FormData(); data.append("file", file); data.append("categorySlug", categorySlug); data.append("author", author); data.append("isHero", String(isHero)); data.append("isFeatured", String(isFeatured));
        response = await fetch("/api/import-word", { method: "POST", body: data });
      }
      const data = await response.json(); if (!response.ok) throw new Error(data.error || "Không thể nhập bài"); setResult(data); setFile(null);
    } catch (error) { setResult({ error: error instanceof Error ? error.message : "Có lỗi xảy ra" }); } finally { setLoading(false); }
  }}>
    <div className="rounded-xl border-2 border-dashed border-slate-300 bg-slate-50 p-8 text-center"><label className="cursor-pointer"><span className="block font-bold text-[#123b5d]">{file ? file.name : "Chọn file Word (.docx)"}</span><span className="mt-2 block text-sm text-slate-500">Hệ thống tự nhận diện tiêu đề, sapo và hình ảnh</span><input type="file" accept=".docx" className="hidden" onChange={(event) => setFile(event.target.files?.[0] || null)} /></label></div>
    <div className="grid gap-5 md:grid-cols-2"><div><label className="mb-2 block text-sm font-semibold">Chuyên mục</label><select value={categorySlug} onChange={(e) => setCategorySlug(e.target.value)} className="w-full rounded-lg border border-slate-300 px-4 py-2.5">{CATEGORIES.map((category) => <option key={category.slug} value={category.slug}>{category.name}</option>)}</select></div><div><label className="mb-2 block text-sm font-semibold">Tác giả / Nguồn</label><input value={author} onChange={(e) => setAuthor(e.target.value)} className="w-full rounded-lg border border-slate-300 px-4 py-2.5" /></div></div>
    <div className="flex flex-wrap gap-6 text-sm"><label className="flex items-center gap-2"><input type="checkbox" checked={isHero} onChange={(e) => setIsHero(e.target.checked)} /> Bài tiêu điểm trang chủ</label><label className="flex items-center gap-2"><input type="checkbox" checked={isFeatured} onChange={(e) => setIsFeatured(e.target.checked)} /> Tin nổi bật</label></div>
    <button disabled={!file || loading} className="rounded-lg bg-[#175b8f] px-5 py-3 text-sm font-bold text-white hover:bg-[#2576ae] disabled:opacity-50">{loading ? "Đang xử lý bài viết..." : "Nhập và xuất bản"}</button>
    {result?.error && <p className="rounded-lg bg-rose-50 p-4 text-sm text-rose-700">{result.error}</p>}{result?.article && <p className="rounded-lg bg-emerald-50 p-4 text-sm text-emerald-800">Đã đăng “{result.article.title}”. <Link href={`/bai-viet/${result.article.slug}`} target="_blank" className="font-bold underline">Xem bài ↗</Link></p>}
  </form>;
}
