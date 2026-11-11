import SiteSettingsForm from "@/components/SiteSettingsForm";
import { getSiteSettings } from "@/lib/site-settings";
export default async function SettingsPage() { const settings = await getSiteSettings(); return <div><p className="text-sm font-bold uppercase tracking-wider text-[#b46b2a]">Hệ thống</p><h1 className="font-serif text-3xl font-black text-[#123b5d]">Cài đặt website</h1><p className="mb-6 mt-2 text-sm text-slate-500">Tên, slogan, thông tin tòa soạn, mạng xã hội và liên kết dịch vụ.</p><SiteSettingsForm settings={settings as unknown as Record<string, string | null>} /></div>; }
