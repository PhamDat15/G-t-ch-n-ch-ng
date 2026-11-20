import Link from "next/link";
import { getSiteSettings } from "@/lib/site-settings";

export default async function Footer() {
  const settings = await getSiteSettings();
  const socialLinks = [
    ["Facebook", settings.facebookUrl],
    ["YouTube", settings.youtubeUrl],
    ["TikTok", settings.tiktokUrl],
    ["Instagram", settings.instagramUrl],
  ].filter((item): item is [string, string] => Boolean(item[1]));

  return (
    <footer className="mt-16 border-t-2 border-[#d49a37] bg-[#0c1f33] text-slate-300">
      <div className="mx-auto max-w-7xl px-4 py-12">
        <div className="grid gap-10 border-b border-white/10 pb-10 md:grid-cols-3">
          <div>
            <p className="font-serif text-2xl md:text-3xl font-black text-[#fbf7ee]">{settings.siteName}</p>
            <p className="mt-4 max-w-sm text-sm leading-6 text-slate-300/80">{settings.description}</p>
          </div>
          <div className="text-sm leading-7">
            <h3 className="mb-3 font-bold uppercase tracking-wider text-[#d49a37]">Thông tin tòa soạn</h3>
            <p className="text-slate-300">Tổng biên tập: <span className="font-medium text-white">{settings.editor}</span></p>
            <p className="text-slate-300">Địa chỉ: {settings.address}</p>
            <p className="text-slate-300">Điện thoại: {settings.phone}</p>
            <p className="text-slate-300">
              Email:{" "}
              <a className="text-[#d49a37] hover:underline" href={`mailto:${settings.email}`}>
                {settings.email}
              </a>
            </p>
          </div>
          <div>
            <h3 className="mb-3 font-bold uppercase tracking-wider text-[#d49a37]">Kết nối với chúng tôi</h3>
            {socialLinks.length ? (
              <div className="flex flex-wrap gap-2">
                {socialLinks.map(([label, url]) => (
                  <a
                    key={label}
                    href={url}
                    target="_blank"
                    rel="noreferrer"
                    className="rounded-full border border-white/15 bg-white/5 px-4 py-1.5 text-xs font-semibold text-slate-200 transition hover:border-[#d49a37] hover:bg-[#d49a37] hover:text-slate-950"
                  >
                    {label}
                  </a>
                ))}
              </div>
            ) : (
              <p className="text-sm text-slate-400">Các kênh mạng xã hội sẽ được cập nhật từ hệ thống quản trị.</p>
            )}
            <div className="mt-5 flex gap-4 text-sm text-slate-300">
              <Link href="/" className="hover:text-[#d49a37] transition">Giới thiệu</Link>
              <Link href="/" className="hover:text-[#d49a37] transition">Liên hệ</Link>
              <Link href="/" className="hover:text-[#d49a37] transition">Chính sách</Link>
            </div>
          </div>
        </div>
        <div className="flex flex-col justify-between gap-2 pt-6 text-xs text-slate-400 md:flex-row">
          <p>© 2026 {settings.siteName}. Toàn bộ bản quyền được bảo lưu.</p>
          <p>Tạp chí điện tử về du lịch, văn hóa và di sản Việt Nam.</p>
        </div>
      </div>
    </footer>
  );
}
