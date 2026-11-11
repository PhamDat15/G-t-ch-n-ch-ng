"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLoginForm({ destination }: { destination: string }) {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  return (
    <form
      className="mt-7 space-y-5"
      onSubmit={async (event) => {
        event.preventDefault();
        setLoading(true);
        setError("");
        try {
          const response = await fetch("/api/cms/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ username, password }),
          });
          const data = await response.json();
          if (!response.ok) throw new Error(data.error || "Không thể đăng nhập");
          router.replace(destination);
          router.refresh();
        } catch (loginError) {
          setError(loginError instanceof Error ? loginError.message : "Không thể đăng nhập");
        } finally {
          setLoading(false);
        }
      }}
    >
      <div>
        <label htmlFor="admin-username" className="mb-2 block text-sm font-bold text-slate-700">Tài khoản</label>
        <input id="admin-username" autoComplete="username" value={username} onChange={(event) => setUsername(event.target.value)} className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-[#2576ae]" required />
      </div>
      <div>
        <label htmlFor="admin-password" className="mb-2 block text-sm font-bold text-slate-700">Mật khẩu</label>
        <input id="admin-password" type="password" autoComplete="current-password" value={password} onChange={(event) => setPassword(event.target.value)} className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-[#2576ae]" required />
      </div>
      {error && <p className="rounded-lg border border-rose-200 bg-rose-50 p-3 text-sm text-rose-700">{error}</p>}
      <button disabled={loading} className="w-full rounded-lg bg-[#123b5d] px-5 py-3 font-bold text-white transition hover:bg-[#2576ae] disabled:opacity-60">{loading ? "Đang đăng nhập..." : "Đăng nhập quản trị"}</button>
    </form>
  );
}
