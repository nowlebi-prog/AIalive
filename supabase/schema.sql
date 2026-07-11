-- =========================================================
-- Clover Desk — Sprint 1 schema
-- Run this once in the Supabase SQL editor (or via `supabase db push`).
-- =========================================================

create extension if not exists "pgcrypto";

-- ============================================
-- profiles
-- ============================================
create table if not exists profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text,
  nickname text,
  avatar_url text,
  provider text,
  clover_number integer unique,
  role text not null default 'user' check (role in ('user','admin')),
  current_stage text not null default '클로버 씨',
  growth_points integer not null default 0,
  card_theme text not null default 'default',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create sequence if not exists clover_number_seq start 1;

create or replace function assign_clover_number()
returns trigger as $$
begin
  if new.clover_number is null then
    new.clover_number := nextval('clover_number_seq');
  end if;
  return new;
end;
$$ language plpgsql;

drop trigger if exists trg_assign_clover_number on profiles;
create trigger trg_assign_clover_number
before insert on profiles
for each row execute function assign_clover_number();

-- ============================================
-- clover_diagnoses
-- ============================================
create table if not exists clover_diagnoses (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references profiles(id) on delete set null,
  user_type text,
  pain_categories text[],
  ai_experience text,
  desired_result text,
  result_type text,
  created_at timestamptz not null default now()
);

-- ============================================
-- clover_mailbox
-- ============================================
create table if not exists clover_mailbox (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references profiles(id) on delete cascade,
  industry text,
  pain_title text,
  desired_outcome text,
  current_situation text,
  free_text text,
  requested_industry text,
  allow_anonymous_use boolean not null default false,
  status text not null default 'received'
    check (status in ('received','reviewing','in_progress','completed')),
  admin_note text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ============================================
-- recipes
-- ============================================
create table if not exists recipes (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text unique not null,
  summary text,
  target_users text[],
  categories text[],
  tools text[],
  difficulty text,
  estimated_time text,
  estimated_cost text,
  thumbnail_url text,
  is_public boolean not null default true,
  is_premium boolean not null default false,
  view_count integer not null default 0,
  save_count integer not null default 0,
  heart_count integer not null default 0,
  created_by uuid references profiles(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ============================================
-- recipe_steps
-- ============================================
create table if not exists recipe_steps (
  id uuid primary key default gen_random_uuid(),
  recipe_id uuid not null references recipes(id) on delete cascade,
  step_order integer not null,
  title text not null,
  description text,
  checklist jsonb,
  prompt_text text,
  tip text,
  screenshot_urls text[],
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique(recipe_id, step_order)
);

-- ============================================
-- bookmarks
-- ============================================
create table if not exists bookmarks (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references profiles(id) on delete cascade,
  recipe_id uuid not null references recipes(id) on delete cascade,
  created_at timestamptz not null default now(),
  unique(user_id, recipe_id)
);

-- ============================================
-- hearts
-- ============================================
create table if not exists hearts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references profiles(id) on delete cascade,
  target_type text not null check (target_type in ('recipe','public_result')),
  target_id uuid not null,
  created_at timestamptz not null default now(),
  unique(user_id, target_type, target_id)
);

-- ============================================
-- public_results
-- ============================================
create table if not exists public_results (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  summary text,
  image_url text,
  source_mailbox_id uuid references clover_mailbox(id),
  related_recipe_id uuid references recipes(id),
  heart_count integer not null default 0,
  is_public boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ============================================
-- growth_logs
-- ============================================
create table if not exists growth_logs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references profiles(id) on delete cascade,
  action_type text not null,
  points integer not null,
  description text,
  created_at timestamptz not null default now()
);

-- ============================================
-- Heart / save count sync triggers
-- ============================================
create or replace function sync_heart_count()
returns trigger as $$
begin
  if TG_OP = 'INSERT' then
    if new.target_type = 'recipe' then
      update recipes set heart_count = heart_count + 1 where id = new.target_id;
    elsif new.target_type = 'public_result' then
      update public_results set heart_count = heart_count + 1 where id = new.target_id;
    end if;
  elsif TG_OP = 'DELETE' then
    if old.target_type = 'recipe' then
      update recipes set heart_count = heart_count - 1 where id = old.target_id;
    elsif old.target_type = 'public_result' then
      update public_results set heart_count = heart_count - 1 where id = old.target_id;
    end if;
  end if;
  return null;
end;
$$ language plpgsql;

drop trigger if exists trg_sync_heart_count on hearts;
create trigger trg_sync_heart_count
after insert or delete on hearts
for each row execute function sync_heart_count();

create or replace function sync_save_count()
returns trigger as $$
begin
  if TG_OP = 'INSERT' then
    update recipes set save_count = save_count + 1 where id = new.recipe_id;
  elsif TG_OP = 'DELETE' then
    update recipes set save_count = save_count - 1 where id = old.recipe_id;
  end if;
  return null;
end;
$$ language plpgsql;

drop trigger if exists trg_sync_save_count on bookmarks;
create trigger trg_sync_save_count
after insert or delete on bookmarks
for each row execute function sync_save_count();

-- ============================================
-- Auto-create profile + signup growth bonus on new auth.users row
-- (covers "로그인 후 profiles가 없으면 자동 생성" requirement)
-- ============================================
create or replace function handle_new_user()
returns trigger as $$
declare
  new_profile_id uuid;
begin
  insert into profiles (id, email, nickname, avatar_url, provider, growth_points)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'name', new.raw_user_meta_data->>'nickname', '클로버 씨'),
    new.raw_user_meta_data->>'avatar_url',
    coalesce(new.raw_app_meta_data->>'provider', 'kakao'),
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
