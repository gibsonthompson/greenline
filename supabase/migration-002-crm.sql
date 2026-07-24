-- ============================================================================
-- GREEN LINE MIGRATION 002: CRM, recurring service, notification plumbing
--
-- Additive only. Safe to run against the existing database; it does not drop
-- or rewrite anything from schema.sql.
-- ============================================================================

-- ── OPT-OUTS ────────────────────────────────────────────────────────────────
-- Previously STOP was written into gl_settings as a loose key and never read
-- back before sending. A real table makes the check cheap and auditable.
create table if not exists gl_sms_optouts (
  phone       text primary key,              -- E.164
  opted_out   boolean not null default true,
  reason      text,                          -- 'STOP', 'manual', 'carrier'
  source      text,                          -- 'inbound-sms', 'admin'
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);
create index if not exists gl_optouts_active on gl_sms_optouts (phone) where opted_out;

-- Carry across anything already recorded under the old settings key
insert into gl_sms_optouts (phone, opted_out, reason, source)
select replace(key, 'optout:', ''),
       coalesce((value->>'optedOut')::boolean, true),
       'STOP', 'migrated'
from gl_settings
where key like 'optout:%'
on conflict (phone) do nothing;

-- ── DURABLE RATE LIMITING ───────────────────────────────────────────────────
-- The in-memory Map reset on every cold start and was per-instance, so on
-- serverless it barely limited anything.
create table if not exists gl_rate_limits (
  bucket      text not null,                 -- 'estimate' | 'upload'
  identifier  text not null,                 -- IP or phone
  hit_at      timestamptz not null default now(),
  primary key (bucket, identifier, hit_at)
);
create index if not exists gl_rate_recent on gl_rate_limits (bucket, identifier, hit_at desc);

create or replace function gl_rate_check(
  p_bucket text, p_identifier text, p_limit int, p_window_minutes int
) returns boolean language plpgsql as $$
declare n int;
begin
  delete from gl_rate_limits
   where hit_at < now() - interval '24 hours';
  select count(*) into n
    from gl_rate_limits
   where bucket = p_bucket
     and identifier = p_identifier
     and hit_at > now() - (p_window_minutes || ' minutes')::interval;
  if n >= p_limit then
    return false;                            -- over the limit
  end if;
  insert into gl_rate_limits (bucket, identifier) values (p_bucket, p_identifier);
  return true;                               -- allowed
end $$;

-- ── RECURRING SERVICE ───────────────────────────────────────────────────────
-- The business model is "same weekday, every week". Contacts already carried
-- a cadence but nothing ever generated the visits.
create table if not exists gl_job_series (
  id            uuid primary key default gen_random_uuid(),
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now(),
  contact_id    uuid not null references gl_contacts(id) on delete cascade,
  title         text not null,
  services      text[] not null default '{}',
  cadence       text not null check (cadence in ('weekly','biweekly','monthly')),
  weekday       int  not null check (weekday between 0 and 6),   -- 0 = Sunday
  start_time    time not null default '09:00',
  duration_min  int  not null default 60,
  price         numeric(10,2),
  address_line  text,
  city          text,
  zip           text,
  notes         text,
  active        boolean not null default true,
  starts_on     date not null default current_date,
  ends_on       date,                        -- null = open ended
  last_built_to date                         -- how far ahead visits exist
);
create index if not exists gl_series_active on gl_job_series (active, weekday);

alter table gl_jobs add column if not exists series_id uuid references gl_job_series(id) on delete set null;
alter table gl_jobs add column if not exists reminder_sent_at   timestamptz;
alter table gl_jobs add column if not exists enroute_sent_at    timestamptz;
alter table gl_jobs add column if not exists completed_at       timestamptz;
alter table gl_jobs add column if not exists review_asked_at    timestamptz;
create index if not exists gl_jobs_series on gl_jobs (series_id, starts_at);

-- One visit per series per day, so a rebuild can never double-book
create unique index if not exists gl_jobs_series_day
  on gl_jobs (series_id, (starts_at::date))
  where series_id is not null;

-- ── LEAD FOLLOW-UP ──────────────────────────────────────────────────────────
alter table gl_leads add column if not exists quote_sent_at    timestamptz;
alter table gl_leads add column if not exists last_contact_at  timestamptz;
alter table gl_leads add column if not exists followup_count   int not null default 0;

-- ── SMS LOG ─────────────────────────────────────────────────────────────────
alter table gl_sms_log add column if not exists audience text;   -- customer|owner|developer
alter table gl_sms_log add column if not exists suppressed boolean not null default false;

alter table gl_sms_optouts enable row level security;
alter table gl_rate_limits enable row level security;
alter table gl_job_series  enable row level security;
-- No public policies. Service role only, same as every other table.
