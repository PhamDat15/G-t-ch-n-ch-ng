import { NextRequest, NextResponse } from "next/server";
import { authenticateUser, createSessionToken, adminCookieOptions, ADMIN_COOKIE_NAME } from "@/lib/admin-auth";

export async function POST(req: NextRequest) {
  try {
    const { username, password } = await req.json();

    if (!username || !password) {
      return NextResponse.json(
        { error: "Vui lòng nhập tên đăng nhập và mật khẩu." },
        { status: 400 }
      );
    }

    const user = await authenticateUser(username, password);

    if (!user) {
      return NextResponse.json(
        { error: "Tên đăng nhập hoặc mật khẩu không chính xác." },
        { status: 401 }
      );
    }

    const token = createSessionToken(user);
    const response = NextResponse.json({
      success: true,
      user: {
        username: user.username,
        fullName: user.fullName,
        role: user.role,
      },
      message: "Đăng nhập thành công!",
    });

    response.cookies.set(ADMIN_COOKIE_NAME, token, adminCookieOptions);
    return response;
  } catch (error) {
    console.error("Lỗi đăng nhập:", error);
    return NextResponse.json(
      { error: "Đã xảy ra lỗi máy chủ khi đăng nhập." },
      { status: 500 }
    );
  }
}
