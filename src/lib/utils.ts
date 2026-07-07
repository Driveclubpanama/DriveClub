export function slugify(input: string): string {
  return input
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .slice(0, 80);
}

export function formatDate(dateIso: string | null, locale: "es" | "en" = "es"): string {
  if (!dateIso) return "";
  const date = new Date(dateIso);
  return new Intl.DateTimeFormat(locale === "es" ? "es-PA" : "en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(date);
}

/** Primera línea (o primeros ~80 caracteres) de un caption, para usar como título. */
export function extractTitleFromCaption(caption: string | null): string {
  if (!caption) return "Sin título";
  const firstLine = caption.split("\n")[0].trim();
  if (firstLine.length > 0 && firstLine.length <= 100) return firstLine;
  return caption.slice(0, 80).trim() + (caption.length > 80 ? "…" : "");
}

export function truncate(text: string, maxLength: number): string {
  const trimmed = text.trim();
  if (trimmed.length <= maxLength) return trimmed;
  return trimmed.slice(0, maxLength).trim() + "…";
}
