import Link from "next/link";
import { redirect } from "next/navigation";
import AdminLoginForm from "@/components/AdminLoginForm";
import { isAdminAuthenticated } from "@/lib/admin-auth";

export default async function AdminLoginPage({ searchParams }: { searchParams: Promise<{ next?: string }> }) {
  const requestedDestination = (await searchParams).next || "/cms";
  const destination = requestedDestination.startsWith("/") && !requestedDestination.startsWith("//") ? requestedDestination : "/cms";
  if (await isAdminAuthenticated()) redirect(destination);

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#edf4f8] px-4 py-10">
      <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-8 shadow-xl">
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#b46b2a]">Tạp chí Việt Nam Travel</p>
        <h1 className="mt-2 font-serif text-3xl font-black text-[#123b5d]">Đăng nhập quản trị</h1>
        <p className="mt-2 text-sm leading-6 text-slate-500">Nhập tài khoản và mật khẩu để quản lý hoặc thêm bài viết.</p>
        <AdminLoginForm destination={destination} />
        <Link href="/" className="mt-6 block text-center text-sm font-semibold text-[#2576ae] hover:underline">← Trở về trang chủ</Link>
      </div>
    </main>
  );
}
