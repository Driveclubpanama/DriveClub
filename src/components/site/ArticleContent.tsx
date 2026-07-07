"use client";

import { useState } from "react";
import type { Reel } from "@/types/database";
import { formatDate } from "@/lib/utils";

export function ArticleContent({ reel }: { reel: Reel }) {
  const [lang, setLang] = useState<"es" | "en">("es");

  const title = lang === "es" ? reel.title_es : reel.title_en ?? reel.title_es;
  const body = lang === "es" ? reel.body_es : reel.body_en ?? reel.body_es;
  const hasTranslation = Boolean(reel.title_en && reel.body_en);

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <p className="font-mono text-xs uppercase tracking-widest text-gold">
          {formatDate(reel.published_at ?? reel.posted_at, lang)}
        </p>
        {hasTranslation && (
          <div className="font-mono text-xs uppercase tracking-widest flex gap-1">
            <button
              onClick={() => setLang("es")}
              className={`px-2 py-1 border ${
                lang === "es" ? "border-gold text-gold" : "border-ink/20 text-ink/50"
              }`}
            >
              ES
            </button>
            <button
              onClick={() => setLang("en")}
              className={`px-2 py-1 border ${
                lang === "en" ? "border-gold text-gold" : "border-ink/20 text-ink/50"
              }`}
            >
              EN
            </button>
          </div>
        )}
      </div>

      <h1 className="font-serif text-3xl md:text-5xl font-semibold text-ink leading-tight mb-8">
        {title}
      </h1>

      <div className="font-sans text-ink/80 leading-relaxed whitespace-pre-line max-w-2xl">
        {body}
      </div>
    </div>
  );
}
