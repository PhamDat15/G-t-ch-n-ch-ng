"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

interface EditableArticle { id: string; title: string; sapo: string; content: string; author: string; thumbnail: string | null; categoryId: string; isHero: boolean; isFeatured: boolean }
export default function EditArticleForm({ article, categories }: { article: EditableArticle; categories: { id: string; name: string }[] }) {
  const [form, setForm] = useState(article); const [saving, setSaving] = useState(false); const [message, setMessage] = useState(""); const router = useRouter();
  const set = (name: string, value: unknown) => setForm({ ...form, [name]: value });
  return <form className="space-y-5 rounded-xl border border-slate-200 bg-white p-6 shadow-sm" onSubmit={async (event) => { event.preventDefault(); setSaving(true); setMessage(""); const response = await fetch(`/api/articles/${article.id}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) }); const data = await response.json(); setMessage(response.ok ? "Đã lưu thay đổi." : data.error || "Không thể lưu"); setSaving(false); if (response.ok) router.refresh(); }}>
    <div><label className="mb-2 block text-sm font-semibold">Tiêu đề</label><input value={form.title} onChange={(e) => set("title", e.target.value)} className="w-full rounded-lg border border-slate-300 px-4 py-3 text-lg font-bold" required /></div>
    <div><label className="mb-2 block text-sm font-semibold">Sapo</label><textarea rows={3} value={form.sapo} onChange={(e) => set("sapo", e.target.value)} className="w-full rounded-lg border border-slate-300 px-4 py-3" required /></div>
    <div className="grid gap-5 md:grid-cols-2"><div><label className="mb-2 block text-sm font-semibold">Chuyên mục</label><select value={form.categoryId} onChange={(e) => set("categoryId", e.target.value)} className="w-full rounded-lg border border-slate-300 px-4 py-3">{categories.map((category) => <option key={category.id} value={category.id}>{category.name}</option>)}</select></div><div><label className="mb-2 block text-sm font-semibold">Tác giả</label><input value={form.author} onChange={(e) => set("author", e.target.value)} className="w-full rounded-lg border border-slate-300 px-4 py-3" /></div></div>
    <div><label className="mb-2 block text-sm font-semibold">URL ảnh đại diện</label><input value={form.thumbnail || ""} onChange={(e) => set("thumbnail", e.target.value)} className="w-full rounded-lg border border-slate-300 px-4 py-3" /></div>
    <div><label className="mb-2 block text-sm font-semibold">Nội dung HTML</label><textarea rows={18} value={form.content} onChange={(e) => set("content", e.target.value)} className="w-full rounded-lg border border-slate-300 px-4 py-3 font-mono text-sm" required /></div>
    <div className="flex gap-6 text-sm"><label className="flex items-center gap-2"><input type="checkbox" checked={form.isHero} onChange={(e) => set("isHero", e.target.checked)} /> Bài Hero</label><label className="flex items-center gap-2"><input type="checkbox" checked={form.isFeatured} onChange={(e) => set("isFeatured", e.target.checked)} /> Tin nổi bật</label></div>
    <div className="flex items-center gap-4"><button disabled={saving} className="rounded-lg bg-[#175b8f] px-5 py-3 text-sm font-bold text-white disabled:opacity-50">{saving ? "Đang lưu..." : "Lưu bài viết"}</button>{message && <p className="text-sm font-semibold text-emerald-700">{message}</p>}</div>
  </form>;
}
