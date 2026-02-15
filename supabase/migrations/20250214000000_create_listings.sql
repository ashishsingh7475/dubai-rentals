-- Listings table
create table if not exists public.listings (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text not null,
  price numeric not null check (price >= 0),
  property_type text not null check (property_type in ('room', 'apartment')),
  area text not null,
  bedrooms int not null check (bedrooms >= 0),
  bathrooms int not null check (bathrooms >= 0),
  furnished boolean not null default false,
  image_urls text[] default '{}',
  user_id uuid not null references auth.users(id) on delete cascade,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Updated_at trigger
create or replace function public.set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger listings_updated_at
  before update on public.listings
  for each row execute function public.set_updated_at();

-- RLS
alter table public.listings enable row level security;

-- Anyone can read listings
create policy "Listings are viewable by everyone"
  on public.listings for select
  using (true);

-- Authenticated users can insert their own
create policy "Users can create own listings"
  on public.listings for insert
  to authenticated
  with check (auth.uid() = user_id);

-- Only owner can update
create policy "Users can update own listings"
  on public.listings for update
  to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- Only owner can delete
create policy "Users can delete own listings"
  on public.listings for delete
  to authenticated
  using (auth.uid() = user_id);

-- Index for common queries
create index if not exists listings_user_id_idx on public.listings(user_id);
create index if not exists listings_created_at_idx on public.listings(created_at desc);
