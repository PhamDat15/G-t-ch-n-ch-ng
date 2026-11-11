"use client";

import { useState } from "react";

export default function AdminLogoutButton() {
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await fetch("/api/cms/logout", { method: "POST" });
    } catch (err) {
      console.warn("Lỗi gọi logout API:", err);
    }
    // Chuyển hướng cứng về trang đăng nhập để xóa sạch state và cookie
    window.location.href = "/cms/dang-nhap";
  };

  return (
    <button
      type="button"
      disabled={isLoggingOut}
      onClick={handleLogout}
      className="mt-2 flex w-full items-center justify-center gap-2 rounded-lg border border-red-400/30 bg-red-500/10 px-3 py-2 text-center text-xs font-bold text-red-200 transition hover:bg-red-500 hover:text-white cursor-pointer disabled:opacity-50"
    >
      <svg className="h-3.5 w-3.5 fill-none stroke-current stroke-2" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
      </svg>
      {isLoggingOut ? "Đang đăng xuất..." : "Đăng xuất"}
    </button>
  );
}
