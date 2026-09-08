import Link from "next/link";
import { CATEGORIES } from "@/lib/constants";

export default function Footer() {
  return (
    <footer className="w-full bg-[#0A2540] text-slate-300 pt-12 pb-8 mt-16 border-t-4 border-[#1A56DB]">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-10 border-b border-slate-700/60">
          {/* Cột 1: Giới thiệu thương hiệu */}
          <div className="md:col-span-1">
            <span className="text-2xl font-extrabold text-white font-serif tracking-tight uppercase">
              GẠT CHÂN CHỐNG
            </span>
            <p className="text-xs text-sky-400 font-semibold tracking-widest mt-1 mb-4">
              TẠP CHÍ ĐIỆN TỬ DU LỊCH & ĐỜI SỐNG
            </p>
            <p className="text-xs text-slate-400 leading-relaxed">
              Cơ quan thông tin chuyên sâu về Văn hóa, Lưu trú, Điểm đến, Ẩm thực và Con người Việt Nam. Đem đến những hành trình chân thực và truyền cảm hứng xê dịch bất tận.
            </p>
          </div>

          {/* Cột 2: 7 Chuyên mục */}
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-white mb-4 border-b border-[#1A56DB] pb-1 inline-block">
              Chuyên mục
            </h3>
            <ul className="space-y-2 text-xs">
              {CATEGORIES.map((cat) => (
                <li key={cat.slug}>
                  <Link
                    href={`/chuyen-muc/${cat.slug}`}
                    className="hover:text-white transition flex items-center space-x-1"
                  >
                    <span className="text-sky-400">—</span>
                    <span>{cat.name}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Cột 3: Quản lý & Tiện ích */}
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-white mb-4 border-b border-[#1A56DB] pb-1 inline-block">
              Tòa soạn & Quản trị
            </h3>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/admin/import" className="text-sky-300 hover:text-white transition">
                  • Nhập bài viết tự động từ file Word (.docx)
                </Link>
              </li>
              <li>
                <Link href="/admin" className="hover:text-white transition">
                  • Bảng điều khiển Admin CMS
                </Link>
              </li>
              <li>
                <span className="text-slate-400">• Quy chuẩn đăng bài & Bản quyền hình ảnh</span>
              </li>
              <li>
                <span className="text-slate-400">• Liên hệ phát hành & Hợp tác truyền thông</span>
              </li>
            </ul>
          </div>

          {/* Cột 4: Giấy phép & Tòa soạn */}
          <div className="text-xs text-slate-400 space-y-2">
            <h3 className="text-sm font-bold uppercase tracking-wider text-white mb-4 border-b border-[#1A56DB] pb-1 inline-block">
              Thông tin tòa soạn
            </h3>
            <p>Tổng biên tập: Hội đồng Biên tập Gạt Chân Chống</p>
            <p>Tòa soạn: Tầng 6, Tòa nhà Báo chí, Hà Nội & TP. Hồ Chí Minh</p>
            <p>Đường dây nóng: 0988.123.456</p>
            <p>Email: toasoan@gatchanchong.vn</p>
          </div>
        </div>

        <div className="pt-6 flex flex-col md:flex-row items-center justify-between text-xs text-slate-500">
          <p>© 2026 Tạp chí Gạt Chân Chống. Toàn bộ bản quyền nội dung và hình ảnh được bảo lưu.</p>
          <p className="mt-2 md:mt-0">Thiết kế chuẩn báo chí hiện đại • Hệ thống tự động nén ảnh chất lượng cao</p>
        </div>
      </div>
    </footer>
  );
}
