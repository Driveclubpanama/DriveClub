import type { Reel } from "@/types/database";
import { ReelCard } from "./ReelCard";

export function ReelGrid({ reels }: { reels: Reel[] }) {
  if (reels.length === 0) {
    return (
      <p className="font-mono text-sm text-ink/50 text-center py-16">
        Todavía no hay artículos publicados. Vuelve pronto.
      </p>
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
      {reels.map((reel) => (
        <ReelCard key={reel.id} reel={reel} />
      ))}
    </div>
  );
}
