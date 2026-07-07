"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import type { Reel } from "@/types/database";
import { formatDate } from "@/lib/utils";

export function ReelEditorCard({ reel }: { reel: Reel }) {
  const [titleEs, setTitleEs] = useState(reel.title_es ?? "");
  const [bodyEs, setBodyEs] = useState(reel.body_es ?? "");
  const [loadingAction, setLoadingAction] = useState<
    "save" | "approve" | "publish" | "reject" | "publish_as_article" | null
  >(null);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  async function runAction(
    action: "save" | "approve" | "publish" | "reject" | "publish_as_article"
  ) {
    if (
      action === "reject" &&
      !window.confirm("¿Rechazar este Reel? No volverá a aparecer en el panel.")
    ) {
      return;
    }

    if (
      action === "publish_as_article" &&
      !window.confirm(
        "¿Publicar este Reel como artículo en la Revista? Dejará de aparecer en Noticias Rápidas."
      )
    ) {
      return;
    }

    setLoadingAction(action);
    setError(null);

    const response = await fetch(`/api/admin/reels/${reel.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title_es: titleEs, body_es: bodyEs, action }),
    });

    setLoadingAction(null);

    if (!response.ok) {
      const data = await response.json().catch(() => ({}));
      setError(data.error ?? "Ocurrió un error.");
      return;
    }

    router.refresh();
  }

  return (
    <div className="border border-ink/10 bg-white/50 p-4 md:p-6 grid md:grid-cols-[160px_1fr] gap-6">
      <div className="relative aspect-reel w-full max-w-[160px] bg-ink/5 overflow-hidden">
        {reel.thumbnail_url ? (
          <Image
            src={reel.thumbnail_url}
            alt={titleEs || "Reel"}
            fill
            sizes="160px"
            className="object-cover"
          />
        ) : null}
      </div>

      <div>
        <div className="flex items-center justify-between mb-3">
          <span className="font-mono text-[10px] uppercase tracking-widest text-gold">
            {reel.status} · {formatDate(reel.posted_at, "es")}
          </span>
          <a
            href={reel.permalink}
            target="_blank"
            rel="noreferrer noopener"
            className="font-mono text-[10px] uppercase tracking-widest text-ink/50 hover:text-gold"
          >
            Ver en Instagram
          </a>
        </div>

        <label className="block font-mono text-[10px] uppercase tracking-widest text-ink/50 mb-1">
          Título (ES)
        </label>
        <input
          value={titleEs}
          onChange={(event) => setTitleEs(event.target.value)}
          className="w-full border border-ink/20 bg-white px-3 py-2 mb-3 font-serif text-lg focus:outline-none focus:border-gold"
        />

        <label className="block font-mono text-[10px] uppercase tracking-widest text-ink/50 mb-1">
          Cuerpo (ES)
        </label>
        <textarea
          value={bodyEs}
          onChange={(event) => setBodyEs(event.target.value)}
          rows={5}
          className="w-full border border-ink/20 bg-white px-3 py-2 mb-4 font-sans text-sm focus:outline-none focus:border-gold"
        />

        {error && <p className="font-mono text-xs text-red-700 mb-3">{error}</p>}

        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => runAction("save")}
            disabled={loadingAction !== null}
            className="font-mono text-xs uppercase tracking-widest px-4 py-2 border border-ink/20 hover:border-gold disabled:opacity-50"
          >
            {loadingAction === "save" ? "Guardando…" : "Guardar cambios"}
          </button>

          {reel.status === "pending" && (
            <button
              onClick={() => runAction("approve")}
              disabled={loadingAction !== null}
              className="font-mono text-xs uppercase tracking-widest px-4 py-2 border border-gold text-gold hover:bg-gold hover:text-ink disabled:opacity-50"
            >
              {loadingAction === "approve" ? "Aprobando…" : "Aprobar"}
            </button>
          )}

          {reel.status !== "published" && (
            <button
              onClick={() => runAction("publish")}
              disabled={loadingAction !== null}
              className="font-mono text-xs uppercase tracking-widest px-4 py-2 bg-ink text-cream hover:bg-gold hover:text-ink disabled:opacity-50"
            >
              {loadingAction === "publish" ? "Traduciendo y publicando…" : "Aprobar y publicar"}
            </button>
          )}

          {reel.status !== "published" && (
            <button
              onClick={() => runAction("publish_as_article")}
              disabled={loadingAction !== null}
              className="font-mono text-xs uppercase tracking-widest px-4 py-2 bg-gold text-ink hover:bg-ink hover:text-cream disabled:opacity-50"
            >
              {loadingAction === "publish_as_article" ? "Publicando en Revista…" : "Publicar en Revista"}
            </button>
          )}

          {reel.status !== "published" && (
            <button
              onClick={() => runAction("reject")}
              disabled={loadingAction !== null}
              className="font-mono text-xs uppercase tracking-widest px-4 py-2 border border-red-700/40 text-red-700 hover:bg-red-700 hover:text-cream disabled:opacity-50"
            >
              {loadingAction === "reject" ? "Rechazando…" : "Rechazar"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
