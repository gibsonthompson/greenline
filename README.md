# Green Line Lawn Care

Marketing site, estimate intake with photo upload and SMS, a small admin CRM with an Apple
Calendar feed, and a blog fed by the multi-tenant blog-farm.

Built against `GREENLINE-BUILD-SPEC.md`. Read that document before changing design decisions:
the palette is measured, the anti-pattern list is a hard constraint, and green (`--turf`) is a
text color on dark surfaces only.

## Stack

Next.js 16.2.11 (pinned; July 2026 security release), React 19, Tailwind v4 (tokens in
`src/app/globals.css`), Supabase (Postgres, Auth, Storage), Telnyx SMS, Cloudflare Turnstile,
Vercel.

## First run

```bash
npm install
cp .env.example .env.local   # fill values
npm run dev
```

The site builds and runs with **zero env vars configured**: Supabase-backed features degrade
gracefully (the estimate API returns a friendly 503, the blog shows its empty state, admin
shows a setup notice). Nothing crashes at import time; every external client is
lazy-initialized on purpose.

## Supabase setup (this site's project)

1. Create a Supabase project.
2. Run `supabase/schema.sql` in the SQL editor.
3. Storage: create a **private** bucket named `lead-photos`. No public policies.
4. Auth: create the single admin user (email + password) under Authentication, Users.
   There is no signup route by design.
5. Put the URL, anon key, and service role key in the environment. The service role key is
   server-only; it must never appear with a `NEXT_PUBLIC_` prefix.

## Environment variables

Names in `.env.example`. On Vercel, add them **before** deploying: Vercel does not pick up
variables added after the last build, and the resulting failure looks exactly like a code bug.

## SMS (Telnyx)

- Set `TELNYX_API_KEY`, `TELNYX_FROM_NUMBER`, optional `TELNYX_MESSAGING_PROFILE_ID`, and
  `OWNER_SMS_NUMBER` (Jaydin's phone in E.164).
- Point the Telnyx webhook for the messaging profile at `POST /api/sms/status`. Delivery
  receipts update the log; inbound STOP and START are honored automatically.
- A2P 10DLC brand and campaign registration must be live before production traffic.

## Apple Calendar

Admin, Settings shows a `webcal://` link and an `https://` link. Jaydin taps the webcal link
once on his iPhone; the calendar lands in iCloud and syncs to Mac and iPad. Apple polls about
hourly. Job edits and cancellations propagate through the feed (cancelled jobs stay in the
feed as `STATUS:CANCELLED` on purpose; deleting them would leave ghosts on the phone).
"Add to my calendar" on a job page is for adding a single new event only; iOS does not
reliably apply updates from re-downloaded single ICS files.

## Blog-farm integration

The blog-farm is a **separate Vercel app with its own Supabase project**. This site reads
published posts and revalidates; it never writes to the farm.

Order of operations (spec 14.6):

1. Run the onboarding SQL from spec section 14.3 against the blog-farm Supabase
   (tenant slug `greenline`, `publish_mode: 'nextjs'`; note `github_owner` and `github_repo`
   are NOT NULL even in nextjs mode, so supply values).
2. Add `BLOG_FARM_SUPABASE_URL`, `BLOG_FARM_SUPABASE_KEY`, `REVALIDATION_SECRET` to this
   site's Vercel project, then redeploy.
3. Set the tenant's `revalidate_url` to `https://<domain>/api/revalidate`.
4. Test the hook:
   `curl -X POST https://<domain>/api/revalidate -H 'Content-Type: application/json' -d '{"secret":"<REVALIDATION_SECRET>","slug":"test"}'`
5. Add the two daily crons for `business=greenline` to the blog-farm `vercel.json`
   (suggested 06:00 and 13:00 UTC; confirm the slots are free).
6. Trigger one manual autopilot run and confirm the post renders at `/blog`.

`src/lib/blog.ts` uses a lazy Supabase client. Keep it that way: client components import
types from that file, and a module-level `createClient` executes in the browser with
undefined env vars and silently breaks the blog.

## Photo pipeline

The estimate form is a **library picker** (no `capture` attribute) because iPhone photo rolls
are where the photos live. Files are decoded (native `createImageBitmap` first, `heic2any`
WASM fallback for HEIC), downscaled to 1600px, re-encoded as JPEG q0.82, and uploaded straight
to the private bucket with a signed PUT. Drawing to a canvas strips all EXIF including GPS, so
customer home coordinates never reach storage. Test milestone M3 on a real iPhone with a real
HEIC from the photo library, not a simulator.

## Remaining TODO(gibson) items

Domain, Google Place ID (`NEXT_PUBLIC_GOOGLE_PLACE_ID`), business email, Jaydin's surname,
weekend hours, confirmation of the twelve Tier 1 cities, the served ZIP list
(`src/data/service-zips.ts`), A2P registration, and the Google review mark asset
(`/public/brand/google-mark.svg`, from Google's brand permissions page; do not hand-draw it).

## Acceptance

Run the checklist in spec section 19 before launch, including the silhouette test against
jblawncareandhauling.com and two other Bay Area lawn care sites.
