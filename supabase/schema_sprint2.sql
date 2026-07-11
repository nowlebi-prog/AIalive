-- =========================================================
-- Clover Desk — Sprint 2 migration
-- Run once in the Supabase SQL editor, after schema.sql + rls.sql
-- =========================================================

-- Awards growth points to the CURRENTLY AUTHENTICATED user only.
-- Client code calls this via supabase.rpc('award_growth_points', {...})
-- instead of inserting into growth_logs directly (which RLS blocks by design).
create or replace function award_growth_points(
  p_action_type text,
  p_points int,
  p_description text default null
)
returns void as $$
declare
  v_user_id uuid := auth.uid();
  v_total int;
begin
  if v_user_id is null then
    raise exception 'not authenticated';
  end if;

  insert into growth_logs (user_id, action_type, points, description)
  values (v_user_id, p_action_type, p_points, p_description);

  update profiles
  set growth_points = growth_points + p_points,
      updated_at = now()
  where id = v_user_id
  returning growth_points into v_total;

  update profiles
  set current_stage = case
    when v_total >= 1500 then '나만의 길 찾는 중'
    when v_total >= 700 then '꾸준한 발견자'
    when v_total >= 300 then '차근차근 시작'
    when v_total >= 100 then '작은 새싹'
    else '클로버 씨'
  end
  where id = v_user_id;
end;
$$ language plpgsql security definer set search_path = public;

grant execute on function award_growth_points(text, int, text) to authenticated;

-- Allow inserting a diagnosis for an anonymous (user_id null) session, and
-- allow the owner to insert their own — already covered by rls.sql's
-- "diagnoses_insert_any" policy, kept here as a reference/no-op if re-run:
drop policy if exists "diagnoses_insert_any" on clover_diagnoses;
create policy "diagnoses_insert_any" on clover_diagnoses
  for insert with check (user_id is null or auth.uid() = user_id);
