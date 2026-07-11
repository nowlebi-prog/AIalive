-- =========================================================
-- Clover Desk — Row Level Security policies
-- Run after schema.sql
-- =========================================================

alter table profiles enable row level security;
alter table clover_diagnoses enable row level security;
alter table clover_mailbox enable row level security;
alter table recipes enable row level security;
alter table recipe_steps enable row level security;
alter table bookmarks enable row level security;
alter table hearts enable row level security;
alter table public_results enable row level security;
alter table growth_logs enable row level security;

-- ---------- profiles ----------
drop policy if exists "profiles_select_own" on profiles;
create policy "profiles_select_own" on profiles
  for select using (auth.uid() = id);

drop policy if exists "profiles_select_admin" on profiles;
create policy "profiles_select_admin" on profiles
  for select using (
    exists (select 1 from profiles p where p.id = auth.uid() and p.role = 'admin')
  );

drop policy if exists "profiles_update_own" on profiles;
create policy "profiles_update_own" on profiles
  for update using (auth.uid() = id);

drop policy if exists "profiles_update_admin" on profiles;
create policy "profiles_update_admin" on profiles
  for update using (
    exists (select 1 from profiles p where p.id = auth.uid() and p.role = 'admin')
  );

-- ---------- clover_diagnoses ----------
drop policy if exists "diagnoses_select_own" on clover_diagnoses;
create policy "diagnoses_select_own" on clover_diagnoses
  for select using (auth.uid() = user_id);

drop policy if exists "diagnoses_insert_any" on clover_diagnoses;
create policy "diagnoses_insert_any" on clover_diagnoses
  for insert with check (user_id is null or auth.uid() = user_id);

drop policy if exists "diagnoses_admin_all" on clover_diagnoses;
create policy "diagnoses_admin_all" on clover_diagnoses
  for all using (
    exists (select 1 from profiles p where p.id = auth.uid() and p.role = 'admin')
  );

-- ---------- clover_mailbox ----------
drop policy if exists "mailbox_select_own" on clover_mailbox;
create policy "mailbox_select_own" on clover_mailbox
  for select using (auth.uid() = user_id);

drop policy if exists "mailbox_insert_own" on clover_mailbox;
create policy "mailbox_insert_own" on clover_mailbox
  for insert with check (auth.uid() = user_id);

drop policy if exists "mailbox_admin_all" on clover_mailbox;
create policy "mailbox_admin_all" on clover_mailbox
  for all using (
    exists (select 1 from profiles p where p.id = auth.uid() and p.role = 'admin')
  );

-- ---------- recipes ----------
drop policy if exists "recipes_select_public" on recipes;
create policy "recipes_select_public" on recipes
  for select using (is_public = true);

drop policy if exists "recipes_admin_all" on recipes;
create policy "recipes_admin_all" on recipes
  for all using (
    exists (select 1 from profiles p where p.id = auth.uid() and p.role = 'admin')
  );

-- ---------- recipe_steps ----------
drop policy if exists "steps_select_public" on recipe_steps;
create policy "steps_select_public" on recipe_steps
  for select using (
    exists (select 1 from recipes r where r.id = recipe_id and r.is_public = true)
  );

drop policy if exists "steps_admin_all" on recipe_steps;
create policy "steps_admin_all" on recipe_steps
  for all using (
    exists (select 1 from profiles p where p.id = auth.uid() and p.role = 'admin')
  );

-- ---------- bookmarks ----------
drop policy if exists "bookmarks_own" on bookmarks;
create policy "bookmarks_own" on bookmarks
  for all using (auth.uid() = user_id);

-- ---------- hearts ----------
drop policy if exists "hearts_select_all" on hearts;
create policy "hearts_select_all" on hearts
  for select using (true);

drop policy if exists "hearts_write_own" on hearts;
create policy "hearts_write_own" on hearts
  for insert with check (auth.uid() = user_id);

drop policy if exists "hearts_delete_own" on hearts;
create policy "hearts_delete_own" on hearts
  for delete using (auth.uid() = user_id);

-- ---------- public_results ----------
drop policy if exists "public_results_select_public" on public_results;
create policy "public_results_select_public" on public_results
  for select using (is_public = true);

drop policy if exists "public_results_admin_all" on public_results;
create policy "public_results_admin_all" on public_results
  for all using (
    exists (select 1 from profiles p where p.id = auth.uid() and p.role = 'admin')
  );

-- ---------- growth_logs ----------
drop policy if exists "growth_logs_select_own" on growth_logs;
create policy "growth_logs_select_own" on growth_logs
  for select using (auth.uid() = user_id);

drop policy if exists "growth_logs_admin_select" on growth_logs;
create policy "growth_logs_admin_select" on growth_logs
  for select using (
    exists (select 1 from profiles p where p.id = auth.uid() and p.role = 'admin')
  );

-- Inserts to growth_logs are done via SECURITY DEFINER functions / server actions only.
