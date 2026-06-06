create table if not exists public.coupons (
  id text primary key,
  code text not null unique,
  type text not null,
  value numeric(10, 2) not null default 0,
  min_subtotal numeric(10, 2) not null default 0,
  max_discount numeric(10, 2),
  starts_at date not null,
  expires_at date not null,
  usage_limit integer not null default 1,
  used_count integer not null default 0,
  usage_per_customer integer not null default 1,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists coupons_code_idx on public.coupons (code);
create index if not exists coupons_dates_idx on public.coupons (starts_at, expires_at);

insert into public.coupons (
  id,
  code,
  type,
  value,
  min_subtotal,
  max_discount,
  starts_at,
  expires_at,
  usage_limit,
  used_count,
  usage_per_customer
)
values
  ('welcome10', 'WELCOME10', 'percentage', 10, 50, 50, '2026-01-01', '2026-12-31', 500, 245, 1),
  ('camisa15', 'CAMISA15', 'percentage', 15, 100, 80, '2026-01-01', '2026-12-31', 300, 123, 1),
  ('primeira5', 'PRIMEIRA5', 'fixed', 5, 100, null, '2026-01-01', '2026-12-31', 500, 156, 1),
  ('novidade10', 'NOVIDADE10', 'percentage', 10, 50, 50, '2026-01-01', '2026-12-31', 250, 90, 2)
on conflict (id) do nothing;
