-- GymEase Supabase schema for all requested tables
-- Paste into Supabase SQL Editor

create extension if not exists "uuid-ossp";

create table if not exists public.profiles (
    id uuid primary key references auth.users (id) on delete cascade,
    role text not null default 'customer' check (role in ('customer', 'admin')),
    full_name text,
    avatar_url text,
    phone text,
    created_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

do $$
begin
  if not exists (
    select 1 from pg_policies
    where schemaname = 'public' and tablename = 'profiles' and policyname = 'profiles_read'
  ) then
    create policy profiles_read on public.profiles for select using (true);
  end if;

  if not exists (
    select 1 from pg_policies
    where schemaname = 'public' and tablename = 'profiles' and policyname = 'profiles_update_self'
  ) then
    create policy profiles_update_self on public.profiles for update using (auth.uid() = id);
  end if;
end
$$;

create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, role, full_name, avatar_url, phone)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'role', 'customer'),
    coalesce(new.raw_user_meta_data->>'full_name', 'GymEase User'),
    new.raw_user_meta_data->>'avatar_url',
    new.raw_user_meta_data->>'phone'
  )
  on conflict (id) do nothing;
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists on_auth_user_created on auth.users;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

create table if not exists public.admins (
    id uuid primary key default gen_random_uuid (),
    user_id uuid references public.profiles (id) on delete cascade,
    name text,
    email text,
    role text default 'admin',
    created_at timestamptz not null default now()
);

create table if not exists public.roles (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  permissions jsonb default '[]'::jsonb,
  created_at timestamptz not null default now()
);

create table if not exists public.branches (
    id uuid primary key default gen_random_uuid (),
    name text not null,
    code text,
    address text,
    city text,
    province text,
    latitude numeric,
    longitude numeric,
    google_maps_url text,
    opening_hours text,
    closing_hours text,
    phone text,
    email text,
    image_url text,
    description text,
    status text default 'active' check (
        status in ('active', 'inactive')
    ),
    created_at timestamptz not null default now()
);

create table if not exists public.gyms (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  description text,
  address text not null,
  latitude numeric not null,
  longitude numeric not null,
  operating_hours text not null default '06:00 - 22:00',
  facilities text[] not null default '{}'::text[],
  status text not null default 'active' check (status in ('active','inactive')),
  created_at timestamptz not null default now()
);

create table if not exists public.gym_images (
    id uuid primary key default gen_random_uuid (),
    gym_id uuid references public.gyms (id) on delete cascade not null,
    image_url text not null,
    created_at timestamptz not null default now()
);

create table if not exists public.gym_packages (
  id uuid primary key default gen_random_uuid(),
  gym_id uuid references public.gyms(id) on delete cascade not null,
  name text not null,
  price numeric not null,
  duration text not null,
  benefits text[] not null default '{}'::text[],
  created_at timestamptz not null default now()
);

create table if not exists public.categories (
    id uuid primary key default gen_random_uuid (),
    name text not null,
    slug text unique,
    created_at timestamptz not null default now()
);

create table if not exists public.products (
    id uuid primary key default gen_random_uuid (),
    name text not null,
    description text,
    category text not null,
    price numeric not null,
    stock integer not null default 0,
    photo_url text not null,
    status text not null default 'active' check (
        status in ('active', 'inactive')
    ),
    created_at timestamptz not null default now()
);

create table if not exists public.product_images (
    id uuid primary key default gen_random_uuid (),
    product_id uuid references public.products (id) on delete cascade not null,
    image_url text not null,
    created_at timestamptz not null default now()
);

create table if not exists public.rental_sizes (
    id uuid primary key default gen_random_uuid (),
    product_id uuid references public.products (id) on delete cascade not null,
    size text not null check (
        size in (
            'XS',
            'S',
            'M',
            'L',
            'XL',
            'XXL'
        )
    ),
    stock integer not null default 0,
    created_at timestamptz not null default now(),
    unique (product_id, size)
);

create table if not exists public.rentals (
    id uuid primary key default gen_random_uuid (),
    name text not null,
    description text,
    price numeric not null,
    stock integer not null default 0,
    image_url text,
    status text default 'active',
    created_at timestamptz not null default now()
);

create table if not exists public.bookings (
    id uuid primary key default gen_random_uuid (),
    user_id uuid references public.profiles (id) on delete cascade not null,
    gym_id uuid references public.gyms (id) on delete cascade not null,
    package_id uuid references public.gym_packages (id) on delete cascade not null,
    booking_date date not null,
    booking_time time not null,
    laundry_option boolean not null default false,
    subtotal numeric not null,
    tax numeric not null,
    grand_total numeric not null,
    status text not null default 'pending' check (
        status in (
            'pending',
            'confirmed',
            'checked_in',
            'workout',
            'laundry',
            'completed',
            'cancelled'
        )
    ),
    created_at timestamptz not null default now()
);

