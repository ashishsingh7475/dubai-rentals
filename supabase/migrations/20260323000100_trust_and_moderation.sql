-- Trust and moderation system
create table if not exists public.owner_profiles (
  user_id uuid primary key references auth.users(id) on delete cascade,
  display_name text,
  profile_picture_url text,
  bio text,
  contact_email text,
  contact_phone text,
  email_verified boolean not null default false,
  phone_verified boolean not null default false,
  document_verified boolean not null default false,
  owner_verified boolean not null default false,
  average_owner_rating numeric(3,2) not null default 0,
  owner_review_count int not null default 0,
  blocked boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger owner_profiles_updated_at
  before update on public.owner_profiles
  for each row execute function public.set_updated_at();

alter table public.listings
  add column if not exists verified_listing boolean not null default false,
  add column if not exists verification_notes text,
  add column if not exists status text not null default 'active' check (status in ('active', 'flagged', 'blocked', 'archived')),
  add column if not exists views_count int not null default 0,
  add column if not exists saved_count int not null default 0,
  add column if not exists contacted_count int not null default 0,
  add column if not exists reported_count int not null default 0,
  add column if not exists most_recent_view_at timestamptz;

create table if not exists public.listing_views (
  id uuid primary key default gen_random_uuid(),
  listing_id uuid not null references public.listings(id) on delete cascade,
  viewer_user_id uuid references auth.users(id) on delete set null,
  session_id text,
  viewed_at timestamptz not null default now(),
  unique (listing_id, viewer_user_id),
  unique (listing_id, session_id)
);

create index if not exists listing_views_listing_id_idx on public.listing_views(listing_id);
create index if not exists listing_views_viewed_at_idx on public.listing_views(viewed_at desc);

create table if not exists public.listing_reviews (
  id uuid primary key default gen_random_uuid(),
  listing_id uuid not null references public.listings(id) on delete cascade,
  reviewer_user_id uuid not null references auth.users(id) on delete cascade,
  owner_user_id uuid not null references auth.users(id) on delete cascade,
  rating int not null check (rating between 1 and 5),
  review_text text not null check (char_length(review_text) >= 10),
  status text not null default 'pending' check (status in ('pending', 'approved', 'rejected')),
  moderated_by uuid references auth.users(id) on delete set null,
  moderated_reason text,
  moderated_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (listing_id, reviewer_user_id)
);

create index if not exists listing_reviews_listing_id_idx on public.listing_reviews(listing_id);
create index if not exists listing_reviews_owner_user_id_idx on public.listing_reviews(owner_user_id);
create index if not exists listing_reviews_status_idx on public.listing_reviews(status);

create trigger listing_reviews_updated_at
  before update on public.listing_reviews
  for each row execute function public.set_updated_at();

create table if not exists public.listing_reports (
  id uuid primary key default gen_random_uuid(),
  listing_id uuid not null references public.listings(id) on delete cascade,
  reporter_user_id uuid references auth.users(id) on delete set null,
  reason text not null,
  details text,
  status text not null default 'open' check (status in ('open', 'investigating', 'resolved', 'rejected')),
  moderated_by uuid references auth.users(id) on delete set null,
  moderated_note text,
  moderated_at timestamptz,
  created_at timestamptz not null default now()
);

create index if not exists listing_reports_listing_id_idx on public.listing_reports(listing_id);
create index if not exists listing_reports_status_idx on public.listing_reports(status);
create index if not exists listing_reports_created_at_idx on public.listing_reports(created_at desc);

create table if not exists public.blocked_users (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade unique,
  blocked boolean not null default true,
  reason text,
  created_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.admin_users (
  user_id uuid primary key references auth.users(id) on delete cascade,
  created_at timestamptz not null default now()
);

create trigger blocked_users_updated_at
  before update on public.blocked_users
  for each row execute function public.set_updated_at();

-- Keep listing counters synced
create or replace function public.update_listing_review_stats(target_listing_id uuid)
returns void
language plpgsql
as $$
declare
  avg_rating numeric(3,2);
  total_reviews int;
  owner_id uuid;
begin
  select coalesce(avg(rating)::numeric(3,2), 0), count(*)
  into avg_rating, total_reviews
  from public.listing_reviews
  where listing_id = target_listing_id
    and status = 'approved';

  update public.listings
  set updated_at = now()
  where id = target_listing_id;

  select user_id into owner_id from public.listings where id = target_listing_id;

  if owner_id is not null then
    update public.owner_profiles
    set average_owner_rating = coalesce((
      select avg(rating)::numeric(3,2)
      from public.listing_reviews
      where owner_user_id = owner_id and status = 'approved'
    ), 0),
        owner_review_count = (
          select count(*)
          from public.listing_reviews
          where owner_user_id = owner_id and status = 'approved'
        ),
        updated_at = now()
    where user_id = owner_id;
  end if;
end;
$$;

create or replace function public.sync_listing_report_count()
returns trigger
language plpgsql
as $$
begin
  if tg_op = 'INSERT' then
    update public.listings
    set reported_count = reported_count + 1,
        status = case when reported_count + 1 >= 3 then 'flagged' else status end
    where id = new.listing_id;
    return new;
  elsif tg_op = 'DELETE' then
    update public.listings
    set reported_count = greatest(reported_count - 1, 0)
    where id = old.listing_id;
    return old;
  end if;
  return null;
end;
$$;

drop trigger if exists listing_reports_counter_trigger on public.listing_reports;
create trigger listing_reports_counter_trigger
  after insert or delete on public.listing_reports
  for each row execute function public.sync_listing_report_count();

-- helper to mark admins (email allowlist from env)
create or replace function public.is_admin()
returns boolean
language sql
stable
as $$
  select exists (
    select 1 from public.admin_users where admin_users.user_id = auth.uid()
  );
$$;

-- RLS
alter table public.owner_profiles enable row level security;
alter table public.listing_views enable row level security;
alter table public.listing_reviews enable row level security;
alter table public.listing_reports enable row level security;
alter table public.blocked_users enable row level security;
alter table public.admin_users enable row level security;

drop policy if exists "Owner profiles are public read" on public.owner_profiles;
create policy "Owner profiles are public read"
  on public.owner_profiles for select
  using (true);

drop policy if exists "Users can manage own owner profile" on public.owner_profiles;
create policy "Users can manage own owner profile"
  on public.owner_profiles for all
  to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

drop policy if exists "Admins can manage owner profiles" on public.owner_profiles;
create policy "Admins can manage owner profiles"
  on public.owner_profiles for all
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

drop policy if exists "Users can insert listing views" on public.listing_views;
create policy "Users can insert listing views"
  on public.listing_views for insert
  with check (true);

drop policy if exists "Owners and admins can view listing views" on public.listing_views;
create policy "Owners and admins can view listing views"
  on public.listing_views for select
  to authenticated
  using (
    public.is_admin()
    or exists (
      select 1 from public.listings
      where listings.id = listing_views.listing_id
      and listings.user_id = auth.uid()
    )
  );

drop policy if exists "Approved reviews are public" on public.listing_reviews;
create policy "Approved reviews are public"
  on public.listing_reviews for select
  using (status = 'approved' or public.is_admin() or reviewer_user_id = auth.uid() or owner_user_id = auth.uid());

drop policy if exists "Authenticated users can create reviews" on public.listing_reviews;
create policy "Authenticated users can create reviews"
  on public.listing_reviews for insert
  to authenticated
  with check (
    auth.uid() = reviewer_user_id
    and auth.uid() <> owner_user_id
  );

drop policy if exists "Users can update own pending reviews" on public.listing_reviews;
create policy "Users can update own pending reviews"
  on public.listing_reviews for update
  to authenticated
  using (auth.uid() = reviewer_user_id and status = 'pending')
  with check (auth.uid() = reviewer_user_id);

drop policy if exists "Admins can moderate reviews" on public.listing_reviews;
create policy "Admins can moderate reviews"
  on public.listing_reviews for update
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

drop policy if exists "Anyone can report listing" on public.listing_reports;
create policy "Anyone can report listing"
  on public.listing_reports for insert
  with check (true);

drop policy if exists "Owners and admins can view reports" on public.listing_reports;
create policy "Owners and admins can view reports"
  on public.listing_reports for select
  to authenticated
  using (
    public.is_admin()
    or exists (
      select 1 from public.listings
      where listings.id = listing_reports.listing_id
      and listings.user_id = auth.uid()
    )
  );

drop policy if exists "Admins can moderate reports" on public.listing_reports;
create policy "Admins can moderate reports"
  on public.listing_reports for update
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

drop policy if exists "Blocked users are admin visible" on public.blocked_users;
create policy "Blocked users are admin visible"
  on public.blocked_users for select
  to authenticated
  using (public.is_admin());

drop policy if exists "Blocked users admin manage" on public.blocked_users;
create policy "Blocked users admin manage"
  on public.blocked_users for all
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

drop policy if exists "Admin users self read" on public.admin_users;
create policy "Admin users self read"
  on public.admin_users for select
  to authenticated
  using (public.is_admin() or auth.uid() = user_id);

-- Restrict listing updates/inserts for blocked users
drop policy if exists "Users can create own listings" on public.listings;
create policy "Users can create own listings"
  on public.listings for insert
  to authenticated
  with check (
    auth.uid() = user_id
    and not exists (
      select 1 from public.blocked_users
      where blocked_users.user_id = auth.uid()
      and blocked_users.blocked = true
    )
  );

drop policy if exists "Users can update own listings" on public.listings;
create policy "Users can update own listings"
  on public.listings for update
  to authenticated
  using (auth.uid() = user_id and status <> 'blocked')
  with check (auth.uid() = user_id);

drop policy if exists "Users can delete own listings" on public.listings;
create policy "Users can delete own listings"
  on public.listings for delete
  to authenticated
  using (auth.uid() = user_id);

drop policy if exists "Listings are viewable by everyone" on public.listings;
create policy "Listings are viewable by everyone"
  on public.listings for select
  using (status in ('active', 'flagged') or public.is_admin() or auth.uid() = user_id);
