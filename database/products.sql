create table if not exists public.products (
  id text primary key,
  name text not null,
  price text not null,
  image text not null,
  images jsonb not null default '[]'::jsonb,
  category text not null,
  team text not null,
  brand text,
  season text,
  description text not null,
  details jsonb not null default '[]'::jsonb,
  badge text,
  gender text not null default 'masculino',
  active boolean not null default true,
  stock_by_size jsonb,
  owner_type text not null default 'team',
  country text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.products
  add column if not exists images jsonb not null default '[]'::jsonb;

alter table public.products
  add column if not exists details jsonb not null default '[]'::jsonb;

alter table public.products
  add column if not exists gender text not null default 'masculino';

alter table public.products
  add column if not exists active boolean not null default true;

alter table public.products
  add column if not exists stock_by_size jsonb;

alter table public.products
  add column if not exists owner_type text not null default 'team';

alter table public.products
  add column if not exists country text;

create index if not exists products_active_idx on public.products (active);
create index if not exists products_country_idx on public.products (country);
create index if not exists products_team_idx on public.products (team);
create index if not exists products_gender_idx on public.products (gender);
