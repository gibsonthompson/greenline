-- ============================================================================
-- GREEN LINE LAWN CARE: SITE DATABASE SCHEMA
-- Run in the Supabase SQL editor for THIS SITE'S project.
-- (The blog-farm lives in a separate Supabase project; see README.)
-- RLS is enabled on every table with NO public policies: all access goes
-- through server code holding the service role key.
-- ============================================================================

create extension if not exists "pgcrypto";

-- CONTACTS -------------------------------------------------------------
create table gl_contacts (
  id            uuid primary key default gen_random_uuid(),
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now(),
  first_name    text not null,
  last_name     text,
  phone         text,                       -- E.164
  email         text,
  address_line  text,
  city          text,
  state         text default 'CA',
  zip           text,
  contact_type  text not null default 'residential'
                check (contact_type in ('residential','commercial','property-manager')),
  is_recurring  boolean not null default false,
  cadence       text check (cadence in ('weekly','biweekly','monthly','seasonal','one-time')),
  source        text,
  notes         text,
  tags          text[] default '{}',
  archived      boolean not null default false
);
create index on gl_contacts (phone);
create index on gl_contacts (city);
create index on gl_contacts (archived, created_at desc);

-- LEADS ----------------------------------------------------------------
create table gl_leads (
  id              uuid primary key default gen_random_uuid(),
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now(),
  contact_id      uuid references gl_contacts(id) on delete set null,
  status          text not null default 'new'
                  check (status in ('new','contacted','quoted','scheduled','won','lost')),
  services        text[] not null default '{}',
  address_line    text,
  city            text,
  zip             text,
  out_of_area     boolean not null default false,
  name            text not null,
  phone           text not null,
  email           text,
  notes           text,
  quoted_amount   numeric(10,2),
  lost_reason     text,
  sms_consent     boolean not null default false,
  sms_consent_at  timestamptz,
  sms_consent_text text,
  utm             jsonb default '{}'::jsonb,
  referrer        text,
  user_agent      text
);
create index on gl_leads (status, created_at desc);
create index on gl_leads (phone);

-- LEAD PHOTOS ----------------------------------------------------------
create table gl_lead_photos (
  id           uuid primary key default gen_random_uuid(),
  created_at   timestamptz not null default now(),
  lead_id      uuid not null references gl_leads(id) on delete cascade,
  storage_path text not null,
  width        int,
  height       int,
  bytes        int,
  sort_order   int not null default 0
);
create index on gl_lead_photos (lead_id, sort_order);

-- JOBS -----------------------------------------------------------------
create table gl_jobs (
  id            uuid primary key default gen_random_uuid(),
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now(),
  contact_id    uuid references gl_contacts(id) on delete set null,
  lead_id       uuid references gl_leads(id) on delete set null,
  job_type      text not null default 'service'
                check (job_type in ('estimate','service','followup')),
  title         text not null,
  services      text[] default '{}',
  status        text not null default 'scheduled'
                check (status in ('scheduled','confirmed','in-progress','complete','cancelled','no-show')),
  starts_at     timestamptz not null,
  ends_at       timestamptz not null,
  all_day       boolean not null default false,
  address_line  text,
  city          text,
  zip           text,
  price         numeric(10,2),
  notes         text,
  -- iCalendar bookkeeping (spec section 12)
  ics_uid       text not null unique default (gen_random_uuid()::text),
  ics_sequence  int not null default 0,
  last_modified timestamptz not null default now()
);
create index on gl_jobs (starts_at);
create index on gl_jobs (status, starts_at);

-- Bump SEQUENCE and LAST-MODIFIED on any change a calendar client must
-- observe. This is what makes edits propagate to subscribers.
create or replace function gl_bump_ics() returns trigger language plpgsql as $$
begin
  if (new.starts_at, new.ends_at, new.title, new.status, new.address_line, new.notes)
     is distinct from
     (old.starts_at, old.ends_at, old.title, old.status, old.address_line, old.notes) then
    new.ics_sequence  := old.ics_sequence + 1;
    new.last_modified := now();
  end if;
  new.updated_at := now();
  return new;
end $$;
create trigger gl_jobs_ics before update on gl_jobs
  for each row execute function gl_bump_ics();

-- CALENDAR FEEDS -------------------------------------------------------
create table gl_calendar_feeds (
  id           uuid primary key default gen_random_uuid(),
  created_at   timestamptz not null default now(),
  label        text not null,
  token        text not null unique,
  scope        text not null default 'all'
               check (scope in ('all','estimates','service')),
  last_fetched timestamptz,
  fetch_count  int not null default 0,
  revoked      boolean not null default false
);

-- SMS LOG --------------------------------------------------------------
create table gl_sms_log (
  id           uuid primary key default gen_random_uuid(),
  created_at   timestamptz not null default now(),
  direction    text not null check (direction in ('outbound','inbound')),
  to_number    text,
  from_number  text,
  body         text,
  template     text,
  lead_id      uuid references gl_leads(id) on delete set null,
  job_id       uuid references gl_jobs(id) on delete set null,
  provider_id  text,
  status       text,
  error        text
);
create index on gl_sms_log (created_at desc);

-- SETTINGS -------------------------------------------------------------
create table gl_settings (
  key        text primary key,
  value      jsonb not null,
  updated_at timestamptz not null default now()
);

alter table gl_contacts       enable row level security;
alter table gl_leads          enable row level security;
alter table gl_lead_photos    enable row level security;
alter table gl_jobs           enable row level security;
alter table gl_calendar_feeds enable row level security;
alter table gl_sms_log        enable row level security;
alter table gl_settings       enable row level security;
-- No public policies. Service role only.

-- STORAGE --------------------------------------------------------------
-- Create a PRIVATE bucket named  lead-photos  in Storage.
-- Do not add public access policies. Uploads use signed PUT URLs and
-- admin viewing uses short-lived signed GET URLs.
