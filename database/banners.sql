create table if not exists public.banners (
  id text primary key,
  name text not null,
  page text not null,
  position text not null,
  desktop_image_url text not null,
  mobile_image_url text,
  title text,
  description text,
  link_url text,
  is_active boolean not null default true,
  sort_order integer not null default 0,
  starts_at date,
  ends_at date,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists banners_page_position_idx
  on public.banners (page, position);

create index if not exists banners_active_order_idx
  on public.banners (is_active, sort_order);

insert into public.banners (
  id,
  name,
  page,
  position,
  desktop_image_url,
  title,
  description,
  link_url,
  is_active,
  sort_order
) values
  (
    'home-hero-principal',
    'Hero principal da home',
    'home',
    'hero',
    '/assets/banner/BannerHome.png',
    'MAIS QUE
UMA CAMISA,
UMA HISTÓRIA.',
    'Camisas dos maiores times do mundo com qualidade premium.',
    '/masculino',
    true,
    1
  ),
  (
    'home-hero-masculino',
    'Hero masculino',
    'home',
    'hero',
    '/assets/banner/promo-banner.png',
    'MASCULINO',
    'Modelos premium para torcer com estilo.',
    '/masculino',
    true,
    2
  ),
  (
    'home-hero-retro',
    'Hero retrô',
    'home',
    'hero',
    '/assets/banner/bannerRetro.png',
    'RETRÔ',
    'Camisas que carregam história dentro e fora de campo.',
    '/retro',
    true,
    3
  )
on conflict (id) do nothing;
