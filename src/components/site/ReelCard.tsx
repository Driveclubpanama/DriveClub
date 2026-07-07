import Image from "next/image";
import Link from "next/link";
import type { Reel } from "@/types/database";
import { formatDate } from "@/lib/utils";

export function ReelCard({ reel }: { reel: Reel }) {
  return (
    <Link
      href={`/articulo/${reel.slug}`}
      className="group block bg-white/40 border border-ink/10 hover:border-gold transition-colors"
    >
      <div className="relative aspect-reel w-full overflow-hidden bg-ink/5">
        {reel.thumbnail_url ? (
          <Image
            src={reel.thumbnail_url}
            alt={reel.title_es ?? "DriveClub Panama"}
            fill
            sizes="(max-width: 768px) 50vw, 25vw"
            className="object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-ink/30 font-mono text-xs">
            sin miniatura
          </div>
        )}
      </div>
      <div className="p-4">
        <p className="font-mono text-[10px] uppercase tracking-widest text-gold mb-2">
          {formatDate(reel.posted_at, "es")}
        </p>
        <h3 className="font-serif text-lg leading-snug text-ink group-hover:text-gold transition-colors">
          {reel.title_es}
        </h3>
      </div>
    </Link>
  );
}
