create table if not exists public.orders (
  id text primary key,
  customer jsonb not null,
  items jsonb not null,
  coupon jsonb,
  status text not null default 'unpaid',
  total numeric(10, 2) not null default 0,
  preference_id text,
  payment_id text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists orders_status_idx on public.orders (status);
create index if not exists orders_created_at_idx on public.orders (created_at desc);

alter table public.orders
  add column if not exists coupon jsonb;
