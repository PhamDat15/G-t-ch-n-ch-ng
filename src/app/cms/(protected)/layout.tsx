import Link from "next/link";
import { redirect } from "next/navigation";
import AdminLogoutButton from "@/components/AdminLogoutButton";
import { getCurrentUser } from "@/lib/admin-auth";

export const dynamic = "force-dynamic";

export default async function CmsLayout({ children }: { children: React.ReactNode }) {
  const currentUser = await getCurrentUser();
  if (!currentUser) redirect("/cms/dang-nhap?next=/cms");

  const isLeader = currentUser.role === "ADMIN" || currentUser.role === "EDITOR";

  // Phân chia menu theo vai trò
  const items = isLeader
    ? [
        ["Tổng quan", "/cms"],
        ["Quản lý bài viết", "/cms/bai-viet"],
        ["Thêm bài mới", "/cms/them-bai"],
        ["Danh sách phóng viên", "/cms/phong-vien"],
        ["Bình luận", "/cms/binh-luan"],
        ["Cài đặt website", "/cms/cai-dat"],
      ]
    : [
        ["Bài viết của tôi", "/cms/bai-viet"],
        ["Thêm bài mới", "/cms/them-bai"],
      ];

  return (
    <div className="min-h-screen bg-slate-100 md:flex">
      <aside className="flex w-full flex-col bg-[#0c1f33] p-5 text-white md:min-h-screen md:w-64 md:fixed">
        <Link href="/cms" className="font-serif text-xl font-black text-amber-300">
          Việt Nam Travel
        </Link>
        <p className="mt-1 text-xs text-slate-400">CMS Tòa Soạn Báo</p>

        {/* Thông tin người dùng đăng nhập */}
        <div className="mt-4 rounded-lg bg-white/10 p-3 text-xs">
          <p className="font-bold text-white">{currentUser.fullName}</p>
          <div className="mt-1 flex items-center gap-1.5">
            <span
              className={`rounded px-1.5 py-0.5 text-[10px] font-bold uppercase ${
                currentUser.role === "ADMIN"
                  ? "bg-amber-400 text-slate-950"
                  : currentUser.role === "EDITOR"
                  ? "bg-sky-400 text-slate-950"
                  : "bg-emerald-500 text-white"
              }`}
            >
              {currentUser.role === "ADMIN"
                ? "Ban Biên Tập"
                : currentUser.role === "EDITOR"
                ? "Trưởng Mục"
                : "Phóng Viên"}
            </span>
            <span className="text-slate-400 font-mono">@{currentUser.username}</span>
          </div>
        </div>

        <nav className="mt-6 flex flex-1 gap-2 overflow-x-auto md:flex-col">
          {items.map(([label, href]) => (
            <Link
              key={href}
              href={href}
              className="whitespace-nowrap rounded-lg px-3 py-2.5 text-sm font-semibold text-slate-300 hover:bg-white/10 hover:text-white transition"
            >
              {label}
            </Link>
          ))}
        </nav>

        <div className="mt-6 space-y-2 border-t border-white/10 pt-4">
          <a
            href="/"
            target="_blank"
            className="block rounded-lg border border-white/20 px-3 py-2 text-center text-xs font-semibold text-slate-300 hover:bg-white/10 hover:text-white"
          >
            Xem website độc giả ↗
          </a>
          <AdminLogoutButton />
        </div>
      </aside>

      <main className="min-w-0 flex-1 p-5 md:ml-64 md:p-8">{children}</main>
    </div>
  );
}
