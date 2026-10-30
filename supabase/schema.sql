create extension if not exists pgcrypto;

create table if not exists public.books (
  id uuid primary key default gen_random_uuid(),
  title text not null check (char_length(trim(title)) > 0),
  author text not null default '',
  country text not null default '',
  year integer check (year between 0 and 2100),
  genre text not null default '',
  status text not null default 'wishlist' check (status in ('read', 'wishlist')),
  rating smallint not null default 0 check (rating between 0 and 5),
  review text not null default '',
  cover text not null default '',
  link text not null default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists books_created_at_idx on public.books (created_at desc);

create or replace function public.touch_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists books_touch_updated_at on public.books;
create trigger books_touch_updated_at
before update on public.books
for each row execute function public.touch_updated_at();

alter table public.books enable row level security;

drop policy if exists "Books are publicly readable" on public.books;
create policy "Books are publicly readable"
on public.books for select
using (true);

drop policy if exists "Signed-in users can add books" on public.books;
create policy "Signed-in users can add books"
on public.books for insert to authenticated
with check (true);

drop policy if exists "Signed-in users can edit books" on public.books;
create policy "Signed-in users can edit books"
on public.books for update to authenticated
using (true)
with check (true);

drop policy if exists "Signed-in users can delete books" on public.books;
create policy "Signed-in users can delete books"
on public.books for delete to authenticated
using (true);

grant select on table public.books to anon;
grant select, insert, update, delete on table public.books to authenticated;

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
