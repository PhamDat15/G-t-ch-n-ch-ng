import { getSiteSettings } from "@/lib/site-settings";

const ROUTES = [
  { from: "Hà Nội", fromCode: "HAN", to: "Đà Nẵng", toCode: "DAD", price: "650.000đ" },
  { from: "TP. Hồ Chí Minh", fromCode: "SGN", to: "Phú Quốc", toCode: "PQC", price: "590.000đ" },
  { from: "Hà Nội", fromCode: "HAN", to: "Đà Lạt", toCode: "DLI", price: "790.000đ" },
  { from: "TP. Hồ Chí Minh", fromCode: "SGN", to: "Bangkok", toCode: "BKK", price: "1.250.000đ" },
];

export default async function HotFlightRoutes() {
  const settings = await getSiteSettings();
  return <section className="rounded-xl border border-sky-100 bg-[#f7fbff] p-5">
    <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#b46b2a]">Hành trình gợi ý</p><h3 className="mt-1 font-serif text-xl font-bold text-[#123b5d]">Chặng bay được quan tâm</h3><p className="mt-2 text-sm text-slate-500">Giá tham khảo, có thể thay đổi theo thời điểm tìm kiếm.</p>
    <div className="mt-4 space-y-2">{ROUTES.map((route) => {
      const href = `${settings.flightSearchUrl}?q=${encodeURIComponent(`${route.fromCode} ${route.toCode}`)}`;
      return <a key={`${route.fromCode}-${route.toCode}`} href={href} target="_blank" rel="noreferrer" className="group block rounded-lg border border-slate-200 bg-white p-3 transition hover:border-[#5c9bc5] hover:shadow-sm"><div className="flex items-center justify-between gap-3"><span className="text-sm font-bold text-slate-800 group-hover:text-[#175b8f]">{route.from} → {route.to}</span><span className="whitespace-nowrap text-sm font-bold text-[#2576ae]">từ {route.price}</span></div><p className="mt-1 text-xs text-slate-500">{route.fromCode} · {route.toCode} · Mở trang tìm chuyến bay ↗</p></a>;
    })}</div>
  </section>;
}
