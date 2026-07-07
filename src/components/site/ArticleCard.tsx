import Image from "next/image";
import Link from "next/link";
import type { Article } from "@/types/database";
import { formatDate, truncate } from "@/lib/utils";

export function ArticleCard({ article }: { article: Article }) {
  return (
    <Link
      href={`/noticias/${article.slug}`}
      className="group block bg-white/40 border border-ink/10 hover:border-gold transition-colors"
    >
      <div className="relative aspect-video w-full overflow-hidden bg-ink/5">
        {article.cover_image_url ? (
          <Image
            src={article.cover_image_url}
            alt={article.title}
            fill
            sizes="(max-width: 768px) 100vw, 33vw"
            className="object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-ink/30 font-mono text-xs">
            sin imagen
          </div>
        )}
      </div>
      <div className="p-4">
        <p className="font-mono text-[10px] uppercase tracking-widest text-gold mb-2">
          {formatDate(article.published_at, "es")}
        </p>
        <h3 className="font-serif text-lg leading-snug text-ink group-hover:text-gold transition-colors mb-2">
          {article.title}
        </h3>
        <p className="font-sans text-sm text-ink/60">{truncate(article.body, 110)}</p>
      </div>
    </Link>
  );
}
