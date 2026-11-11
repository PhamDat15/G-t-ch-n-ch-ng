import type { Metadata } from "next";
import { Merriweather } from "next/font/google";
import "./globals.css";

// Sử dụng Merriweather: font báo chí chuẩn quốc tế, x-height cao, các chữ đều tăm tắp, nét cân đối và tối ưu hoàn hảo cho tiếng Việt
const merriweather = Merriweather({
  weight: ["300", "400", "700", "900"],
  subsets: ["vietnamese", "latin"],
  variable: "--font-merriweather",
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
      className={`${merriweather.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col font-merriweather bg-[#fbfbf9] text-slate-900">
        {children}
      </body>
    </html>
  );
}
