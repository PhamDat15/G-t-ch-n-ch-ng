import { NextRequest, NextResponse } from "next/server";

export function middleware(request: NextRequest) {
  const hostname = request.headers.get("host") || "";
  const { pathname } = request.nextUrl;

  // Kiểm tra xem request có đến từ domain CMS (ví dụ: cms-..., cms...., admin-..., admin....) hay không
  const isCmsSubdomain =
    hostname.startsWith("cms.") ||
    hostname.startsWith("cms-") ||
    hostname.startsWith("admin.") ||
    hostname.startsWith("admin-");

  if (isCmsSubdomain) {
    // 1. Nếu đang ở subdomain CMS mà truy cập trang chủ (/), tự động rewrite ngầm vào /cms
    if (pathname === "/") {
      return NextResponse.rewrite(new URL("/cms", request.url));
    }

    // 2. Nếu đường dẫn chưa bắt đầu bằng /cms hoặc /api/cms, rewrite ngầm thêm tiền tố /cms
    if (!pathname.startsWith("/cms") && !pathname.startsWith("/api")) {
      return NextResponse.rewrite(new URL(`/cms${pathname}`, request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Bỏ qua các file tĩnh, hình ảnh, favicon và _next
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};

