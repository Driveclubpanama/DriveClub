-- DriveClub Panama - esquema inicial
-- Tabla principal: reels importados desde Instagram, con flujo
-- pending -> approved -> published, y traducción ES/EN.

create extension if not exists "pgcrypto";

do $$
begin
  if not exists (select 1 from pg_type where typname = 'reel_status') then
    create type reel_status as enum ('pending', 'approved', 'published');
  end if;
end
$$;

create table if not exists reels (
  id uuid primary key default gen_random_uuid(),

  -- origen Instagram
  instagram_id text not null unique,
  permalink text not null,
  media_type text,
  media_url text,
  thumbnail_url text,
  caption_original text,
  posted_at timestamptz,

  -- contenido editorial
  slug text unique,
  title_es text,
  body_es text,
  title_en text,
  body_en text,

  -- flujo editorial
  status reel_status not null default 'pending',
  published_at timestamptz,

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists reels_status_idx on reels (status);
create index if not exists reels_slug_idx on reels (slug);
create index if not exists reels_posted_at_idx on reels (posted_at desc);
create index if not exists reels_published_at_idx on reels (published_at desc);

create or replace function set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists reels_set_updated_at on reels;
create trigger reels_set_updated_at
before update on reels
for each row
execute function set_updated_at();

-- Row Level Security: el público solo puede leer reels publicados.
-- Las escrituras (cron, panel admin) usan la service role key, que
-- ignora RLS, así que no necesitan políticas propias.
alter table reels enable row level security;

drop policy if exists "Public can read published reels" on reels;
create policy "Public can read published reels"
on reels for select
to anon, authenticated
using (status = 'published');
