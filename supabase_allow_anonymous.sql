-- FINAL FIX: Make public data truly public (readable by anonymous users)

-- TURFS
drop policy if exists "Anyone can view turfs" on public.turfs;
drop policy if exists "Authenticated users manage turfs" on public.turfs;

create policy "Public can view turfs"
  on public.turfs for select
  using (true);  -- No auth check, truly public

create policy "Authenticated users manage turfs"
  on public.turfs for all
  using (auth.role() = 'authenticated');

-- EVENTS  
drop policy if exists "Anyone can view events" on public.events;
drop policy if exists "Authenticated users manage events" on public.events;

create policy "Public can view events"
  on public.events for select
  using (true);

create policy "Authenticated users manage events"
  on public.events for all
  using (auth.role() = 'authenticated');

-- EXTRAS
drop policy if exists "Anyone can view extras" on public.extras;
drop policy if exists "Authenticated users manage extras" on public.extras;

create policy "Public can view extras"
  on public.extras for select
  using (true);

create policy "Authenticated users manage extras"
  on public.extras for all
  using (auth.role() = 'authenticated');

-- SETTINGS
drop policy if exists "Anyone can view settings" on public.settings;
drop policy if exists "Authenticated users manage settings" on public.settings;

create policy "Public can view settings"
  on public.settings for select
  using (true);

create policy "Authenticated users manage settings"
  on public.settings for all
  using (auth.role() = 'authenticated');

-- BOOKINGS (also make viewable by public for booking page availability)
drop policy if exists "Anyone can view bookings" on public.bookings;
drop policy if exists "Authenticated users create bookings" on public.bookings;
drop policy if exists "Authenticated users manage bookings" on public.bookings;

create policy "Public can view bookings"
  on public.bookings for select
  using (true);

create policy "Authenticated users manage bookings"
  on public.bookings for all
  using (auth.role() = 'authenticated');
