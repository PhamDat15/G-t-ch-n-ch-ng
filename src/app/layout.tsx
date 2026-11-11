import type { Metadata } from "next";
import { Playfair_Display } from "next/font/google";
import "./globals.css";

// Sử dụng Playfair Display: font chuẩn của logo "Việt Nam", nét dày đặn, serif thanh đậm rõ ràng và sắc nét
const playfair = Playfair_Display({
  weight: ["400", "500", "600", "700", "800", "900"],
  subsets: ["vietnamese", "latin"],
  variable: "--font-playfair",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Tạp chí Việt Nam Travel — Chạm tinh hoa, thưởng di sản",
    template: "%s | Việt Nam Travel",
  },
  description: "Tạp chí điện tử chuyên sâu về du lịch, văn hóa và di sản Việt Nam.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="vi"
      className={`${playfair.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col font-playfair bg-[#fbfbf9] text-slate-900">
        {children}
      </body>
    </html>
  );
}
