import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Image from "next/image";
import { createPublicClient } from "@/lib/supabase/server";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { formatDate } from "@/lib/utils";

export const revalidate = 60;

async function getArticle(slug: string) {
  const supabase = createPublicClient();
  const { data } = await supabase
    .from("articles")
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
  const article = await getArticle(params.slug);
  if (!article) return {};
  return {
    title: `${article.title} · DriveClub Panama`,
    description: article.body.slice(0, 160),
  };
}

export default async function NoticiaPage({
  params,
}: {
  params: { slug: string };
}) {
  const article = await getArticle(params.slug);
  if (!article) notFound();

  return (
    <>
      <Header />
      <main className="mx-auto max-w-3xl px-4 md:px-6 py-14">
        {article.cover_image_url && (
          <div className="relative aspect-video w-full mb-8 bg-ink/5">
            <Image
              src={article.cover_image_url}
              alt={article.title}
              fill
              sizes="(max-width: 768px) 100vw, 768px"
              className="object-cover"
              priority
            />
          </div>
        )}

        <p className="font-mono text-xs uppercase tracking-widest text-gold mb-4">
          {formatDate(article.published_at, "es")}
        </p>

        <h1 className="font-serif text-3xl md:text-5xl font-semibold text-ink leading-tight mb-8">
          {article.title}
        </h1>

        <div className="font-sans text-ink/80 leading-relaxed whitespace-pre-line max-w-2xl">
          {article.body}
        </div>
      </main>
      <Footer />
    </>
  );
}
