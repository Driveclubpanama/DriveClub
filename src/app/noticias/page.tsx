import { createPublicClient } from "@/lib/supabase/server";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { ArticleGrid } from "@/components/site/ArticleGrid";

export const revalidate = 60;

export default async function NoticiasPage() {
  const supabase = createPublicClient();

  const { data: articles } = await supabase
    .from("articles")
    .select("*")
    .eq("status", "published")
    .order("published_at", { ascending: false });

  return (
    <>
      <Header />
      <main className="mx-auto max-w-6xl px-4 md:px-6 py-14">
        <p className="font-mono text-xs uppercase tracking-[0.3em] text-gold mb-3">
          DriveClub Magazine
        </p>
        <h1 className="font-serif text-3xl md:text-4xl mb-10 text-ink">Revista</h1>
        <ArticleGrid articles={articles ?? []} />
      </main>
      <Footer />
    </>
  );
}
