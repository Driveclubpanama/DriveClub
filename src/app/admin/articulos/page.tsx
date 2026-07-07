import Link from "next/link";
import { createAdminClient } from "@/lib/supabase/admin";
import { ArticleForm } from "@/components/admin/ArticleForm";
import { ArticleEditorCard } from "@/components/admin/ArticleEditorCard";
import { LogoutButton } from "@/components/admin/LogoutButton";

export const dynamic = "force-dynamic";

export default async function AdminArticlesPage() {
  const supabase = createAdminClient();

  const { data: articles } = await supabase
    .from("articles")
    .select("*")
    .order("created_at", { ascending: false });

  const allArticles = articles ?? [];

  return (
    <main className="mx-auto max-w-4xl px-4 md:px-6 py-10">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-serif text-2xl">DriveClub Panama</h1>
          <p className="font-mono text-xs uppercase tracking-widest text-gold">
            Panel de administración
          </p>
        </div>
        <LogoutButton />
      </div>

      <nav className="font-mono text-xs uppercase tracking-widest flex gap-6 mb-10 border-b border-ink/10 pb-4">
        <Link href="/admin" className="text-ink/50 hover:text-gold transition-colors">
          Reels
        </Link>
        <Link href="/admin/articulos" className="text-gold">
          Noticias
        </Link>
      </nav>

      <ArticleForm />

      <h2 className="font-mono text-xs uppercase tracking-widest text-ink/50 mb-4">
        Artículos ({allArticles.length})
      </h2>

      {allArticles.length === 0 ? (
        <p className="font-mono text-sm text-ink/50 py-16 text-center">
          Todavía no has creado ningún artículo.
        </p>
      ) : (
        <div className="flex flex-col gap-6">
          {allArticles.map((article) => (
            <ArticleEditorCard key={article.id} article={article} />
          ))}
        </div>
      )}
    </main>
  );
}
