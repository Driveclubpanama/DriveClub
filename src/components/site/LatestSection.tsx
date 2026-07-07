import Image from "next/image";
import Link from "next/link";
import type { Reel } from "@/types/database";
import type { Article } from "@/types/database";
import { formatDate, truncate } from "@/lib/utils";

export function LatestSection({
  latestReel,
  latestArticles,
}: {
  latestReel: Reel | null;
  latestArticles: Article[];
}) {
  if (!latestReel && latestArticles.length === 0) return null;

  return (
    <section className="mx-auto max-w-6xl px-4 md:px-6 py-14">
      <p className="font-mono text-xs uppercase tracking-[0.3em] text-gold mb-6">
        Lo último de lo último
      </p>

      <div className="grid md:grid-cols-3 gap-8 items-start">
        {latestReel && (
          <Link
            href={`/articulo/${latestReel.slug}`}
            className="group relative block md:col-span-2 aspect-[4/5] md:aspect-[16/10] w-full overflow-hidden bg-ink"
          >
            {latestReel.thumbnail_url && (
              <Image
                src={latestReel.thumbnail_url}
                alt={latestReel.title_es ?? "DriveClub Panama"}
                fill
                sizes="(max-width: 768px) 100vw, 66vw"
                className="object-cover group-hover:scale-105 transition-transform duration-500"
                priority
              />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/10 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8">
              <p className="font-mono text-[10px] uppercase tracking-widest text-gold mb-2">
                Último Reel · {formatDate(latestReel.posted_at, "es")}
              </p>
              <h2 className="font-serif text-2xl md:text-4xl font-semibold text-cream leading-tight">
                {latestReel.title_es}
              </h2>
            </div>
          </Link>
        )}

        <div className="flex flex-col gap-6">
          <p className="font-mono text-[10px] uppercase tracking-widest text-ink/50">
            Últimas noticias
          </p>

          {latestArticles.length === 0 ? (
            <p className="font-mono text-xs text-ink/40">Aún no hay noticias publicadas.</p>
          ) : (
            latestArticles.map((article) => (
              <Link
                key={article.id}
                href={`/noticias/${article.slug}`}
                className="group flex gap-4 items-start"
              >
                <div className="relative w-20 h-20 flex-shrink-0 overflow-hidden bg-ink/5 border border-ink/10">
                  {article.cover_image_url ? (
                    <Image
                      src={article.cover_image_url}
                      alt={article.title}
                      fill
                      sizes="80px"
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : null}
                </div>
                <div>
                  <p className="font-mono text-[10px] uppercase tracking-widest text-gold mb-1">
                    {formatDate(article.published_at, "es")}
                  </p>
                  <h3 className="font-serif text-base leading-snug text-ink group-hover:text-gold transition-colors">
                    {truncate(article.title, 70)}
                  </h3>
                </div>
              </Link>
            ))
          )}

          <Link
            href="/noticias"
            className="font-mono text-xs uppercase tracking-widest text-ink/50 hover:text-gold transition-colors mt-2"
          >
            Ver todas las noticias →
          </Link>
        </div>
      </div>
    </section>
  );
}
