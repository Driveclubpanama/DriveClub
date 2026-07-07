import "server-only";

const GRAPH_API_VERSION = "v20.0";

export interface InstagramMediaItem {
  id: string;
  caption?: string;
  media_type: string;
  media_product_type?: string;
  media_url?: string;
  thumbnail_url?: string;
  permalink: string;
  timestamp: string;
}

interface InstagramMediaResponse {
  data: InstagramMediaItem[];
  paging?: {
    cursors?: { before?: string; after?: string };
    next?: string;
  };
  error?: { message: string; type: string; code: number };
}

/**
 * Trae los últimos reels/videos publicados en la cuenta de Instagram
 * Business/Creator configurada, vía Instagram Graph API.
 */
export async function fetchInstagramReels(limit = 25): Promise<InstagramMediaItem[]> {
  const accessToken = process.env.INSTAGRAM_ACCESS_TOKEN;
  const businessAccountId = process.env.INSTAGRAM_BUSINESS_ACCOUNT_ID;

  if (!accessToken || !businessAccountId) {
    throw new Error(
      "Faltan INSTAGRAM_ACCESS_TOKEN o INSTAGRAM_BUSINESS_ACCOUNT_ID en las variables de entorno."
    );
  }

  const fields = [
    "id",
    "caption",
    "media_type",
    "media_product_type",
    "media_url",
    "thumbnail_url",
    "permalink",
    "timestamp",
  ].join(",");

  const url = new URL(
    `https://graph.facebook.com/${GRAPH_API_VERSION}/${businessAccountId}/media`
  );
  url.searchParams.set("fields", fields);
  url.searchParams.set("limit", String(limit));
  url.searchParams.set("access_token", accessToken);

  const response = await fetch(url.toString(), { cache: "no-store" });
  const json = (await response.json()) as InstagramMediaResponse;

  if (!response.ok || json.error) {
    throw new Error(
      `Instagram Graph API error: ${json.error?.message ?? response.statusText}`
    );
  }

  return (json.data ?? []).filter(
    (item) =>
      item.media_product_type === "REELS" || item.media_type === "VIDEO"
  );
}
