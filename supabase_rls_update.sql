-- Updated RLS Policies for Users Table
-- This allows authenticated users to insert their own profile

-- Drop existing policies
drop policy if exists "Users can view own data" on public.users;
drop policy if exists "Admins view all users" on public.users;
drop policy if exists "Admins manage users" on public.users;

-- Recreate with proper permissions
create policy "Users can view own profile"
  on public.users for select
  using (auth.uid() = id);

create policy "Admins view all users"
  on public.users for select
  using (
    exists (
      select 1 from public.users
      where id = auth.uid() and role = 'admin'
    )
  );

create policy "Users can insert own profile"
  on public.users for insert
  with check (auth.uid() = id);

create policy "Users can update own profile"
  on public.users for update
  using (auth.uid() = id);

create policy "Admins manage all users"
  on public.users for all
  using (
    exists (
      select 1 from public.users
      where id = auth.uid() and role = 'admin'
    )
  );
