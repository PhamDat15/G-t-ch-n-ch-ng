"use client";

import { useRouter } from "next/navigation";

export default function AdminLogoutButton() {
  const router = useRouter();
  return <button className="mt-2 w-full rounded-lg border border-slate-600 px-3 py-2 text-left text-sm text-slate-200 hover:bg-white/10" onClick={async () => { await fetch("/api/cms/logout", { method: "POST" }); router.replace("/"); router.refresh(); }}>Đăng xuất</button>;
}
