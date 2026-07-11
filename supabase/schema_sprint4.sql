-- =========================================================
-- Clover Desk — Sprint 4 migration
-- Run once in the Supabase SQL editor, after schema.sql + rls.sql + schema_sprint2.sql
-- =========================================================

-- Admin dashboard needs to count all bookmarks (previously only owners could read their own).
drop policy if exists "bookmarks_select_admin" on bookmarks;
create policy "bookmarks_select_admin" on bookmarks
  for select using (
    exists (select 1 from profiles p where p.id = auth.uid() and p.role = 'admin')
  );
