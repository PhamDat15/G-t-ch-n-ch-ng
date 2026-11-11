import Link from "next/link";
import { redirect } from "next/navigation";
import AdminLoginForm from "@/components/AdminLoginForm";
import { isAdminAuthenticated } from "@/lib/admin-auth";

export default async function AdminLoginPage({ searchParams }: { searchParams: Promise<{ next?: string }> }) {
  const requestedDestination = (await searchParams).next || "/cms";
  const destination = requestedDestination.startsWith("/") && !requestedDestination.startsWith("//") ? requestedDestination : "/cms";
  if (await isAdminAuthenticated()) redirect(destination);

  return (
    <main 
      className="relative flex min-h-screen items-center justify-center overflow-hidden px-4 py-12"
      style={{
        backgroundImage: "radial-gradient(ellipse at 50% 30%, rgba(29, 78, 126, 0.45), transparent 75%), linear-gradient(180deg, #091724 0%, #0d2740 50%, #071524 100%)"
      }}
    >
      {/* Lớp ảnh nền cảnh quan núi sông vịnh Hạ Long tương tự Header */}
      <div 
        aria-hidden="true" 
        className="absolute inset-0 bg-cover bg-center opacity-30 mix-blend-screen pointer-events-none scale-105 transition duration-1000"
        style={{
          backgroundImage: "url('https://images.unsplash.com/photo-1528127269322-539801943592?auto=format&fit=crop&w=1920&q=80')"
        }}
      />

      {/* Lớp phủ mờ bảo vệ độ tương phản */}
      <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px] pointer-events-none" />

      {/* Card đăng nhập căn giữa sang trọng */}
      <div className="relative z-10 w-full max-w-md rounded-3xl border border-white/20 bg-white/95 p-8 sm:p-10 shadow-2xl backdrop-blur-xl text-center">
        {/* Logo & Tiêu đề căn giữa */}
        <p className="text-[11px] font-bold uppercase tracking-[0.24em] text-[#b46b2a]">
          TẠP CHÍ VIỆT NAM TRAVEL
        </p>
        <h1 className="mt-2 font-serif text-3xl sm:text-4xl font-black text-[#0d2238] tracking-tight">
          Đăng nhập quản trị
        </h1>
        <p className="mt-2 text-xs sm:text-sm leading-relaxed text-slate-500 max-w-xs mx-auto">
          Nhập tài khoản và mật khẩu để quản lý bài viết và vận hành tòa soạn.
        </p>

        {/* Form đăng nhập */}
        <div className="mt-6 text-left">
          <AdminLoginForm destination={destination} />
        </div>

        {/* Nút trở về căn giữa */}
        <div className="mt-6 border-t border-slate-100 pt-5">
          <Link 
            href="/" 
            className="inline-flex items-center gap-1.5 text-xs font-bold text-[#b46b2a] hover:text-[#8e511b] transition"
          >
            <span>← Trở về trang chủ</span>
          </Link>
        </div>
      </div>
    </main>
  );
}
