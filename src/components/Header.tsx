import { getSiteSettings } from "@/lib/site-settings";
import HeaderClient from "@/components/HeaderClient";

export default async function Header({ currentCategory = "" }: { currentCategory?: string }) {
  const settings = await getSiteSettings();
  return <HeaderClient currentCategory={currentCategory} siteName={settings.siteName} slogan={settings.slogan} />;
}
