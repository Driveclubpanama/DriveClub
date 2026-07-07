import Link from "next/link";
import { createPublicClient } from "@/lib/supabase/server";
import { Header } from "@/components/site/Header";
import { Hero } from "@/components/site/Hero";
import { Ticker } from "@/components/site/Ticker";
import { LatestSection } from "@/components/site/LatestSection";
import { ReelGrid } from "@/components/site/ReelGrid";
import { Footer } from "@/components/site/Footer";

export const revalidate = 60;

export default async function HomePage() {
  const supabase = createPublicClient();

  const [{ data: reels }, { data: articles }] = await Promise.all([
    supabase
      .from("reels")
      .select("*")
      .eq("status", "published")
      .order("published_at", { ascending: false })
      .limit(24),
    supabase
      .from("articles")
      .select("*")
      .eq("status", "published")
      .order("published_at", { ascending: false })
      .limit(3),
  ]);

  const allReels = reels ?? [];
  const latestArticles = articles ?? [];

  const tickerItems = [
    ...allReels.slice(0, 8).map((reel) => ({
      slug: reel.slug ?? reel.id,
      title: reel.title_es ?? "Sin título",
      href: `/articulo/${reel.slug}`,
    })),
    ...latestArticles.slice(0, 2).map((article) => ({
      slug: article.slug,
      title: article.title,
      href: `/noticias/${article.slug}`,
    })),
  ];

  return (
    <>
      <Header />
      <Hero />
      <Ticker items={tickerItems} />
      <LatestSection latestReel={allReels[0] ?? null} latestArticles={latestArticles} />
      <main className="mx-auto max-w-6xl px-4 md:px-6 py-14">
        <div className="flex items-center justify-between mb-8">
          <h2 className="font-serif text-2xl md:text-3xl text-ink">Últimos Reels</h2>
          <Link
            href="/noticias-rapidas"
            className="font-mono text-xs uppercase tracking-widest text-ink/50 hover:text-gold transition-colors"
          >
            Ver todos →
          </Link>
        </div>
        <ReelGrid reels={allReels} />
      </main>
      <Footer />
    </>
  );
}
