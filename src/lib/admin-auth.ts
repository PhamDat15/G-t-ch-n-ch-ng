import { createHmac, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";

export const ADMIN_COOKIE_NAME = "vietnam_travel_admin_session";

const ADMIN_USERNAME = process.env.ADMIN_USERNAME || "admin";
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "admin";
const SESSION_SECRET = process.env.ADMIN_SESSION_SECRET || "vietnam-travel-admin-session-v1";
const SESSION_VALUE = "vietnam-travel-admin";

function safeEqual(left: string, right: string) {
  const leftBuffer = Buffer.from(left);
  const rightBuffer = Buffer.from(right);
  return leftBuffer.length === rightBuffer.length && timingSafeEqual(leftBuffer, rightBuffer);
}

export function verifyAdminCredentials(username: string, password: string) {
  return safeEqual(username, ADMIN_USERNAME) && safeEqual(password, ADMIN_PASSWORD);
}

export function createAdminSessionToken() {
  return createHmac("sha256", SESSION_SECRET).update(SESSION_VALUE).digest("hex");
}

export async function isAdminAuthenticated() {
  const token = (await cookies()).get(ADMIN_COOKIE_NAME)?.value;
  return Boolean(token && safeEqual(token, createAdminSessionToken()));
}

export const adminCookieOptions = {
  httpOnly: true,
  sameSite: "lax" as const,
  secure: process.env.NODE_ENV === "production",
  path: "/",
  maxAge: 60 * 60 * 8,
};
