import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { translateArticle } from "@/lib/claude";
import { slugify } from "@/lib/utils";
import type { Reel } from "@/types/database";

interface PatchBody {
  title_es?: string;
  body_es?: string;
  action?: "save" | "approve" | "publish";
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const body = (await request.json().catch(() => null)) as PatchBody | null;
  if (!body) {
    return NextResponse.json({ error: "Body inválido." }, { status: 400 });
  }

  const supabase = createAdminClient();

  const { data: reel, error: fetchError } = await supabase
    .from("reels")
    .select("*")
    .eq("id", params.id)
    .single();

  if (fetchError || !reel) {
    return NextResponse.json({ error: "Reel no encontrado." }, { status: 404 });
  }

  const titleEs = body.title_es ?? reel.title_es ?? "";
  const bodyEs = body.body_es ?? reel.body_es ?? "";

  const update: Partial<Reel> = {
    title_es: titleEs,
    body_es: bodyEs,
  };

  if (body.action === "approve") {
    update.status = "approved";
  }

  if (body.action === "publish") {
    if (process.env.ANTHROPIC_API_KEY) {
      try {
        const translation = await translateArticle(titleEs, bodyEs);
        update.title_en = translation.titleEn;
        update.body_en = translation.bodyEn;
      } catch (error) {
        return NextResponse.json(
          {
            error:
              "No se pudo traducir el artículo con Claude: " +
              (error instanceof Error ? error.message : "error desconocido"),
          },
          { status: 502 }
        );
      }
    }

    if (!reel.slug) {
      update.slug = `${slugify(titleEs)}-${reel.instagram_id.slice(-6)}`;
    }

    update.status = "published";
    update.published_at = new Date().toISOString();
  }

  const { data: updated, error: updateError } = await supabase
    .from("reels")
    .update(update)
    .eq("id", params.id)
    .select("*")
    .single();

  if (updateError) {
    return NextResponse.json({ error: updateError.message }, { status: 500 });
  }

  return NextResponse.json({ reel: updated });
}
