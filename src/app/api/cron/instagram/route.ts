import { NextRequest, NextResponse } from "next/server";
import { fetchInstagramReels } from "@/lib/instagram";
import { createAdminClient } from "@/lib/supabase/admin";
import { slugify, extractTitleFromCaption } from "@/lib/utils";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

function isAuthorized(request: NextRequest): boolean {
  const cronSecret = process.env.CRON_SECRET;
  if (!cronSecret) return true; // sin CRON_SECRET configurado, no se exige (solo para desarrollo local)
  const authHeader = request.headers.get("authorization");
  return authHeader === `Bearer ${cronSecret}`;
}

/**
 * Revisa Instagram por reels nuevos y los guarda en Supabase con
 * estado "pending". Vercel Cron llama a este endpoint según vercel.json.
 */
export async function GET(request: NextRequest) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const supabase = createAdminClient();

  let reels;
  try {
    reels = await fetchInstagramReels();
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Error desconocido de Instagram" },
      { status: 502 }
    );
  }

  let inserted = 0;
  let skipped = 0;
  const errors: string[] = [];

  for (const reel of reels) {
    const { data: existing } = await supabase
      .from("reels")
      .select("id")
      .eq("instagram_id", reel.id)
      .maybeSingle();

    if (existing) {
      skipped++;
      continue;
    }

    const caption = reel.caption ?? "";
    const title = extractTitleFromCaption(caption);
    const slug = `${slugify(title)}-${reel.id.slice(-6)}`;

    const { error } = await supabase.from("reels").insert({
      instagram_id: reel.id,
      permalink: reel.permalink,
      media_type: reel.media_type,
      media_url: reel.media_url ?? null,
      thumbnail_url: reel.thumbnail_url ?? null,
      caption_original: caption,
      posted_at: reel.timestamp,
      slug,
      title_es: title,
      body_es: caption,
      status: "pending",
    });

    if (error) {
      errors.push(`${reel.id}: ${error.message}`);
    } else {
      inserted++;
    }
  }

  return NextResponse.json({ inserted, skipped, errors });
}
