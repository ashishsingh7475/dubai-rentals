# Trust & Credibility Upgrade

## What was added

- Verified listing signals (listing + owner + phone/email/document badges)
- Public owner profile pages with owner listings and review history
- Reviews and ratings with moderation queue
- Fraud protection with listing reports, flagging, admin moderation, and owner blocking
- Activity and social proof signals (views, saves, contacted, trending)
- Dashboard trust tools and admin moderation dashboard
- Performance improvements via cached search results and lazy-loaded card images

## New database objects

- `owner_profiles`
- `listing_reviews`
- `listing_reports`
- `listing_views`
- `blocked_users`
- `admin_users`
- New columns on `listings`: `verified_listing`, `status`, `views_count`, `saved_count`, `contacted_count`, `reported_count`

Migration file:

- `supabase/migrations/20260323000100_trust_and_moderation.sql`

## RLS notes

- RLS is enabled for all trust tables.
- Admin access is enforced via `public.is_admin()` backed by `public.admin_users`.
- To grant admin rights, insert the user id into `public.admin_users`.

Example:

```sql
insert into public.admin_users (user_id) values ('<auth-user-uuid>');
```

## New routes

- `owners/[id]` (public owner profile)
- `dashboard/trust` (owner trust profile editor)
- `dashboard/admin` (admin moderation panel)

