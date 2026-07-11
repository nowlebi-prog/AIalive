-- =========================================================
-- Clover Desk — Sprint 5 migration
-- Adds email/password signup with phone-number duplicate checking.
-- Run once in the Supabase SQL editor, after schema.sql + rls.sql +
-- schema_sprint2.sql + schema_sprint4.sql
-- =========================================================

-- Store a normalized (digits-only) phone number, unique per account.
alter table profiles add column if not exists phone text unique;

-- ---------------------------------------------------------------
-- Update the auto-profile-creation trigger to also capture phone
-- (passed via supabase.auth.signUp({ options: { data: { phone } } }))
-- and to default provider detection to 'email' for password signups.
-- ---------------------------------------------------------------
create or replace function handle_new_user()
returns trigger as $$
declare
  new_profile_id uuid;
begin
  insert into profiles (id, email, nickname, avatar_url, provider, phone, growth_points)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'name', new.raw_user_meta_data->>'nickname', '클로버 씨'),
    new.raw_user_meta_data->>'avatar_url',
    coalesce(new.raw_app_meta_data->>'provider', 'email'),
    new.raw_user_meta_data->>'phone',
    100
  )
  returning id into new_profile_id;

  insert into growth_logs (user_id, action_type, points, description)
  values (new_profile_id, 'signup', 100, '첫 가입을 축하해요!');

  return new;
end;
$$ language plpgsql security definer set search_path = public;

drop trigger if exists trg_handle_new_user on auth.users;
create trigger trg_handle_new_user
after insert on auth.users
for each row execute function handle_new_user();

-- ---------------------------------------------------------------
-- Public, safe "does this phone already exist?" check so the signup
-- form can block duplicates BEFORE calling auth.signUp(), without
-- exposing any profile data to anonymous clients.
-- ---------------------------------------------------------------
create or replace function check_phone_exists(p_phone text)
returns boolean as $$
  select exists (select 1 from profiles where phone = p_phone);
$$ language sql security definer set search_path = public stable;

grant execute on function check_phone_exists(text) to anon, authenticated;
