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
        <label htmlFor="admin-username" className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-700">
          Tên đăng nhập
        </label>
        <input 
          id="admin-username" 
          autoComplete="username" 
          value={username} 
          onChange={(event) => setUsername(event.target.value)} 
          placeholder="Nhập username của bạn..."
          className="w-full rounded-xl border border-slate-300 bg-white/80 px-4 py-3 text-sm text-slate-800 outline-none transition focus:border-[#d49a37] focus:ring-2 focus:ring-[#d49a37]/20 shadow-sm" 
          required 
        />
      </div>
      <div>
        <label htmlFor="admin-password" className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-700">
          Mật khẩu
        </label>
        <input 
          id="admin-password" 
          type="password" 
          autoComplete="current-password" 
          value={password} 
          onChange={(event) => setPassword(event.target.value)} 
          placeholder="••••••••"
          className="w-full rounded-xl border border-slate-300 bg-white/80 px-4 py-3 text-sm text-slate-800 outline-none transition focus:border-[#d49a37] focus:ring-2 focus:ring-[#d49a37]/20 shadow-sm font-mono" 
          required 
        />
      </div>
      {error && <p className="rounded-xl border border-rose-200 bg-rose-50 p-3 text-xs font-medium text-rose-700 text-center">{error}</p>}
      <button 
        disabled={loading} 
        className="w-full rounded-xl bg-[#0c1f33] px-5 py-3.5 text-sm font-bold text-white shadow-lg transition hover:bg-[#173a5e] disabled:opacity-60 cursor-pointer"
      >
        {loading ? "Đang xác thực..." : "Đăng nhập quản trị"}
      </button>
    </form>
  );
}
