import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { slugify } from "@/lib/utils";

interface CreateBody {
  title?: string;
  body?: string;
  cover_image_url?: string;
}

export async function GET() {
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("articles")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ articles: data ?? [] });
}

export async function POST(request: NextRequest) {
  const body = (await request.json().catch(() => null)) as CreateBody | null;

  if (!body?.title?.trim() || !body?.body?.trim()) {
    return NextResponse.json(
      { error: "Título y cuerpo son obligatorios." },
      { status: 400 }
    );
  }

  const supabase = createAdminClient();
  const slug = `${slugify(body.title)}-${crypto.randomUUID().slice(0, 6)}`;

  const { data, error } = await supabase
    .from("articles")
    .insert({
      title: body.title.trim(),
      body: body.body.trim(),
      cover_image_url: body.cover_image_url ?? null,
      slug,
      status: "draft",
    })
    .select("*")
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ article: data });
}
