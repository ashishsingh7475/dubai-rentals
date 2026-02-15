-- Optional owner contact for WhatsApp/Call
alter table public.listings
  add column if not exists owner_phone text,
  add column if not exists owner_whatsapp text;
