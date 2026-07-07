import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import type { Article } from "@/types/database";

interface PatchBody {
  title?: string;
  body?: string;
  cover_image_url?: string;
  action?: "save" | "publish" | "unpublish";
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

  const { data: article, error: fetchError } = await supabase
    .from("articles")
    .select("*")
    .eq("id", params.id)
    .single();

  if (fetchError || !article) {
    return NextResponse.json({ error: "Artículo no encontrado." }, { status: 404 });
  }

  const update: Partial<Article> = {
    title: body.title ?? article.title,
    body: body.body ?? article.body,
    cover_image_url: body.cover_image_url ?? article.cover_image_url,
  };

  if (body.action === "publish") {
    update.status = "published";
    update.published_at = new Date().toISOString();
  }

  if (body.action === "unpublish") {
    update.status = "draft";
  }

  const { data: updated, error: updateError } = await supabase
    .from("articles")
    .update(update)
    .eq("id", params.id)
    .select("*")
    .single();

  if (updateError) {
    return NextResponse.json({ error: updateError.message }, { status: 500 });
  }

  return NextResponse.json({ article: updated });
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  const supabase = createAdminClient();
  const { error } = await supabase.from("articles").delete().eq("id", params.id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
