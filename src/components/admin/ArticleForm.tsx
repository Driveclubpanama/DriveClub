"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";

export function ArticleForm() {
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
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

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setSubmitting(true);
    setError(null);

    const response = await fetch("/api/admin/articles", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, body, cover_image_url: imageUrl }),
    });

    setSubmitting(false);

    if (!response.ok) {
      const data = await response.json().catch(() => ({}));
      setError(data.error ?? "No se pudo crear el artículo.");
      return;
    }

    setTitle("");
    setBody("");
    setImageUrl(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
    router.refresh();
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="border border-ink/10 bg-white/50 p-4 md:p-6 mb-8"
    >
      <h2 className="font-mono text-xs uppercase tracking-widest text-gold mb-4">
        Nuevo artículo
      </h2>

      <label className="block font-mono text-[10px] uppercase tracking-widest text-ink/50 mb-1">
        Título
      </label>
      <input
        value={title}
        onChange={(event) => setTitle(event.target.value)}
        placeholder="Ej. Los 5 autos más esperados del 2026"
        className="w-full border border-ink/20 bg-white px-3 py-2 mb-3 font-serif text-lg focus:outline-none focus:border-gold"
      />

      <label className="block font-mono text-[10px] uppercase tracking-widest text-ink/50 mb-1">
        Cuerpo
      </label>
      <textarea
        value={body}
        onChange={(event) => setBody(event.target.value)}
        rows={6}
        placeholder="Escribe el artículo completo aquí..."
        className="w-full border border-ink/20 bg-white px-3 py-2 mb-3 font-sans text-sm focus:outline-none focus:border-gold"
      />

      <label className="block font-mono text-[10px] uppercase tracking-widest text-ink/50 mb-1">
        Imagen de portada
      </label>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/gif"
        onChange={handleFileChange}
        className="w-full font-sans text-sm mb-3"
      />
      {uploading && (
        <p className="font-mono text-xs text-ink/50 mb-3">Subiendo imagen…</p>
      )}
      {imageUrl && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={imageUrl}
          alt="Vista previa"
          className="w-full max-w-xs aspect-video object-cover border border-ink/10 mb-3"
        />
      )}

      {error && <p className="font-mono text-xs text-red-700 mb-3">{error}</p>}

      <button
        type="submit"
        disabled={submitting || uploading || !title.trim() || !body.trim()}
        className="font-mono text-xs uppercase tracking-widest px-4 py-2 bg-ink text-cream hover:bg-gold hover:text-ink disabled:opacity-50"
      >
        {submitting ? "Creando…" : "Crear borrador"}
      </button>
    </form>
  );
}
