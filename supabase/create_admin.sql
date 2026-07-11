-- =========================================================
-- Clover Desk — Create the first admin account
-- Run in the Supabase SQL editor, AFTER schema.sql, rls.sql,
-- schema_sprint2.sql, schema_sprint4.sql, schema_sprint5.sql
--
-- Login: adminmin@clover.local / Dldmsql9898*
-- (Supabase Auth requires an email-shaped identifier, so "adminmin" is
--  used as the local part. Sign in from the site's email/password form
--  using this exact address. You can change it any time in Supabase
--  Authentication → Users, or swap it for a real inbox you own below.)
-- =========================================================

do $$
declare
  v_user_id uuid := gen_random_uuid();
begin
  -- Skip if this admin account already exists (safe to re-run)
  if exists (select 1 from auth.users where email = 'adminmin@clover.local') then
    raise notice 'adminmin@clover.local already exists — skipping creation.';
  else
    insert into auth.users (
      instance_id, id, aud, role, email, encrypted_password,
      email_confirmed_at, raw_app_meta_data, raw_user_meta_data,
      created_at, updated_at, confirmation_token, recovery_token
    ) values (
      '00000000-0000-0000-0000-000000000000',
      v_user_id,
      'authenticated',
      'authenticated',
      'adminmin@clover.local',
      crypt('Dldmsql9898*', gen_salt('bf')),
      now(),
      '{"provider":"email","providers":["email"]}',
      '{"nickname":"운영자"}',
      now(), now(), '', ''
    );

    insert into auth.identities (
      id, user_id, provider_id, identity_data, provider,
      last_sign_in_at, created_at, updated_at
    ) values (
      gen_random_uuid(),
      v_user_id,
      v_user_id::text,
      jsonb_build_object('sub', v_user_id::text, 'email', 'adminmin@clover.local'),
      'email',
      now(), now(), now()
    );
  end if;
end $$;

-- The handle_new_user() trigger (from schema.sql) fires automatically on the
-- auth.users insert above and creates the matching `profiles` row. Promote
-- that row to admin:
update profiles
set role = 'admin', nickname = '운영자'
where email = 'adminmin@clover.local';

-- Verify:
select id, email, nickname, clover_number, role from profiles where email = 'adminmin@clover.local';
