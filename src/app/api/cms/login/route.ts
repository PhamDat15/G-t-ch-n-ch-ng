import { NextResponse } from "next/server";
import { ADMIN_COOKIE_NAME, adminCookieOptions, createAdminSessionToken, verifyAdminCredentials } from "@/lib/admin-auth";

export async function POST(request: Request) {
  const body = await request.json();
  const username = String(body.username || "");
  const password = String(body.password || "");
  if (!verifyAdminCredentials(username, password)) {
    return NextResponse.json({ error: "Tài khoản hoặc mật khẩu không đúng" }, { status: 401 });
  }
  const response = NextResponse.json({ success: true });
  response.cookies.set(ADMIN_COOKIE_NAME, createAdminSessionToken(), adminCookieOptions);
  return response;
}
