create table if not exists public.customers (
  id text primary key,
  auth_user_id text unique,
  name text,
  email text unique,
  whatsapp text,
  cpf text,
  cep text,
  street text,
  number text,
  complement text,
  neighborhood text,
  city text,
  state text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.customer_carts (
  customer_id text primary key references public.customers(id) on delete cascade,
  items jsonb not null default '[]'::jsonb,
  coupon jsonb,
  updated_at timestamptz not null default now()
);

create table if not exists public.customer_favorites (
  customer_id text primary key references public.customers(id) on delete cascade,
  products jsonb not null default '[]'::jsonb,
  updated_at timestamptz not null default now()
);

alter table public.orders
  add column if not exists customer_id text;

alter table public.orders
  add column if not exists auth_user_id text;

create index if not exists customers_auth_user_id_idx on public.customers (auth_user_id);
create index if not exists customers_email_idx on public.customers (email);
create index if not exists orders_customer_id_idx on public.orders (customer_id);
create index if not exists orders_auth_user_id_idx on public.orders (auth_user_id);
