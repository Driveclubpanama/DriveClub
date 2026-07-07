"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { Article } from "@/types/database";
import { formatDate } from "@/lib/utils";

export function ArticleEditorCard({ article }: { article: Article }) {
  const [title, setTitle] = useState(article.title);
  const [body, setBody] = useState(article.body);
  const [imageUrl, setImageUrl] = useState(article.cover_image_url);
  const [uploading, setUploading] = useState(false);
  const [loadingAction, setLoadingAction] = useState<
    "save" | "publish" | "unpublish" | "delete" | null
  >(null);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  async function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setError(null);

    const formData = new FormData();
    formData.append("file", file);

    const response = await fetch("/api/admin/upload", { method: "POST", body: formData });
    setUploading(false);

    if (!response.ok) {
      const data = await response.json().catch(() => ({}));
      setError(data.error ?? "No se pudo subir la imagen.");
      return;
    }

    const data = await response.json();
    setImageUrl(data.url);
  }

  async function runAction(action: "save" | "publish" | "unpublish") {
    setLoadingAction(action);
    setError(null);

    const response = await fetch(`/api/admin/articles/${article.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, body, cover_image_url: imageUrl, action }),
    });

    setLoadingAction(null);

    if (!response.ok) {
      const data = await response.json().catch(() => ({}));
      setError(data.error ?? "Ocurrió un error.");
      return;
    }

    router.refresh();
  }

  async function handleDelete() {
    if (!window.confirm("¿Eliminar este artículo para siempre? No se puede deshacer.")) {
      return;
    }

    setLoadingAction("delete");
    setError(null);

    const response = await fetch(`/api/admin/articles/${article.id}`, {
      method: "DELETE",
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
      <div>
        {imageUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={imageUrl}
            alt={title}
            className="w-full max-w-[160px] aspect-video object-cover border border-ink/10 mb-2"
          />
        ) : (
          <div className="w-full max-w-[160px] aspect-video bg-ink/5 border border-ink/10 mb-2 flex items-center justify-center text-ink/30 font-mono text-[10px]">
            sin imagen
          </div>
        )}
        <input
          type="file"
          accept="image/jpeg,image/png,image/webp,image/gif"
          onChange={handleFileChange}
          className="w-full font-sans text-xs"
        />
        {uploading && <p className="font-mono text-[10px] text-ink/50 mt-1">Subiendo…</p>}
      </div>

      <div>
        <div className="flex items-center justify-between mb-3">
          <span className="font-mono text-[10px] uppercase tracking-widest text-gold">
            {article.status === "published" ? "publicado" : "borrador"} ·{" "}
            {formatDate(article.published_at ?? article.created_at, "es")}
          </span>
          {article.status === "published" && (
            <a
              href={`/noticias/${article.slug}`}
              target="_blank"
              rel="noreferrer noopener"
              className="font-mono text-[10px] uppercase tracking-widest text-ink/50 hover:text-gold"
            >
              Ver publicado
            </a>
          )}
        </div>

        <label className="block font-mono text-[10px] uppercase tracking-widest text-ink/50 mb-1">
          Título
        </label>
        <input
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          className="w-full border border-ink/20 bg-white px-3 py-2 mb-3 font-serif text-lg focus:outline-none focus:border-gold"
        />

        <label className="block font-mono text-[10px] uppercase tracking-widest text-ink/50 mb-1">
          Cuerpo
        </label>
        <textarea
          value={body}
          onChange={(event) => setBody(event.target.value)}
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

          {article.status === "draft" ? (
            <button
              onClick={() => runAction("publish")}
              disabled={loadingAction !== null}
              className="font-mono text-xs uppercase tracking-widest px-4 py-2 bg-ink text-cream hover:bg-gold hover:text-ink disabled:opacity-50"
            >
              {loadingAction === "publish" ? "Publicando…" : "Publicar"}
            </button>
          ) : (
            <button
              onClick={() => runAction("unpublish")}
              disabled={loadingAction !== null}
              className="font-mono text-xs uppercase tracking-widest px-4 py-2 border border-gold text-gold hover:bg-gold hover:text-ink disabled:opacity-50"
            >
              {loadingAction === "unpublish" ? "Ocultando…" : "Despublicar"}
            </button>
          )}

          <button
            onClick={handleDelete}
            disabled={loadingAction !== null}
            className="font-mono text-xs uppercase tracking-widest px-4 py-2 border border-red-700/40 text-red-700 hover:bg-red-700 hover:text-cream disabled:opacity-50"
          >
            {loadingAction === "delete" ? "Eliminando…" : "Eliminar"}
          </button>
        </div>
      </div>
    </div>
  );
}
