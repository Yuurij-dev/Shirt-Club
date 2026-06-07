create table if not exists public.orders (
  id text primary key,
  customer jsonb not null,
  items jsonb not null,
  coupon jsonb,
  status text not null default 'unpaid',
  delivery_status text not null default 'not_separated',
  total numeric(10, 2) not null default 0,
  preference_id text,
  payment_id text,
  paid_notified_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.orders
  add column if not exists coupon jsonb;

alter table public.orders
  add column if not exists delivery_status text not null default 'not_separated';

alter table public.orders
  add column if not exists paid_notified_at timestamptz;

create index if not exists orders_status_idx on public.orders (status);
create index if not exists orders_delivery_status_idx on public.orders (delivery_status);
create index if not exists orders_paid_notified_at_idx on public.orders (paid_notified_at);
create index if not exists orders_created_at_idx on public.orders (created_at desc);
