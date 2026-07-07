import { createPublicClient } from "@/lib/supabase/server";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { ReelGrid } from "@/components/site/ReelGrid";

export const revalidate = 60;

export default async function NoticiasRapidasPage() {
  const supabase = createPublicClient();

  const { data: reels } = await supabase
    .from("reels")
    .select("*")
    .eq("status", "published")
    .order("published_at", { ascending: false })
    .limit(100);

  return (
    <>
      <Header />
      <main className="mx-auto max-w-6xl px-4 md:px-6 py-14">
        <p className="font-mono text-xs uppercase tracking-[0.3em] text-gold mb-3">
          DriveClub Magazine
        </p>
        <h1 className="font-serif text-3xl md:text-4xl mb-2 text-ink">Noticias Rápidas</h1>
        <p className="font-sans text-ink/60 mb-10 max-w-xl">
          Cada Reel de @DriveClubPanama, en un solo lugar.
        </p>
        <ReelGrid reels={reels ?? []} />
      </main>
      <Footer />
    </>
  );
}
