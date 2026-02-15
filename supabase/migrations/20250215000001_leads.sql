-- Leads table (contact form submissions)
create table if not exists public.leads (
  id uuid primary key default gen_random_uuid(),
  listing_id uuid not null references public.listings(id) on delete cascade,
  user_id uuid references auth.users(id) on delete set null,
  name text not null,
  phone text not null,
  email text not null,
  message text not null,
  created_at timestamptz not null default now()
);

create index if not exists leads_listing_id_idx on public.leads(listing_id);
create index if not exists leads_created_at_idx on public.leads(created_at desc);

alter table public.leads enable row level security;

-- Anyone can insert (guests allowed)
create policy "Anyone can submit leads"
  on public.leads for insert
  with check (true);

-- Only listing owner can view leads for their listings
create policy "Listing owners can view their leads"
  on public.leads for select
  to authenticated
  using (
    exists (
      select 1 from public.listings
      where listings.id = leads.listing_id
      and listings.user_id = auth.uid()
    )
  );
