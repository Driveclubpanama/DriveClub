import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { createPublicClient } from "@/lib/supabase/server";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { InstagramEmbed } from "@/components/site/InstagramEmbed";
import { ArticleContent } from "@/components/site/ArticleContent";

export const revalidate = 60;

async function getReel(slug: string) {
  const supabase = createPublicClient();
  const { data } = await supabase
    .from("reels")
    .select("*")
    .eq("slug", slug)
    .eq("status", "published")
    .single();
  return data;
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const reel = await getReel(params.slug);
  if (!reel) return {};
  return {
    title: `${reel.title_es} · DriveClub Panama`,
    description: reel.body_es?.slice(0, 160),
  };
}

export default async function ArticlePage({
  params,
}: {
  params: { slug: string };
}) {
  const reel = await getReel(params.slug);
  if (!reel) notFound();

  return (
    <>
      <Header />
      <main className="mx-auto max-w-4xl px-4 md:px-6 py-14 grid md:grid-cols-2 gap-10 items-start">
        <InstagramEmbed permalink={reel.permalink} />
        <ArticleContent reel={reel} />
      </main>
      <Footer />
    </>
  );
}
