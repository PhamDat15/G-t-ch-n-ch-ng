import type { Metadata } from "next";
import { Merriweather, Be_Vietnam_Pro } from "next/font/google";
import "./globals.css";

// Font tiếng Việt chuyên cho báo chí, hỗ trợ đầy đủ 100% dấu tiếng Việt không bao giờ bị lỗi ô vuông / lỗi dấu
const beVietnamPro = Be_Vietnam_Pro({
  weight: ["300", "400", "500", "600", "700", "800"],
  subsets: ["vietnamese", "latin"],
  variable: "--font-sans",
  display: "swap",
});

const merriweather = Merriweather({
  weight: ["300", "400", "700", "900"],
  subsets: ["vietnamese", "latin"],
  variable: "--font-serif",
  display: "swap",
});

export const metadata: Metadata = {
  title: "GẠT CHÂN CHỐNG - Tạp chí Du lịch, Khám phá & Trải nghiệm sống",
  description: "Trang thông tin báo điện tử chuyên sâu về Văn hóa, Lưu trú, Điểm đến, Ẩm thực và Con người Việt Nam.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="vi"
      className={`${beVietnamPro.variable} ${merriweather.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col font-sans bg-white text-slate-900">
        {children}
      </body>
    </html>
  );
}
