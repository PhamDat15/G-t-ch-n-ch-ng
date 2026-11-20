import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

// Sử dụng Inter: font không chân (Sans-serif) chuẩn quốc tế, tối ưu tuyệt vời cho tiếng Việt, hiện đại và sắc nét
const inter = Inter({
  weight: ["300", "400", "500", "600", "700", "800", "900"],
  subsets: ["vietnamese", "latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Tạp chí Việt Nam Travel",
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
      className={`${inter.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col font-sans bg-[#fbfbf9] text-slate-900">
        {children}
      </body>
    </html>
  );
}