create table if not exists public.booking_items (
    id uuid primary key default gen_random_uuid (),
    booking_id uuid references public.bookings (id) on delete cascade not null,
    product_id uuid references public.products (id) on delete cascade not null,
    size text,
    quantity integer not null default 1,
    price numeric not null,
    created_at timestamptz not null default now()
);

create table if not exists public.payments (
    id uuid primary key default gen_random_uuid (),
    booking_id uuid references public.bookings (id) on delete cascade not null,
    payment_method text not null check (
        payment_method in (
            'qris',
            'bank_transfer',
            'e_wallet'
        )
    ),
    status text not null default 'pending' check (
        status in (
            'pending',
            'paid',
            'rejected',
            'refunded'
        )
    ),
    payment_proof_url text,
    amount numeric not null,
    created_at timestamptz not null default now()
);

create table if not exists public.orders (
    id uuid primary key default gen_random_uuid (),
    user_id uuid references public.profiles (id) on delete cascade not null,
    order_number text not null unique,
    total_amount numeric not null,
    status text default 'pending',
    created_at timestamptz not null default now()
);

create table if not exists public.order_items (
    id uuid primary key default gen_random_uuid (),
    order_id uuid references public.orders (id) on delete cascade not null,
    product_id uuid references public.products (id) on delete cascade not null,
    quantity integer not null default 1,
    unit_price numeric not null,
    created_at timestamptz not null default now()
);

create table if not exists public.reviews (
    id uuid primary key default gen_random_uuid (),
    user_id uuid references public.profiles (id) on delete cascade not null,
    gym_id uuid references public.gyms (id) on delete cascade not null,
    rating integer not null check (
        rating >= 1
        and rating <= 5
    ),
    comment text,
    created_at timestamptz not null default now(),
    unique (user_id, gym_id)
);

create table if not exists public.notifications (
    id uuid primary key default gen_random_uuid (),
    user_id uuid references public.profiles (id) on delete cascade not null,
    title text not null,
    message text not null,
    is_read boolean not null default false,
    created_at timestamptz not null default now()
);

create table if not exists public.faq (
    id uuid primary key default gen_random_uuid (),
    question text not null,
    answer text not null,
    order_num integer not null default 0,
    created_at timestamptz not null default now()
);

create table if not exists public.favorites (
    id uuid primary key default gen_random_uuid (),
    user_id uuid references public.profiles (id) on delete cascade not null,
    gym_id uuid references public.gyms (id) on delete cascade not null,
    created_at timestamptz not null default now(),
    unique (user_id, gym_id)
);

create table if not exists public.promo_codes (
    id uuid primary key default gen_random_uuid (),
    code text not null unique,
    discount_percentage numeric default 0,
    discount_amount numeric default 0,
    min_spend numeric default 0,
    max_discount numeric default 0,
    status text default 'active',
    created_at timestamptz not null default now()
);

create table if not exists public.banners (
    id uuid primary key default gen_random_uuid (),
    title text,
    image_url text,
    link_url text,
    is_active boolean default true,
    created_at timestamptz not null default now()
);

create table if not exists public.audit_logs (
    id uuid primary key default gen_random_uuid (),
    user_id uuid references public.profiles (id) on delete set null,
    action text not null,
    details jsonb,
    created_at timestamptz not null default now()
);

create table if not exists public.activity_logs (
    id uuid primary key default gen_random_uuid (),
    user_id uuid references public.profiles (id) on delete set null,
    activity_type text not null,
    description text,
    created_at timestamptz not null default now()
);

create table if not exists public.reports (
    id uuid primary key default gen_random_uuid (),
    user_id uuid references public.profiles (id) on delete set null,
    report_type text,
    title text,
    details text,
    created_at timestamptz not null default now()
);

create table if not exists public.users (
    id uuid primary key default gen_random_uuid (),
    email text not null unique,
    full_name text,
    role text default 'customer',
    created_at timestamptz not null default now()
);

create index if not exists idx_gyms_status on public.gyms (status);

create index if not exists idx_gym_packages_gym_id on public.gym_packages (gym_id);

create index if not exists idx_products_category on public.products (category);

create index if not exists idx_product_sizes_product_id on public.rental_sizes (product_id);

create index if not exists idx_bookings_user_id on public.bookings (user_id);

create index if not exists idx_bookings_gym_id on public.bookings (gym_id);

create index if not exists idx_bookings_status on public.bookings (status);

create index if not exists idx_booking_items_booking_id on public.booking_items (booking_id);

create index if not exists idx_payments_booking_id on public.payments (booking_id);

create index if not exists idx_reviews_gym_id on public.reviews (gym_id);

create index if not exists idx_notifications_user_id_read on public.notifications (user_id, is_read);