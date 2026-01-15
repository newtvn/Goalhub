-- FIX: Simplified RLS Policies (No Circular Dependencies)
-- Run this to make public tables actually public

-- TURFS
drop policy if exists "Turfs viewable by everyone" on public.turfs;
drop policy if exists "Admins manage turfs" on public.turfs;

create policy "Anyone can view turfs"
  on public.turfs for select
  using (true);

create policy "Authenticated users manage turfs"
  on public.turfs for all
  using (auth.role() = 'authenticated');

-- EVENTS
drop policy if exists "Events viewable by everyone" on public.events;
drop policy if exists "Admins manage events" on public.events;

create policy "Anyone can view events"
  on public.events for select
  using (true);

create policy "Authenticated users manage events"
  on public.events for all
  using (auth.role() = 'authenticated');

-- EXTRAS
drop policy if exists "Extras viewable by everyone" on public.extras;
drop policy if exists "Admins manage extras" on public.extras;

create policy "Anyone can view extras"
  on public.extras for select
  using (true);

create policy "Authenticated users manage extras"
  on public.extras for all
  using (auth.role() = 'authenticated');

-- SETTINGS
drop policy if exists "Settings viewable by everyone" on public.settings;
drop policy if exists "Admins manage settings" on public.settings;

create policy "Anyone can view settings"
  on public.settings for select
  using (true);

create policy "Authenticated users manage settings"
  on public.settings for all
  using (auth.role() = 'authenticated');

-- BOOKINGS
drop policy if exists "Users view own bookings" on public.bookings;
drop policy if exists "Admins view all bookings" on public.bookings;
drop policy if exists "Admins manage bookings" on public.bookings;

create policy "Anyone can view bookings"
  on public.bookings for select
  using (true);

create policy "Authenticated users create bookings"
  on public.bookings for insert
  with check (auth.role() = 'authenticated');

create policy "Authenticated users manage bookings"
  on public.bookings for all
  using (auth.role() = 'authenticated');

-- TRANSACTIONS
drop policy if exists "Admins view transactions" on public.transactions;
drop policy if exists "Admins manage transactions" on public.transactions;

create policy "Authenticated users view transactions"
  on public.transactions for select
  using (auth.role() = 'authenticated');

create policy "Authenticated users manage transactions"
  on public.transactions for all
  using (auth.role() = 'authenticated');

-- NOTIFICATIONS
drop policy if exists "Admins view all notifications" on public.notifications;
drop policy if exists "Users view own notifications" on public.notifications;

create policy "Authenticated users view notifications"
  on public.notifications for select
  using (auth.role() = 'authenticated');

create policy "Authenticated users manage notifications"
  on public.notifications for all
  using (auth.role() = 'authenticated');
