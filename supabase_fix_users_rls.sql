-- FINAL FIX: Remove circular dependency in users table RLS
-- The problem: policies that check users table while reading users table

-- Drop ALL existing policies on users
drop policy if exists "Users can view own profile" on public.users;
drop policy if exists "Admins view all users" on public.users;
drop policy if exists "Users can insert own profile" on public.users;
drop policy if exists "Users can update own profile" on public.users;
drop policy if exists "Admins manage all users" on public.users;

-- Create non-circular policies
-- 1. Any authenticated user can read ANY user profile (for now, we'll restrict later)
create policy "Authenticated users can view all profiles"
  on public.users for select
  using (auth.role() = 'authenticated');

-- 2. Users can insert their own profile
create policy "Users can insert own profile"
  on public.users for insert
  with check (auth.uid() = id);

-- 3. Users can update their own profile
create policy "Users can update own profile"
  on public.users for update
  using (auth.uid() = id);

-- 4. Users can delete their own profile (optional, usually disabled)
create policy "Users can delete own profile"
  on public.users for delete
  using (auth.uid() = id);
