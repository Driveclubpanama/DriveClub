import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { translateArticle } from "@/lib/claude";
import { slugify } from "@/lib/utils";
import type { Reel } from "@/types/database";

const ARTICLE_IMAGES_BUCKET = "article-images";

interface PatchBody {
  title_es?: string;
  body_es?: string;
  action?: "save" | "approve" | "publish" | "reject" | "publish_as_article";
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

  if (body.action === "publish_as_article") {
    let coverImageUrl: string | null = null;

    if (reel.thumbnail_url) {
      try {
        const imageResponse = await fetch(reel.thumbnail_url);
        if (!imageResponse.ok) throw new Error("No se pudo descargar la miniatura.");
        const contentType = imageResponse.headers.get("content-type") || "image/jpeg";
        const extension = contentType.split("/")[1]?.split(";")[0] || "jpg";
        const buffer = Buffer.from(await imageResponse.arrayBuffer());
        const path = `${crypto.randomUUID()}.${extension}`;

        const { error: uploadError } = await supabase.storage
          .from(ARTICLE_IMAGES_BUCKET)
          .upload(path, buffer, { contentType, upsert: false });

        if (uploadError) throw new Error(uploadError.message);

        coverImageUrl = supabase.storage.from(ARTICLE_IMAGES_BUCKET).getPublicUrl(path)
          .data.publicUrl;
      } catch (error) {
        return NextResponse.json(
          {
            error:
              "No se pudo copiar la imagen del Reel: " +
              (error instanceof Error ? error.message : "error desconocido"),
          },
          { status: 502 }
        );
      }
    }

    const slug = `${slugify(titleEs)}-${reel.instagram_id.slice(-6)}`;

    const { data: article, error: articleError } = await supabase
      .from("articles")
      .insert({
        title: titleEs,
        body: bodyEs,
        cover_image_url: coverImageUrl,
        slug,
        status: "published",
        published_at: new Date().toISOString(),
      })
      .select("*")
      .single();

    if (articleError) {
      return NextResponse.json({ error: articleError.message }, { status: 500 });
    }

    const { data: updatedReel, error: updateReelError } = await supabase
      .from("reels")
      .update({ title_es: titleEs, body_es: bodyEs, status: "converted" })
      .eq("id", params.id)
      .select("*")
      .single();

    if (updateReelError) {
      return NextResponse.json({ error: updateReelError.message }, { status: 500 });
    }

    return NextResponse.json({ reel: updatedReel, article });
  }

  const update: Partial<Reel> = {
    title_es: titleEs,
    body_es: bodyEs,
  };

  if (body.action === "approve") {
    update.status = "approved";
  }

  if (body.action === "reject") {
    update.status = "rejected";
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
