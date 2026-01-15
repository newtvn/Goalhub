-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- 1. USERS TABLE
create table public.users (
  id uuid references auth.users not null primary key, -- Links to Supabase Auth
  email text unique,
  display_name text,
  role text default 'user', -- 'user', 'admin', 'manager'
  phone text,
  photo_url text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS (Row Level Security)
alter table public.users enable row level security;

-- Policies for Users
create policy "Public profiles are viewable by everyone" on public.users
  for select using (true);

create policy "Users can update their own profile" on public.users
  for update using (auth.uid() = id);

-- 2. TURFS TABLE
create table public.turfs (
  id uuid default uuid_generate_v4() primary key,
  name text not null,
  price numeric not null,
  location text,
  image_url text,
  amenities text[], -- Array of strings
  available boolean default true,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.turfs enable row level security;
create policy "Turfs are viewable by everyone" on public.turfs for select using (true);
create policy "Only admins can modify turfs" on public.turfs for all using (
  exists (select 1 from public.users where id = auth.uid() and role = 'admin')
);

-- 3. BOOKINGS TABLE
create table public.bookings (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.users(id),
  turf_id uuid references public.turfs(id),
  turf_name text, -- De-normalized for easier display if needed
  date date not null,
  time text not null, -- "14:00"
  duration integer default 1,
  customer_name text,
  customer_email text,
  customer_phone text,
  amount numeric not null,
  payment_status text default 'pending', -- 'pending', 'completed', 'failed'
  booking_status text default 'confirmed', -- 'confirmed', 'cancelled'
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.bookings enable row level security;
create policy "Users can view their own bookings" on public.bookings for select using (
  auth.uid() = user_id
);
create policy "Admins View All Bookings" on public.bookings for select using (
  exists (select 1 from public.users where id = auth.uid() and role in ('admin', 'manager'))
);
create policy "Users can create bookings" on public.bookings for insert with check (auth.uid() = user_id);

-- 4. TRANSACTIONS TABLE (M-Pesa)
create table public.transactions (
  id uuid default uuid_generate_v4() primary key,
  checkout_request_id text unique,
  merchant_request_id text,
  phone text,
  amount numeric,
  status text default 'pending', -- 'pending', 'completed', 'failed'
  receipt_number text,
  booking_id uuid references public.bookings(id),
  user_id uuid references public.users(id),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now())
);

alter table public.transactions enable row level security;
create policy "Users view own transactions" on public.transactions for select using (auth.uid() = user_id);

-- 5. EVENTS TABLE
create table public.events (
  id uuid default uuid_generate_v4() primary key,
  title text not null,
  date date not null,
  time text,
  image_url text,
  description text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.events enable row level security;
create policy "Events viewable by everyone" on public.events for select using (true);
create policy "Admins manage events" on public.events for all using (
  exists (select 1 from public.users where id = auth.uid() and role = 'admin')
);

-- SEED DATA (Optional)
insert into public.turfs (name, price, available) values 
('Turf A (Main)', 2500, true),
('Turf B (Arena)', 2000, true),
('Turf C (Training)', 1500, true);
