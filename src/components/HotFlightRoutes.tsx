import Link from "next/link";

interface FlightRoute {
  id: string;
  from: string;
  to: string;
  price: string;
  airline: string;
  highlight: string;
  trend: "HOT" | "GIẢM 20%" | "PHỔ BIẾN";
}

const HOT_ROUTES: FlightRoute[] = [
  {
    id: "1",
    from: "Hà Nội (HAN)",
    to: "Đà Nẵng (DAD)",
    price: "650.000đ",
    airline: "Vietnam Airlines / Vietjet",
    highlight: "Cung đường biển & phố cổ Hội An",
    trend: "HOT",
  },
  {
    id: "2",
    from: "TP. Hồ Chí Minh (SGN)",
    to: "Phú Quốc (PQC)",
    price: "590.000đ",
    airline: "Bamboo / Vietjet",
    highlight: "Mùa biển êm & hoàng hôn Bãi Trường",
    trend: "GIẢM 20%",
  },
  {
    id: "3",
    from: "Hà Nội (HAN)",
    to: "Đà Lạt (DLI)",
    price: "790.000đ",
    airline: "Vietjet Air",
    highlight: "Mùa săn mây đồi chè & hoa dã quỳ",
    trend: "HOT",
  },
  {
    id: "4",
    from: "TP. Hồ Chí Minh (SGN)",
    to: "Bangkok (BKK)",
    price: "1.250.000đ",
    airline: "AirAsia / Vietravel",
    highlight: "Khám phá ẩm thực & chợ đêm Thái Lan",
    trend: "PHỔ BIẾN",
  },
  {
    id: "5",
    from: "Hà Nội (HAN)",
    to: "Tokyo (NRT)",
    price: "4.850.000đ",
    airline: "Vietnam Airlines / ANA",
    highlight: "Mùa lá đỏ & ngắm núi Phú Sĩ",
    trend: "HOT",
  },
];

export default function HotFlightRoutes() {
  return (
    <div className="border border-slate-200 bg-white p-4.5 rounded-sm shadow-xs space-y-4">
      {/* Tiêu đề Box theo phong cách báo chí thanh lịch */}
      <div className="border-b-2 border-[#1A56DB] pb-2 flex items-center justify-between">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#1A56DB] block">
            Dữ Liệu Du Lịch 24/7
          </span>
          <h3 className="text-sm font-extrabold uppercase tracking-wide text-[#0A2540] font-sans">
            Chặng Bay & Vé Giá Tốt
          </h3>
        </div>
        <span className="text-[10px] bg-amber-50 text-amber-800 font-bold px-2 py-0.5 rounded border border-amber-200">
          CẬP NHẬT HÔM NAY
        </span>
      </div>

      <p className="text-xs text-slate-500 leading-relaxed">
        Bảng giá vé tham khảo các chặng bay du lịch được tìm kiếm nhiều nhất tuần này:
      </p>

      {/* Danh sách các chặng bay */}
      <div className="space-y-3">
        {HOT_ROUTES.map((route) => (
          <div
            key={route.id}
            className="p-3 bg-[#F8FAFC] border border-slate-200 hover:border-[#1A56DB] hover:bg-sky-50/40 transition rounded-xs group"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-900 group-hover:text-[#1A56DB] transition">
                {route.from} ⇄ {route.to}
              </span>
              <span
                className={`text-[9px] font-extrabold px-1.5 py-0.5 rounded uppercase tracking-wider ${
                  route.trend === "HOT"
                    ? "bg-rose-100 text-rose-700"
                    : route.trend === "GIẢM 20%"
                    ? "bg-emerald-100 text-emerald-800"
                    : "bg-blue-100 text-[#1A56DB]"
                }`}
              >
                {route.trend}
              </span>
            </div>

            <p className="text-[11px] text-slate-500 mt-1 line-clamp-1">{route.highlight}</p>

            <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-200/70 text-xs">
              <span className="text-[11px] text-slate-400">{route.airline}</span>
              <div className="text-right">
                <span className="text-[10px] text-slate-400 mr-1">Chỉ từ:</span>
                <span className="font-mono font-bold text-[#1A56DB] text-sm">{route.price}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Gợi ý lên lịch trình */}
      <div className="pt-2">
        <Link
          href="/chuyen-muc/kinh-nghiem"
          className="block text-center w-full bg-[#0A2540] hover:bg-[#1A56DB] text-white text-xs font-bold uppercase tracking-wider py-2.5 transition rounded-xs"
        >
          Xem Cẩm Nang Lịch Trình & Săn Vé »
        </Link>
      </div>
    </div>
  );
}
