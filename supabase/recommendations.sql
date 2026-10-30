create table if not exists public.recommendations (
  id uuid primary key default gen_random_uuid(),
  title text not null check (char_length(trim(title)) > 0),
  author text not null default '',
  reason text not null default '',
  created_at timestamptz not null default now()
);

create index if not exists recommendations_created_at_idx
on public.recommendations (created_at desc);

alter table public.recommendations enable row level security;

drop policy if exists "Recommendations are publicly readable" on public.recommendations;
create policy "Recommendations are publicly readable"
on public.recommendations for select
using (true);

drop policy if exists "Anyone can recommend a book" on public.recommendations;
create policy "Anyone can recommend a book"
on public.recommendations for insert to anon, authenticated
with check (true);

drop policy if exists "Signed-in users can remove recommendations" on public.recommendations;
create policy "Signed-in users can remove recommendations"
on public.recommendations for delete to authenticated
using (true);

grant select, insert on table public.recommendations to anon;
grant select, insert, delete on table public.recommendations to authenticated;
