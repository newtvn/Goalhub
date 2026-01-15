-- 6. EXTRAS TABLE (Add-ons)
create table public.extras (
  id uuid default uuid_generate_v4() primary key,
  name text not null,
  price numeric not null,
  icon text, -- 'Water', 'Shirt', 'User', etc.
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.extras enable row level security;
create policy "Extras viewable by everyone" on public.extras for select using (true);
create policy "Admins manage extras" on public.extras for all using (
  exists (select 1 from public.users where id = auth.uid() and role = 'admin')
);

-- Seed Extras
insert into public.extras (name, price, icon) values 
('Referee', 1000, 'User'),
('Water (Box)', 500, 'Droplet'),
('Bibs', 200, 'Shirt'),
('Photography', 1500, 'Camera');


-- 7. SETTINGS TABLE (Global Config)
create table public.settings (
  key text primary key, -- e.g., 'global'
  global_discount numeric default 0,
  maintenance_mode boolean default false,
  updated_at timestamp with time zone default timezone('utc'::text, now())
);

alter table public.settings enable row level security;
create policy "Settings viewable by everyone" on public.settings for select using (true);
create policy "Admins manage settings" on public.settings for all using (
  exists (select 1 from public.users where id = auth.uid() and role = 'admin')
);

-- Seed Settings
insert into public.settings (key, global_discount) values ('global', 0);


-- 8. NOTIFICATIONS TABLE
create table public.notifications (
  id uuid default uuid_generate_v4() primary key,
  title text not null,
  message text,
  type text default 'info', -- 'info', 'success', 'warning'
  user_id uuid references public.users(id), -- Optional: if specific to user
  is_global boolean default false, -- If true, shown to all admins/users
  read boolean default false,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.notifications enable row level security;
create policy "Admins view all notifications" on public.notifications for select using (
  exists (select 1 from public.users where id = auth.uid() and role in ('admin', 'manager'))
);
create policy "Users view own notifications" on public.notifications for select using (
  auth.uid() = user_id
);
