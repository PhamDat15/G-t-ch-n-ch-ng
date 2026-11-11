import Header from "@/components/Header";
import Footer from "@/components/Footer";
import HotFlightRoutes from "@/components/HotFlightRoutes";
import VietnamWeatherWidget from "@/components/VietnamWeatherWidget";
import TravelAdviceWidget from "@/components/TravelAdviceWidget";
import Link from "next/link";
import Image from "next/image";
import { prisma } from "@/lib/db";

export const revalidate = 60;

const CARD_SELECT = {
  id: true, title: true, slug: true, sapo: true, thumbnail: true, author: true,
  isHero: true, isFeatured: true, viewCount: true, readingTime: true,
  publishedAt: true, category: true,
};

function ArticleImage({ article, className = "" }: { article: { thumbnail: string | null; title: string }; className?: string }) {
  return article.thumbnail ? <Image fill sizes="(max-width: 768px) 100vw, 50vw" src={article.thumbnail} alt={article.title} className={`object-cover transition duration-500 group-hover:scale-[1.03] ${className}`} /> : <div className="h-full w-full bg-gradient-to-br from-sky-50 to-slate-200" />;
}

export default async function HomePage() {
  const articles = await prisma.article.findMany({ take: 30, orderBy: { publishedAt: "desc" }, select: CARD_SELECT });
  const hero = articles.find((article) => article.isHero) ?? articles[0];
  const afterHero = articles.filter((article) => article.id !== hero?.id);
  const secondary = afterHero.slice(0, 3);
  const quickNews = afterHero.slice(3, 9);
  const featured = afterHero.filter((article) => article.isFeatured).slice(0, 3);
  const featureCards = featured.length >= 3 ? featured : afterHero.slice(0, 3);
  const usedIds = new Set([hero?.id, ...secondary.map((item) => item.id), ...quickNews.map((item) => item.id), ...featureCards.map((item) => item.id)]);
  const uniqueNewsStream = articles.filter((article) => !usedIds.has(article.id)).slice(0, 12);
  const newsStream = uniqueNewsStream.length >= 4 ? uniqueNewsStream : articles.filter((article) => article.id !== hero?.id).slice(0, 12);

  return <div className="min-h-screen bg-white text-slate-800">
    <Header />
    <main className="mx-auto max-w-7xl px-4 py-8">
      <section className="grid gap-8 border-b border-slate-200 pb-10 lg:grid-cols-12">
        <div className="space-y-6 lg:col-span-3">
          <div className="rounded-xl border border-amber-100 bg-[#fffaf4] p-5">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#b46b2a]">Dòng sự kiện</p>
            <p className="mt-2 text-sm font-medium leading-6 text-slate-700">Những hành trình chạm vào vẻ đẹp văn hóa, con người và di sản Việt Nam.</p>
          </div>
          <div>
            <div className="mb-4 flex items-center justify-between border-b border-slate-200 pb-2"><h2 className="font-serif text-xl font-bold text-[#123b5d]">Tin mới cập nhật</h2><span className="text-xs text-[#b46b2a]">24/7</span></div>
            <div className="divide-y divide-slate-100">{quickNews.map((article, index) => <article key={article.id} className="group flex gap-3 py-3"><span className="font-serif text-lg font-bold text-sky-300">{String(index + 1).padStart(2, "0")}</span><div><Link href={`/bai-viet/${article.slug}`} className="text-sm font-bold leading-5 text-slate-800 group-hover:text-[#2576ae]">{article.title}</Link><p className="mt-1 text-xs text-slate-500">{article.category.name} · {article.readingTime} phút đọc</p></div></article>)}</div>
          </div>
          <VietnamWeatherWidget />
          <TravelAdviceWidget />
        </div>

        <div className="lg:col-span-6">
          {hero && <article className="group"><Link href={`/bai-viet/${hero.slug}`} className="block"><div className="relative aspect-[16/10] overflow-hidden rounded-xl bg-slate-100"><ArticleImage article={hero} /><span className="absolute bottom-4 left-4 rounded-full bg-white/95 px-3 py-1 text-xs font-bold text-[#175b8f] shadow">{hero.category.name}</span></div><h1 className="mt-5 font-serif text-3xl font-black leading-tight text-[#123b5d] transition group-hover:text-[#2576ae] md:text-5xl">{hero.title}</h1></Link><p className="mt-4 text-base leading-7 text-slate-600 md:text-lg">{hero.sapo}</p><p className="mt-4 text-sm text-slate-500"><strong className="text-slate-700">{hero.author}</strong> · {hero.readingTime} phút đọc</p></article>}
          <div className="mt-7 grid gap-5 border-t border-slate-200 pt-6 sm:grid-cols-3">{secondary.map((article) => <article key={article.id} className="group"><Link href={`/bai-viet/${article.slug}`}><div className="relative aspect-[16/10] overflow-hidden rounded-lg bg-slate-100"><ArticleImage article={article} /></div><p className="mt-3 text-xs font-bold uppercase tracking-wide text-[#b46b2a]">{article.category.name}</p><h2 className="mt-1 text-base font-bold leading-5 text-slate-800 group-hover:text-[#2576ae]">{article.title}</h2></Link></article>)}</div>
        </div>

        <aside className="space-y-7 lg:col-span-3">
          <div><div className="mb-4 border-b border-slate-200 pb-2"><p className="text-xs font-bold uppercase tracking-[0.16em] text-[#b46b2a]">Đọc nhiều</p><h2 className="font-serif text-xl font-bold text-[#123b5d]">Câu chuyện nổi bật</h2></div><div className="space-y-5">{featureCards.map((article) => <article key={article.id} className="group"><Link href={`/bai-viet/${article.slug}`}><div className="relative aspect-[16/9] overflow-hidden rounded-lg bg-slate-100"><ArticleImage article={article} /></div><h3 className="mt-2 text-sm font-bold leading-5 text-slate-800 group-hover:text-[#2576ae]">{article.title}</h3><p className="mt-1 line-clamp-2 text-sm leading-5 text-slate-500">{article.sapo}</p></Link></article>)}</div></div>
          <HotFlightRoutes />
        </aside>
      </section>

      <section className="py-12">
        <div className="mb-7 flex items-end justify-between border-b border-slate-200 pb-3"><div><p className="text-xs font-bold uppercase tracking-[0.18em] text-[#b46b2a]">Dòng chảy Việt Nam</p><h2 className="font-serif text-3xl font-black text-[#123b5d]">Tin mới nhất</h2></div><Link href="/tim-kiem" className="text-sm font-bold text-[#2576ae] hover:underline">Xem thêm bài viết →</Link></div>
        {newsStream.length ? <div className="grid gap-x-8 gap-y-7 md:grid-cols-2">{newsStream.map((article) => <article key={article.id} className="group grid grid-cols-[140px_1fr] gap-4 border-b border-slate-100 pb-6 sm:grid-cols-[190px_1fr]"><Link href={`/bai-viet/${article.slug}`} className="relative aspect-[16/10] overflow-hidden rounded-lg bg-slate-100"><ArticleImage article={article} /></Link><div><p className="text-xs font-bold uppercase tracking-wide text-[#b46b2a]">{article.category.name}</p><Link href={`/bai-viet/${article.slug}`}><h3 className="mt-1 font-serif text-lg font-bold leading-6 text-slate-800 group-hover:text-[#2576ae]">{article.title}</h3></Link><p className="mt-2 hidden line-clamp-2 text-sm leading-5 text-slate-500 sm:block">{article.sapo}</p><p className="mt-2 text-xs text-slate-400">{article.readingTime} phút đọc</p></div></article>)}</div> : <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 p-10 text-center text-sm text-slate-500">Các bài mới sẽ xuất hiện tại đây. Hệ thống hiện chưa có đủ bài để tạo thêm một danh sách không trùng lặp.</div>}
      </section>
    </main>
    <Footer />
  </div>;
}
