import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { revalidatePath } from "next/cache";

export async function PUT(request: Request) {
  const body = await request.json();
  const clean = (name: string, fallback = "") => String(body[name] ?? fallback).trim();
  const data = { siteName: clean("siteName"), slogan: clean("slogan"), description: clean("description"), editor: clean("editor"), address: clean("address"), phone: clean("phone"), email: clean("email"), facebookUrl: clean("facebookUrl") || null, youtubeUrl: clean("youtubeUrl") || null, tiktokUrl: clean("tiktokUrl") || null, instagramUrl: clean("instagramUrl") || null, flightSearchUrl: clean("flightSearchUrl", "https://www.google.com/travel/flights") };
  if (!data.siteName || !data.slogan || !data.email) return NextResponse.json({ error: "Thiếu trường bắt buộc" }, { status: 400 });
  try {
    const settings = await prisma.siteSettings.upsert({ where: { id: "main" }, update: data, create: { id: "main", ...data } });
    revalidatePath("/", "layout");
    return NextResponse.json({ success: true, settings });
  } catch (error) {
    console.error("Unable to update SiteSettings.", error instanceof Error ? error.message : error);
    return NextResponse.json(
      { error: "Cơ sở dữ liệu chưa có bảng SiteSettings. Vui lòng cập nhật schema trước khi lưu cài đặt website." },
      { status: 503 },
    );
  }
}
