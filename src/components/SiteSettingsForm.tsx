"use client";
import { useState } from "react";

type Settings = Record<string, string | null>;
const FIELDS = [
  ["siteName", "Tên tạp chí"], ["slogan", "Slogan"], ["description", "Mô tả"], ["editor", "Tổng biên tập / Ban biên tập"],
  ["address", "Địa chỉ"], ["phone", "Điện thoại"], ["email", "Email"], ["facebookUrl", "Facebook URL"],
  ["youtubeUrl", "YouTube URL"], ["tiktokUrl", "TikTok URL"], ["instagramUrl", "Instagram URL"], ["flightSearchUrl", "Trang tìm vé máy bay"],
];
export default function SiteSettingsForm({ settings }: { settings: Settings }) {
  const [form, setForm] = useState(settings); const [message, setMessage] = useState(""); const [saving, setSaving] = useState(false);
  return <form onSubmit={async (event) => { event.preventDefault(); setSaving(true); setMessage(""); const response = await fetch("/api/cms/settings", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) }); setMessage(response.ok ? "Đã lưu và cập nhật website." : "Không thể lưu cài đặt."); setSaving(false); }} className="grid gap-5 rounded-xl border border-slate-200 bg-white p-6 shadow-sm md:grid-cols-2">
    {FIELDS.map(([name, label]) => <div key={name} className={name === "description" ? "md:col-span-2" : ""}><label className="mb-2 block text-sm font-semibold text-slate-700" htmlFor={name}>{label}</label>{name === "description" ? <textarea id={name} rows={3} value={form[name] || ""} onChange={(event) => setForm({ ...form, [name]: event.target.value })} className="w-full rounded-lg border border-slate-300 px-4 py-2.5 text-sm outline-none focus:border-[#2576ae]" /> : <input id={name} type={name === "email" ? "email" : name.toLowerCase().includes("url") ? "url" : "text"} value={form[name] || ""} onChange={(event) => setForm({ ...form, [name]: event.target.value })} className="w-full rounded-lg border border-slate-300 px-4 py-2.5 text-sm outline-none focus:border-[#2576ae]" />}</div>)}
    <div className="flex items-center gap-4 md:col-span-2"><button disabled={saving} className="rounded-lg bg-[#175b8f] px-5 py-3 text-sm font-bold text-white hover:bg-[#2576ae] disabled:opacity-60">{saving ? "Đang lưu..." : "Lưu cài đặt"}</button>{message && <p className="text-sm font-semibold text-emerald-700">{message}</p>}</div>
  </form>;
}
