import Link from "next/link";
import { redirect } from "next/navigation";
import AdminLogoutButton from "@/components/AdminLogoutButton";
import { isAdminAuthenticated } from "@/lib/admin-auth";

export const dynamic = "force-dynamic";

export default async function CmsLayout({ children }: { children: React.ReactNode }) {
  if (!(await isAdminAuthenticated())) redirect("/cms/dang-nhap?next=/cms");
  const items = [["Tổng quan", "/cms"], ["Bài viết", "/cms/bai-viet"], ["Thêm bài mới", "/cms/them-bai"], ["Bình luận", "/cms/binh-luan"], ["Cài đặt website", "/cms/cai-dat"]];
  return <div className="min-h-screen bg-slate-100 md:flex"><aside className="flex w-full flex-col bg-[#123b5d] p-5 text-white md:min-h-screen md:w-64 md:fixed"><Link href="/cms" className="font-serif text-xl font-black">Việt Nam Travel</Link><p className="mt-1 text-xs text-sky-200">CMS Tòa soạn</p><nav className="mt-8 flex flex-1 gap-2 overflow-x-auto md:flex-col">{items.map(([label, href]) => <Link key={href} href={href} className="whitespace-nowrap rounded-lg px-3 py-2.5 text-sm font-semibold text-slate-200 hover:bg-white/10 hover:text-white">{label}</Link>)}</nav><div className="mt-6"><a href="/" target="_blank" className="block rounded-lg border border-slate-600 px-3 py-2 text-sm text-slate-200 hover:bg-white/10">Xem website ↗</a><AdminLogoutButton /></div></aside><main className="min-w-0 flex-1 p-5 md:ml-64 md:p-8">{children}</main></div>;
}
