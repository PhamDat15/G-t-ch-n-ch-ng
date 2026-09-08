export default function TravelAdviceWidget() {
  return (
    <div className="border border-slate-200 bg-[#F8FAFC] p-4 rounded-sm shadow-xs space-y-3">
      <div className="border-b border-slate-200/80 pb-2">
        <span className="text-[10px] font-bold uppercase tracking-wider text-[#1A56DB] block">
          Cẩm Nang Thực Tế
        </span>
        <h4 className="text-xs font-bold uppercase tracking-wide text-[#0A2540] font-sans">
          Chỉ Số Xê Dịch Hôm Nay
        </h4>
      </div>

      <div className="space-y-2.5 text-xs">
        <div className="flex items-start space-x-2">
          <span className="text-[#1A56DB] font-bold mt-0.5">•</span>
          <div>
            <span className="font-bold text-slate-800">Chỉ số UV: Trung bình (4/10)</span>
            <p className="text-[11px] text-slate-600 mt-0.5 leading-relaxed">
              Thời tiết lý tưởng cho các hoạt động ngoài trời, chụp ảnh thiên nhiên và trekking cung đường đèo.
            </p>
          </div>
        </div>

        <div className="flex items-start space-x-2">
          <span className="text-[#1A56DB] font-bold mt-0.5">•</span>
          <div>
            <span className="font-bold text-slate-800">Gợi ý trang phục</span>
            <p className="text-[11px] text-slate-600 mt-0.5 leading-relaxed">
              Vùng cao (Sa Pa, Đà Lạt) đêm se lạnh 16–18°C, nên mang theo áo gió mỏng. Vùng biển miền Trung mang mũ rộng vành và kính râm.
            </p>
          </div>
        </div>
      </div>

      <div className="pt-2 border-t border-slate-200 text-center">
        <p className="text-[11px] italic text-slate-500 font-sans">
          "Đích đến không phải là một vùng đất mới, mà là một góc nhìn mới."
        </p>
      </div>
    </div>
  );
}
