-- 9. USER TRIGGERS (Auto-sync Auth -> Public)

-- Function to handle new user signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.users (id, email, display_name, role, avatar_url)
  values (
    new.id,
    new.email,
    new.raw_user_meta_data->>'full_name', -- Extract name from metadata (Google)
    'user', -- Default role
    new.raw_user_meta_data->>'avatar_url' -- Extract avatar from metadata (Google)
  )
  on conflict (id) do nothing; -- Prevent errors if manually created
  return new;
end;
$$ language plpgsql security definer;

-- Trigger to call the function on new auth.users entry
create or replace trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
