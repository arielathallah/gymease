-- GymEase Supabase Database Migration Schema
-- Run this in your Supabase SQL Editor.

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- 1. PROFILES TABLE (Linked to auth.users)
create table public.profiles (
  id uuid references auth.users on delete cascade primary key,
  role text not null default 'customer' check (role in ('customer', 'admin')),
  full_name text,
  avatar_url text,
  phone text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS for profiles
alter table public.profiles enable row level security;

-- Profiles Policies
create policy "Allow public read access to profiles" on public.profiles for
select using (true);

create policy "Allow users to update their own profile" on public.profiles for
update using (auth.uid () = id);

-- Trigger to automatically create profile on sign up
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
  );
  return new;
end;
$$ language plpgsql security definer;

create or replace trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- 2. GYMS TABLE
create table public.gyms (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  description text,
  address text not null,
  latitude numeric not null,
  longitude numeric not null,
  operating_hours text not null default '06:00 - 22:00',
  facilities text[] not null default '{}'::text[],
  status text not null default 'active' check (status in ('active', 'inactive')),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.gyms enable row level security;

create policy "Allow public read access to active gyms" on public.gyms for
select using (
        status = 'active'
        or exists (
            select 1
            from public.profiles
            where
                id = auth.uid ()
                and role = 'admin'
        )
    );

create policy "Allow admin write access to gyms" on public.gyms for all using (
    exists (
        select 1
        from public.profiles
        where
            id = auth.uid ()
            and role = 'admin'
    )
);

-- 3. GALLERY TABLE (Gym photos)
create table public.gallery (
  id uuid default gen_random_uuid() primary key,
  gym_id uuid references public.gyms(id) on delete cascade not null,
  image_url text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.gallery enable row level security;

create policy "Allow public read access to gallery" on public.gallery for
select using (true);

create policy "Allow admin write access to gallery" on public.gallery for all using (
    exists (
        select 1
        from public.profiles
        where
            id = auth.uid ()
            and role = 'admin'
    )
);

-- 4. GYM PACKAGES TABLE
create table public.gym_packages (
  id uuid default gen_random_uuid() primary key,
  gym_id uuid references public.gyms(id) on delete cascade not null,
  name text not null,
  price numeric not null,
  duration text not null, -- e.g., 'daily', 'weekly', 'monthly', 'corporate'
  benefits text[] not null default '{}'::text[],
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.gym_packages enable row level security;

create policy "Allow public read access to packages" on public.gym_packages for
select using (true);

create policy "Allow admin write access to packages" on public.gym_packages for all using (
    exists (
        select 1
        from public.profiles
        where
            id = auth.uid ()
            and role = 'admin'
    )
);

-- 5. RENTAL PRODUCTS TABLE
create table public.products (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  description text,
  category text not null check (category in ('shirt', 'shorts', 'towel', 'locker')),
  price numeric not null,
  stock integer not null default 0,
  photo_url text not null,
  status text not null default 'active' check (status in ('active', 'inactive')),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.products enable row level security;

create policy "Allow public read access to active products" on public.products for
select using (
        status = 'active'
        or exists (
            select 1
            from public.profiles
            where
                id = auth.uid ()
                and role = 'admin'
        )
    );

create policy "Allow admin write access to products" on public.products for all using (
    exists (
        select 1
        from public.profiles
        where
            id = auth.uid ()
            and role = 'admin'
    )
);

-- 6. PRODUCT SIZES TABLE
create table public.product_sizes (
  id uuid default gen_random_uuid() primary key,
  product_id uuid references public.products(id) on delete cascade not null,
  size text not null check (size in ('XS', 'S', 'M', 'L', 'XL', 'XXL')),
  stock integer not null default 0,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique (product_id, size)
);

alter table public.product_sizes enable row level security;

create policy "Allow public read access to product sizes" on public.product_sizes for
select using (true);

create policy "Allow admin write access to product sizes" on public.product_sizes for all using (
    exists (
        select 1
        from public.profiles
        where
            id = auth.uid ()
            and role = 'admin'
    )
);

-- 7. BOOKINGS TABLE
create table public.bookings (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  gym_id uuid references public.gyms(id) on delete cascade not null,
  package_id uuid references public.gym_packages(id) on delete cascade not null,
  booking_date date not null,
  booking_time time not null,
  laundry_option boolean not null default false,
  subtotal numeric not null,
  tax numeric not null,
  grand_total numeric not null,
  status text not null default 'pending' check (status in ('pending', 'confirmed', 'checked_in', 'workout', 'laundry', 'completed', 'cancelled')),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.bookings enable row level security;

create policy "Allow users to view their own bookings" on public.bookings for
select using (
        auth.uid () = user_id
        or exists (
            select 1
            from public.profiles
            where
                id = auth.uid ()
                and role = 'admin'
        )
    );

create policy "Allow users to create bookings" on public.bookings for
insert
with
    check (auth.uid () = user_id);

create policy "Allow users to update/cancel their bookings or admins to update" on public.bookings for
update using (
    auth.uid () = user_id
    or exists (
        select 1
        from public.profiles
        where
            id = auth.uid ()
            and role = 'admin'
    )
);

-- 8. BOOKING ITEMS TABLE (Rental items tied to bookings)
create table public.booking_items (
  id uuid default gen_random_uuid() primary key,
  booking_id uuid references public.bookings(id) on delete cascade not null,
  product_id uuid references public.products(id) on delete cascade not null,
  size text, -- XS, S, M, L, XL, XXL (null for towel/locker)
  quantity integer not null default 1,
  price numeric not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.booking_items enable row level security;

create policy "Allow users to view their booking items" on public.booking_items for
select using (
        exists (
            select 1
            from public.bookings
            where
                id = booking_id
                and (
                    user_id = auth.uid ()
                    or exists (
                        select 1
                        from public.profiles
                        where
                            id = auth.uid ()
                            and role = 'admin'
                    )
                )
        )
    );

create policy "Allow users to insert booking items" on public.booking_items for
insert
with
    check (
        exists (
            select 1
            from public.bookings
            where
                id = booking_id
                and user_id = auth.uid ()
        )
    );

-- 9. PAYMENTS TABLE
create table public.payments (
  id uuid default gen_random_uuid() primary key,
  booking_id uuid references public.bookings(id) on delete cascade not null,
  payment_method text not null check (payment_method in ('qris', 'bank_transfer', 'e_wallet')),
  status text not null default 'pending' check (status in ('pending', 'paid', 'rejected', 'refunded')),
  payment_proof_url text,
  amount numeric not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.payments enable row level security;

create policy "Allow users to view their own payments" on public.payments for
select using (
        exists (
            select 1
            from public.bookings
            where
                id = booking_id
                and (
                    user_id = auth.uid ()
                    or exists (
                        select 1
                        from public.profiles
                        where
                            id = auth.uid ()
                            and role = 'admin'
                    )
                )
        )
    );

create policy "Allow users to create payments" on public.payments for
insert
with
    check (
        exists (
            select 1
            from public.bookings
            where
                id = booking_id
                and user_id = auth.uid ()
        )
    );

create policy "Allow admin to update payments" on public.payments for
update using (
    exists (
        select 1
        from public.profiles
        where
            id = auth.uid ()
            and role = 'admin'
    )
);

-- 10. REVIEWS TABLE
create table public.reviews (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  gym_id uuid references public.gyms(id) on delete cascade not null,
  rating integer not null check (rating >= 1 and rating <= 5),
  comment text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique (user_id, gym_id)
);

alter table public.reviews enable row level security;

create policy "Allow public read access to reviews" on public.reviews for
select using (true);

create policy "Allow users to create their own review" on public.reviews for
insert
with
    check (auth.uid () = user_id);

create policy "Allow users to edit/delete their own review" on public.reviews for all using (
    auth.uid () = user_id
    or exists (
        select 1
        from public.profiles
        where
            id = auth.uid ()
            and role = 'admin'
    )
);

-- 11. NOTIFICATIONS TABLE
create table public.notifications (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  title text not null,
  message text not null,
  is_read boolean not null default false,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.notifications enable row level security;

create policy "Allow users to read their own notifications" on public.notifications for
select using (auth.uid () = user_id);

create policy "Allow users or admins to update notifications" on public.notifications for
update using (
    auth.uid () = user_id
    or exists (
        select 1
        from public.profiles
        where
            id = auth.uid ()
            and role = 'admin'
    )
);

create policy "Allow system/admins to insert notifications" on public.notifications for
insert
with
    check (true);

-- 12. FAQ TABLE
create table public.faq (
  id uuid default gen_random_uuid() primary key,
  question text not null,
  answer text not null,
  order_num integer not null default 0,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.faq enable row level security;

create policy "Allow public read access to FAQs" on public.faq for
select using (true);

create policy "Allow admin write access to FAQs" on public.faq for all using (
    exists (
        select 1
        from public.profiles
        where
            id = auth.uid ()
            and role = 'admin'
    )
);

-- INDEXES FOR PERFORMANCE
create index idx_gyms_status on public.gyms (status);

create index idx_gym_packages_gym_id on public.gym_packages (gym_id);

create index idx_products_category on public.products (category);

create index idx_product_sizes_product_id on public.product_sizes (product_id);

create index idx_bookings_user_id on public.bookings (user_id);

create index idx_bookings_gym_id on public.bookings (gym_id);

create index idx_bookings_status on public.bookings (status);

create index idx_booking_items_booking_id on public.booking_items (booking_id);

create index idx_payments_booking_id on public.payments (booking_id);

create index idx_reviews_gym_id on public.reviews (gym_id);

create index idx_notifications_user_id_read on public.notifications (user_id, is_read);

-- Additional tables requested for Supabase compatibility
create table if not exists public.activity_logs (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles(id) on delete set null,
  activity_type text not null,
  description text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

create table if not exists public.admins (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles(id) on delete cascade,
  name text,
  email text,
  role text default 'admin',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

create table if not exists public.audit_logs (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles(id) on delete set null,
  action text not null,
  details jsonb,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

create table if not exists public.banners (
  id uuid default gen_random_uuid() primary key,
  title text,
  image_url text,
  link_url text,
  is_active boolean default true,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

create table if not exists public.branches (
  id uuid default gen_random_uuid() primary key,
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
  status text default 'active' check (status in ('active', 'inactive')),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

create table if not exists public.categories (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  slug text unique,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

create table if not exists public.favorites (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  gym_id uuid references public.gyms(id) on delete cascade not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique (user_id, gym_id)
);

create table if not exists public.order_items (
  id uuid default gen_random_uuid() primary key,
  order_id uuid references public.orders(id) on delete cascade not null,
  product_id uuid references public.products(id) on delete cascade not null,
  quantity integer not null default 1,
  unit_price numeric not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

create table if not exists public.orders (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  order_number text not null unique,
  total_amount numeric not null,
  status text default 'pending',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

create table if not exists public.promo_codes (
  id uuid default gen_random_uuid() primary key,
  code text not null unique,
  discount_percentage numeric default 0,
  discount_amount numeric default 0,
  min_spend numeric default 0,
  max_discount numeric default 0,
  status text default 'active',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

create table if not exists public.reports (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles(id) on delete set null,
  report_type text,
  title text,
  details text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

create table if not exists public.roles (
  id uuid default gen_random_uuid() primary key,
  name text not null unique,
  permissions jsonb default '[]'::jsonb,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

create table if not exists public.rentals (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  description text,
  price numeric not null,
  stock integer not null default 0,
  image_url text,
  status text default 'active',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

create table if not exists public.users (
  id uuid default gen_random_uuid() primary key,
  email text not null unique,
  full_name text,
  role text default 'customer',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);