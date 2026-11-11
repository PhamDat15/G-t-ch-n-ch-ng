import { createHmac, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";
import { prisma } from "@/lib/db";

export const ADMIN_COOKIE_NAME = "vietnam_travel_admin_session";
const SESSION_SECRET = process.env.ADMIN_SESSION_SECRET || "vietnam-travel-admin-session-v2";

export interface CurrentUser {
  id: string;
  username: string;
  fullName: string;
  role: "ADMIN" | "EDITOR" | "REPORTER";
}

// Danh sách tài khoản dự phòng nếu database chưa tạo bảng User
export const FALLBACK_USERS: Record<
  string,
  { pass: string; fullName: string; role: "ADMIN" | "EDITOR" | "REPORTER" }
> = {
  admin: { pass: "admin", fullName: "Trưởng Mục (Ban Biên Tập)", role: "ADMIN" },
  phamdat: { pass: "dat738@", fullName: "Phạm Đạt", role: "ADMIN" },
  huy: { pass: "huy829@", fullName: "Huy", role: "REPORTER" },
  duyanh: { pass: "duy641@", fullName: "Nguyễn DuyAnh", role: "REPORTER" },
  phuonglinh: { pass: "linh291@", fullName: "Phương Linhh", role: "REPORTER" },
  halinh: { pass: "linh402@", fullName: "Hà Linh", role: "REPORTER" },
  quynhhuong: { pass: "huong517@", fullName: "Đỗ Quỳnh Hương", role: "REPORTER" },
  thuytrang: { pass: "trang831@", fullName: "Thuỳ Trang", role: "REPORTER" },
  haiyen: { pass: "yen940@", fullName: "Duong Hai Yen", role: "REPORTER" },
  phuongthao: { pass: "thao115@", fullName: "Phuong Thao", role: "REPORTER" },
  viethoang: { pass: "hoang728@", fullName: "Trần Việt Hoàng", role: "REPORTER" },
  linhhoang: { pass: "linh338@", fullName: "Linh Hoang", role: "REPORTER" },
  hoanglinh: { pass: "linh559@", fullName: "Le Hoang Linh", role: "REPORTER" },
  thihanh: { pass: "hanh672@", fullName: "Nguyễn T. Hạnh", role: "REPORTER" },
};

function safeEqual(left: string, right: string) {
  const leftBuffer = Buffer.from(left);
  const rightBuffer = Buffer.from(right);
  return leftBuffer.length === rightBuffer.length && timingSafeEqual(leftBuffer, rightBuffer);
}

export function createSessionToken(user: { id: string; username: string; role: string; fullName: string }) {
  const payload = Buffer.from(JSON.stringify(user)).toString("base64url");
  const signature = createHmac("sha256", SESSION_SECRET).update(payload).digest("base64url");
  return `${payload}.${signature}`;
}

export function verifySessionToken(token: string): CurrentUser | null {
  try {
    const [payload, signature] = token.split(".");
    if (!payload || !signature) return null;

    const expectedSignature = createHmac("sha256", SESSION_SECRET).update(payload).digest("base64url");
    if (!safeEqual(signature, expectedSignature)) return null;

    const decoded = JSON.parse(Buffer.from(payload, "base64url").toString("utf-8"));
    return decoded as CurrentUser;
  } catch {
    return null;
  }
}

// Xác thực đăng nhập (Hỗ trợ cả Database lẫn Fallback bộ nhớ để không bao giờ bị lỗi kết nối DB)
export async function authenticateUser(username: string, pass: string): Promise<CurrentUser | null> {
  const cleanUser = username.trim().toLowerCase();
  const cleanPass = pass.trim();

  // 1. Kiểm tra tài khoản trong danh sách dự phòng
  const fallback = FALLBACK_USERS[cleanUser];
  if (fallback && fallback.pass === cleanPass) {
    return {
      id: cleanUser,
      username: cleanUser,
      fullName: fallback.fullName,
      role: fallback.role,
    };
  }

  // 2. Nếu không khớp fallback, thử tìm trong database User
  try {
    const user = await prisma.user.findUnique({
      where: { username: cleanUser },
    });

    if (user && user.password === cleanPass) {
      return {
        id: user.id,
        username: user.username,
        fullName: user.fullName,
        role: user.role,
      };
    }
  } catch (dbError) {
    console.warn("Chưa đồng bộ bảng User trong Database, sử dụng xác thực dự phòng:", dbError);
  }

  return null;
}

export async function getCurrentUser(): Promise<CurrentUser | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(ADMIN_COOKIE_NAME)?.value;
  if (!token) return null;
  return verifySessionToken(token);
}

export async function isAdminAuthenticated(): Promise<boolean> {
  const user = await getCurrentUser();
  return Boolean(user);
}

export async function canApproveOrEditAll(): Promise<boolean> {
  const user = await getCurrentUser();
  if (!user) return false;
  return user.role === "ADMIN" || user.role === "EDITOR";
}

export const adminCookieOptions = {
  httpOnly: true,
  sameSite: "lax" as const,
  secure: process.env.NODE_ENV === "production",
  path: "/",
  maxAge: 60 * 60 * 24 * 7,
};
