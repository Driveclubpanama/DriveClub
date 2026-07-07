-- DriveClub Panama - artículos editoriales (noticias)
-- Contenido escrito directamente en el panel admin (no viene de Instagram).

do $$
begin
  if not exists (select 1 from pg_type where typname = 'article_status') then
    create type article_status as enum ('draft', 'published');
  end if;
end
$$;

create table if not exists articles (
  id uuid primary key default gen_random_uuid(),

  slug text unique not null,
  title text not null,
  body text not null,
  cover_image_url text,

  status article_status not null default 'draft',
  published_at timestamptz,

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists articles_status_idx on articles (status);
create index if not exists articles_slug_idx on articles (slug);
create index if not exists articles_published_at_idx on articles (published_at desc);

drop trigger if exists articles_set_updated_at on articles;
create trigger articles_set_updated_at
before update on articles
for each row
execute function set_updated_at();

alter table articles enable row level security;

drop policy if exists "Public can read published articles" on articles;
create policy "Public can read published articles"
on articles for select
to anon, authenticated
using (status = 'published');
