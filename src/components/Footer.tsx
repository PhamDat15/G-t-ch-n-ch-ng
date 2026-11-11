import Link from "next/link";
import { getSiteSettings } from "@/lib/site-settings";

export default async function Footer() {
  const settings = await getSiteSettings();
  const socialLinks = [["Facebook", settings.facebookUrl], ["YouTube", settings.youtubeUrl], ["TikTok", settings.tiktokUrl], ["Instagram", settings.instagramUrl]].filter((item): item is [string, string] => Boolean(item[1]));
  return (
    <footer className="mt-16 border-t-4 border-[#d3843b] bg-[#f4f8fb] text-slate-700">
      <div className="mx-auto max-w-7xl px-4 py-12">
        <div className="grid gap-10 border-b border-slate-300 pb-10 md:grid-cols-3">
          <div>
            <p className="font-serif text-2xl font-black text-[#123b5d]">{settings.siteName}</p>
            <p className="mt-1 text-sm font-semibold tracking-wide text-[#b46b2a]">{settings.slogan}</p>
            <p className="mt-4 max-w-sm text-sm leading-6 text-slate-600">{settings.description}</p>
          </div>
          <div className="text-sm leading-7">
            <h3 className="mb-3 font-bold uppercase tracking-wider text-[#123b5d]">Thông tin tòa soạn</h3>
            <p>Tổng biên tập: {settings.editor}</p><p>Địa chỉ: {settings.address}</p><p>Điện thoại: {settings.phone}</p>
            <p>Email: <a className="text-[#2576ae] hover:underline" href={`mailto:${settings.email}`}>{settings.email}</a></p>
          </div>
          <div>
            <h3 className="mb-3 font-bold uppercase tracking-wider text-[#123b5d]">Kết nối với chúng tôi</h3>
            {socialLinks.length ? <div className="flex flex-wrap gap-2">{socialLinks.map(([label, url]) => <a key={label} href={url} target="_blank" rel="noreferrer" className="rounded-full border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-[#175b8f] hover:border-[#2576ae]">{label}</a>)}</div> : <p className="text-sm text-slate-500">Các kênh mạng xã hội sẽ được cập nhật từ hệ thống quản trị.</p>}
            <div className="mt-5 flex gap-4 text-sm"><Link href="/" className="hover:text-[#2576ae]">Giới thiệu</Link><Link href="/" className="hover:text-[#2576ae]">Liên hệ</Link><Link href="/" className="hover:text-[#2576ae]">Chính sách</Link></div>
          </div>
        </div>
        <div className="flex flex-col justify-between gap-2 pt-6 text-xs text-slate-500 md:flex-row"><p>© 2026 {settings.siteName}. Toàn bộ bản quyền được bảo lưu.</p><p>Nội dung về du lịch, văn hóa và di sản Việt Nam.</p></div>
      </div>
    </footer>
  );
}
