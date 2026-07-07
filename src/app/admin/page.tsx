import Link from "next/link";
import { createAdminClient } from "@/lib/supabase/admin";
import { ReelEditorCard } from "@/components/admin/ReelEditorCard";
import { LogoutButton } from "@/components/admin/LogoutButton";

export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  const supabase = createAdminClient();

  const { data: reels } = await supabase
    .from("reels")
    .select("*")
    .in("status", ["pending", "approved"])
    .order("posted_at", { ascending: false });

  const allReels = reels ?? [];

  return (
    <main className="mx-auto max-w-4xl px-4 md:px-6 py-10">
      <div className="flex items-center justify-between mb-10">
        <div>
          <h1 className="font-serif text-2xl">DriveClub Panama</h1>
          <p className="font-mono text-xs uppercase tracking-widest text-gold">
            Panel de administración
          </p>
        </div>
        <LogoutButton />
      </div>

      <nav className="font-mono text-xs uppercase tracking-widest flex gap-6 mb-10 border-b border-ink/10 pb-4">
        <Link href="/admin" className="text-gold">
          Reels
        </Link>
        <Link href="/admin/articulos" className="text-ink/50 hover:text-gold transition-colors">
          Noticias
        </Link>
      </nav>

      <h2 className="font-mono text-xs uppercase tracking-widest text-ink/50 mb-4">
        Reels por revisar ({allReels.length})
      </h2>

      {allReels.length === 0 ? (
        <p className="font-mono text-sm text-ink/50 py-16 text-center">
          No hay Reels pendientes. El cron trae nuevos automáticamente.
        </p>
      ) : (
        <div className="flex flex-col gap-6">
          {allReels.map((reel) => (
            <ReelEditorCard key={reel.id} reel={reel} />
          ))}
        </div>
      )}
    </main>
  );
}
