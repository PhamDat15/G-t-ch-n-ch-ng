import { prisma } from "@/lib/db";

export const DEFAULT_SITE_SETTINGS = {
  id: "main",
  siteName: "Tạp chí Việt Nam Travel",
  slogan: "Chạm tinh hoa, thưởng di sản",
  description: "Tạp chí điện tử về du lịch, văn hóa và di sản Việt Nam",
  editor: "Ban Biên tập Việt Nam Travel",
  address: "Hà Nội, Việt Nam",
  phone: "0988.123.456",
  email: "toasoan@vietnamtravel.vn",
  facebookUrl: null,
  youtubeUrl: null,
  tiktokUrl: null,
  instagramUrl: null,
  flightSearchUrl: "https://www.google.com/travel/flights",
};

export async function getSiteSettings() {
  try {
    return (await prisma.siteSettings.findUnique({ where: { id: "main" } })) ?? {
      ...DEFAULT_SITE_SETTINGS,
      updatedAt: new Date(0),
    };
  } catch (error) {
    // Keep the public site available while an existing database is waiting for
    // the new SiteSettings table to be applied.
    console.warn(
      "SiteSettings is unavailable; using the built-in defaults.",
      error instanceof Error ? error.message : error,
    );
    return {
      ...DEFAULT_SITE_SETTINGS,
      updatedAt: new Date(0),
    };
  }
}
