# Green Line Lawn Care LLC
## Complete Build Specification

**Version 1.0 · 23 July 2026 · Prepared for the implementing engineer**

---

## 0. How to read this document

This is a build spec, not a pitch. It is written so that an implementing model or engineer can build the entire product without asking clarifying questions. Where a value is genuinely unknown, it is marked `TODO(gibson)` with the exact shape of the answer required and a working placeholder so nothing blocks.

Three rules that override everything else in this document:

1. **No em-dashes anywhere.** Not in copy, not in comments, not in commit messages. Use commas, periods, colons, or parentheses.
2. **Deliver complete files, never patches or diffs.** When a file changes, output the whole file.
3. **Never commit or print secrets.** No API keys, tokens, or environment values in code, comments, seed data, or documentation.

The single most important constraint is section 2.2, the anti-pattern list. This client has explicitly rejected the generic AI-generated look. A build that is technically correct and visually generic is a failed build.

---

## 1. Business facts

| Field | Value |
|---|---|
| Legal name | Green Line Lawn Care LLC |
| Owner / operator | Jaydin (surname `TODO(gibson)`) |
| Phone | (925) 436-6691 |
| Phone, E.164 | +19254366691 |
| Email | `TODO(gibson)` placeholder: `hello@greenlinelawncare.com` |
| Domain | `TODO(gibson)` placeholder: `greenlinelawncare.com` |
| Instagram | https://www.instagram.com/greenlinelawncare.llc/ |
| Facebook | https://www.facebook.com/profile.php?id=61566223880858 |
| Google Business Profile | exists (reviews are live), Place ID `TODO(gibson)` |
| Hours | Monday to Friday, 08:00 to 17:00 Pacific. Saturday and Sunday `TODO(gibson)`, assume closed. |
| Service region | San Francisco Bay Area, nine counties. Core operating area is the East Bay. |
| Google rating | 5.0 from 6 reviews as of this document |
| Timezone | America/Los_Angeles |

### 1.1 Services

Primary, from the client's own description: lawn maintenance, landscape cleanups, edging, trimming, weed removal, property upkeep. Gutter cleaning is evidenced by a customer review and should be included. Commercial property maintenance is evidenced by the sign-island job in the photo set and should be included.

Canonical service list with slugs:

| Slug | Display name |
|---|---|
| `mowing` | Lawn Mowing and Maintenance |
| `edging-and-trimming` | Edging and Trimming |
| `yard-cleanup` | Yard and Landscape Cleanup |
| `weed-removal` | Weed Removal |
| `hedge-and-shrub` | Hedge and Shrub Trimming |
| `gutter-cleaning` | Gutter Cleaning |
| `commercial-maintenance` | Commercial Property Upkeep |

### 1.2 Positioning

StoryBrand, strictly applied. The customer is the hero. Green Line is the guide. The site never says Green Line is amazing; it says the customer's property is going to look right and here is the plan to get there.

**Problem framing.** Sell the fix to a problem that is already costing something, not a service. The problems, in the customer's own terms:

- The yard has gotten away from them and they are embarrassed by it.
- The last guy stopped showing up, or showed up whenever he felt like it.
- They are selling or renting the property and the curb appeal is a liability.
- An HOA or city notice has arrived.
- A commercial property looks neglected and it reflects on the tenant.

**Never write:** transform, elevate, streamline, seamless, world-class, take your outdoor space to the next level, we are passionate about lawns. These are the exact phrases that mark a page as generated.

---

## 2. Brand and design system

### 2.1 The concept: The Line

The business name is the asset and no competitor is using it. "Green Line" is not a color, it is an edge.

The strongest photograph in the asset set is a low-angle shot of a striped lawn meeting a driveway at a razor-sharp edge. That image is the thesis: **the difference between a lawn that was mowed and a property that is maintained is the quality of the line.** Edging is the visible proof of care. A customer review independently confirms this reading ("very keen to detail", "landscape detail to a perfection").

The design device that follows: a single continuous rule runs the length of the page and behaves like an edged lawn line. It jogs at section changes, thickens where the page turns, becomes the underline beneath a heading, becomes the left edge of the estimate form, and terminates in the footer. It is drawn once as a continuous path, not repeated as a decorative border on every element.

**Spend the boldness here and nowhere else.** Everything around the line stays quiet: no shadows, no glass, no glow, no gradient fills, no decorative grids.

### 2.2 Anti-pattern list (hard constraints)

Derived from the Impeccable slop catalog, a 64-pattern deterministic detector for AI-generated interface tells. Every item below is banned in this build. If the design seems to require one, the design is wrong.

**Layout**
- Identical card grids. Same-size box with icon, heading, and two lines of body, repeated three or more times.
- Icon tile stacked above a heading. This is explicitly documented as the universal AI feature-card template.
- Hero metric layout: big number, small label, three supporting stats in a row.
- Tiny numbered section labels (01 Discover, 02 Design). Numbering is only allowed where order carries real information, which in this build means the estimate flow steps and nothing else.
- Nested cards. Cards inside cards.
- Monotonous spacing. Do not use the same gap value between every section. Section rhythm must vary deliberately.

**Typography**
- Inter, Geist, Space Grotesk, Instrument Serif. All four are named as the overused faces of the current generation.
- One font family for the whole page.
- Repeated uppercase letter-spaced kicker labels above every section heading.
- Hero eyebrow or pill chip above an oversized headline.
- A long full-sentence headline blown up to display size so it fills the viewport.
- Letter spacing tightened past the point where characters keep their own shapes.

**Color and surface**
- Purple or violet gradients. Cyan on dark.
- Gradient text.
- Radial-gradient background halos or ambient glows.
- Glassmorphism, frosted cards, blurred orbs.
- Side-tab accent borders (a thick colored stripe on one edge of a rounded card). Documented as the single most recognizable tell.
- A hairline border paired with a wide diffuse shadow on the same element. Commit to an edge or an elevation, never both.
- Warm cream or beige page background reached for by reflex. Our surface is a sampled concrete grey and is documented as such in 2.3; it must not drift lighter or warmer toward cream.
- Border radius above 16px on cards. Full pill is reserved for tags and buttons only.

**Motion**
- Bounce or elastic easing on interface elements.
- Image scale or rotate on hover.
- Auto-scrolling marquees.
- Pulsing status dots on static data.
- Decorative blinking cursors.
- Animating width, height, padding, or margin. Transform and opacity only.

**Copy**
- Marketing buzzwords listed in 1.2.
- Aphoristic manufactured-contrast cadence ("Not a service. A standard.").
- More than two em-dashes, which is moot here because the count is zero.

**The silhouette test.** Before shipping the homepage, screenshot it, reduce to a 200px-wide greyscale silhouette, and place it beside the same treatment of jblawncareandhauling.com and two other Bay Area lawn care sites. If the Green Line silhouette is not immediately identifiable, the structure is generic regardless of the palette.

### 2.3 Color

Every value below except the two logo greens was sampled directly from the client's own photographs. Contrast ratios are measured, not estimated.

```css
:root {
  /* Structure */
  --black:        #010101;  /* nav, footer cap, logo lockup. Sampled from the logo file. */
  --field:        #191F10;  /* deep sections. Sampled: hedge shadow, money shot. */

  /* Concrete surfaces. Sampled from driveway and sidewalk. */
  --concrete-00:  #E4DFD2;  /* inputs, raised panels */
  --concrete-10:  #D3CEBE;  /* default page surface */
  --concrete-20:  #C4BAA6;  /* banded sections */
  --concrete-30:  #A79C86;  /* rules, borders, dividers */

  /* Type */
  --ink:          #14180E;  /* body text on concrete       11.44:1  AAA */
  --ink-60:       #4A5040;  /* secondary text on concrete   5.31:1  AA  */
  --paper:        #F2EFE7;  /* text on --field             14.68:1  AAA */

  /* Green */
  --turf:         #6E9B1E;  /* GRAPHIC ONLY on light. Logo-derived. */
  --turf-ink:     #275E12;  /* green text and links on concrete  4.95:1  AA */
  --turf-fill:    #2C6C14;  /* button fill, white text on it     6.44:1  AA */
  --olive:        #768651;  /* supporting tone. Sampled: turf midtone. Never text. */
}
```

**The rule that falls out of the math, and it is a real one:**

`--turf` (#6E9B1E) is a **text color on dark and a graphic color on light.**

- On `--field` it measures 5.12:1 and on `--black` 6.33:1. Both pass AA. Green type is allowed there.
- On `--concrete-10` it measures **2.09:1, which fails outright.** Never set body text, labels, or links in `--turf` on any concrete surface. Use `--turf-ink` for that.
- White on `--turf` is 3.30:1, large text only. Button fills therefore use `--turf-fill`, where white reaches 6.44:1.

`--olive` at 2.52:1 on concrete is a supporting graphic tone only. Never type.

**The line device** is drawn in `--turf` at 3px to 6px depending on scale, which is legitimate because it is a graphic element and not text.

**Focus rings** are `--ink` at 2px with a 2px offset, measuring 11.44:1. Do not use green for focus; it fails on the light surface.

### 2.4 Typography

Two open-source families, both self-hosted, both chosen for a reason specific to this brief rather than pulled from a defaults list.

**Display: National Park**
SIL Open Font License. Variable, ExtraLight through ExtraBold. Download the variable woff2 from nationalparktypeface.com. It is a digitization of the routed wooden National Park Service sign lettering: outdoors, American, made by a router bit rather than a screen. It carries the subject's own vernacular.

**Body and UI: Public Sans**
SIL Open Font License, variable, available from Google Fonts or self-hosted. It is the US Web Design System typeface, engineered for legibility at small sizes in dense civic forms, which is precisely what the admin CRM is.

The pairing has a real story: park signage over public infrastructure. Neither face appears on the overused list.

Load both through `next/font/local` with `display: swap` and a metric-adjusted fallback so cumulative layout shift is zero. Do not load them from a third-party CDN.

**Type scale.** Ratio 1.333 (perfect fourth). The ratio matters because the slop detector flags "flat type hierarchy" when steps sit closer than 1.25.

| Token | Size / line-height | Face | Use |
|---|---|---|---|
| `display-xl` | 72 / 0.94 | National Park ExtraBold | hero headline only, max 4 words |
| `display-lg` | 54 / 1.00 | National Park Bold | section openers |
| `display-md` | 40 / 1.06 | National Park Bold | service index rows |
| `display-sm` | 30 / 1.15 | National Park SemiBold | sub-sections, card titles |
| `body-lg` | 20 / 1.60 | Public Sans Regular | lead paragraphs |
| `body` | 17 / 1.65 | Public Sans Regular | default body |
| `body-sm` | 15 / 1.60 | Public Sans Regular | captions, meta |
| `label` | 12 / 1.35, tracking 0.14em, uppercase | Public Sans Medium | form labels and data labels **only**, never as a section kicker |
| `data` | 16 / 1.4, tabular figures | Public Sans Medium | admin tables, prices, dates |

Mobile: `display-xl` drops to 44, `display-lg` to 34, `display-md` to 27. Body stays 17 and never goes below 15.

**Measure.** Body text containers cap at 68ch. The detector flags anything past roughly 80 characters.

**Headline discipline.** The hero headline is short enough to be set at `display-xl` without filling the viewport. If a headline needs more than four words, it drops a step. Long sentences at display size are a documented tell.

### 2.5 Spacing, shape, motion

**Spacing scale.** 4, 8, 12, 16, 24, 32, 48, 64, 96, 128, 176. Section vertical padding must vary: the service index is tight (64), the line spread is open (176), the reviews sequence is medium (96). Uniform section padding across a page is flagged as monotonous spacing.

**Radius.** `--r-sm: 4px` for inputs and buttons. `--r-md: 10px` for photo frames and panels. Nothing above 12px. No full-round except tags.

**Elevation.** None. There are no box shadows anywhere in the marketing site. Separation is achieved with the concrete tonal steps and the line device. The admin may use a single `0 1px 0 var(--concrete-30)` hairline to delimit table rows and nothing more.

**Motion.**
- Entrance only. Transform and opacity only.
- Duration 200 to 280ms. Easing `cubic-bezier(0.16, 1, 0.3, 1)` (ease-out-expo). No bounce, no spring, no overshoot.
- Stagger children 45ms, capped at six children.
- Everything ships visible at rest and is enhanced on entry. Never `opacity: 0` as the resting state, because a failed reveal handler leaves a blank page.
- Wrap every animation in `@media (prefers-reduced-motion: no-preference)`.

**The one orchestrated moment.** On first paint of the homepage, the line device draws itself from the left edge across the hero along the path of the driveway edge in the photograph, over 900ms, using `stroke-dashoffset` on an SVG path. It happens once, it is skipped entirely under reduced motion, and no other element on the site animates on a timeline. This is the signature. Do not add a second one.

### 2.6 Nav and logo

The supplied logo is a JPEG on a solid black field, sampled at `#010101`. Rather than vectorizing it, the header and footer cap are set to `--black` so the asset drops in with no matting. This is a deliberate decision by the client.

- Header: `--black` background, full bleed, 72px tall on desktop, 60px on mobile. Logo left at 36px tall. Nav links in `--paper`, hover to `--turf` (which passes at 6.33:1 on black).
- The header sits directly against the concrete page surface with no shadow and no border. The resulting hard edge is the first appearance of the line.
- A call button, `--turf-fill` with white text, sits at the right of the header on desktop. On mobile it becomes a fixed bottom dock alongside "Free estimate", with the dock respecting `env(safe-area-inset-bottom)`.

---

## 3. Site map

```
/                              home
/services                      index
/services/[slug]               7 service pages
/areas                         coverage hub, all 101 cities listed
/areas/[city]                  12 built pages only, see section 5
/work                          gallery, before and after
/reviews                       reviews + leave a review
/about                         Jaydin
/estimate                      the form
/thank-you                     post-submit, noindex
/blog                          index, fed by blog-farm
/blog/[slug]                   post
/privacy                       
/terms                         
/sms-terms                     A2P consent disclosure

/admin/login
/admin                         dashboard
/admin/leads
/admin/leads/[id]
/admin/contacts
/admin/contacts/[id]
/admin/calendar
/admin/jobs/[id]
/admin/settings

/api/estimate                  POST, lead intake
/api/upload-url                POST, signed Supabase Storage upload
/api/calendar/[token].ics      GET, subscription feed
/api/calendar/job/[id].ics     GET, single event
/api/revalidate                POST, blog-farm ISR hook
/api/sms/status                POST, Telnyx delivery webhook
/sitemap.xml
/robots.txt
```
---

## 4. Page specifications

### 4.1 Home

Section rhythm is deliberately uneven. Padding values are given per section and must not be normalized.

**1. Hero** (full viewport height minus header, min 620px)

Background: `photos/hero/edge-line-16x9.jpg`, the striped lawn meeting the driveway. Served as AVIF with WebP fallback, `priority`, explicit width and height, blur placeholder generated from the asset itself.

The photograph's own diagonal runs from lower-left to upper-right. Content sits on the concrete side of that diagonal, left-aligned, never centered.

```
Headline   (display-xl, --paper, max 4 words)
           Mowed. Edged. Cleaned up.

Lead       (body-lg, --paper at 90%, max 46ch)
           Weekly and one-time lawn care across the Bay Area.
           Send a photo, get a price the same day.

Actions    [ Get a free estimate ]  --turf-fill, white
           [ Call (925) 436-6691 ]  ghost, --paper border
```

Below the actions, a single quiet line in `body-sm`: `Free estimates · Same-day quotes · Licensed and insured`. This is a sentence, not a four-column stat bar.

The line device SVG overlays the photograph and traces the grass-to-driveway edge. It draws once on load per 2.5.

There is no eyebrow label above the headline. There is no scroll indicator.

**2. Service index** (padding 64 top, 64 bottom, surface `--concrete-10`)

Not cards. A scope-of-work index, closer to a spec sheet than a marketing grid.

Two columns on desktop. Left column is a list of seven rows. Right column is a single sticky image panel, 4:5, that swaps as the pointer moves between rows or, on scroll, as each row crosses the viewport midpoint.

Each row:
```
[ service name, display-md, --ink ]        [ one sentence, body, --ink-60, 44ch ]
──────────────────────────────────────────────────────────────  1px --concrete-30
```
On hover the row's rule thickens to 3px and turns `--turf`, and the whole row shifts 8px right over 200ms. The image swaps with a 200ms opacity crossfade. No scale, no zoom.

On mobile the image panel is dropped entirely and rows become a plain list. Do not stack seven images on mobile.

Row copy:

| Service | Sentence |
|---|---|
| Lawn Mowing and Maintenance | Weekly or every other week, cut at the right height for the grass you actually have. |
| Edging and Trimming | The clean line along your walk, drive, and beds. This is the part people notice. |
| Yard and Landscape Cleanup | Overgrown, storm-hit, or years behind. We clear it and haul the debris off. |
| Weed Removal | Beds, cracks, fence lines, and the strip along the curb everyone forgets. |
| Hedge and Shrub Trimming | Shaped so they read as intentional instead of neglected. |
| Gutter Cleaning | Cleared, flushed, and the ground left clean before we go. |
| Commercial Property Upkeep | Storefronts, sign islands, and parking strips on a schedule you can count on. |

**3. The line** (padding 176 top, 176 bottom, surface `--field`, text `--paper`)

The signature editorial spread and the only section with this much air. This is the section no competitor has.

Full-bleed photograph on the right (the money shot, 3:4 crop). On the left, at 52ch:

```
Heading  (display-lg, --paper)
         Anybody can cut grass.

Body     (body-lg)
         The edge is the tell. A lawn that has been mowed and a property
         that is being maintained look identical from the street until you
         get to where the grass meets the concrete. That line is the whole
         job. It is also the first thing that goes when a crew is rushing.

         Bay Area lawns are mostly tall fescue, which wants to be cut at
         three to three and a half inches and never taken down by more than
         a third at once. Cut it shorter to stretch the time between visits
         and it browns out, thins, and lets weeds in. We cut on a schedule
         that matches how the grass actually grows, weekly through the
         growing season and backed off when it slows.
```

The line device runs the full height of this section as a vertical rule in `--turf` between the text and the photograph.

**4. Proof** (padding 96 top, 96 bottom, surface `--concrete-20`)

Reviews as a sequence of editorial pull-quotes at varying widths, not three matching cards. Quote one is wide and set at `display-sm`. Quotes two and three are narrower and set at `body-lg`, offset to alternating sides. Each carries the reviewer's real name, their Google review count, and a small Google mark.

Placeholder for the Google logo asset: `/brand/google-mark.svg`, `TODO(gibson)` supply or download the official mark from Google's brand permissions page. Do not draw an approximation by hand; hand-coded SVG logos are a documented tell and a trademark problem.

Ends with a text link, not a button: `Read all six reviews` to `/reviews`.

**5. Coverage** (padding 64, surface `--concrete-10`)

An actual map treatment of the nine-county region with the core service area filled in `--turf` at 20% opacity and the wider region outlined. Not a pile of pill links. Beneath it, one sentence and a link to `/areas`.

Use a static simplified SVG of the nine counties committed to the repo, not a JS mapping library. No tiles to load, no API key, no layout shift.

**6. Estimate** (padding 96, surface `--field`)

The multi-step form inline, per section 8. The line device forms the left edge of the form container.

**7. Footer** (`--black` cap of 8px, then `--field`)

Four columns on desktop, stacked on mobile. Logo, the sentence from section 1.2, phone, email, hours, Instagram, Facebook, service list, area link, legal links. Copyright line.

### 4.2 Service pages, `/services/[slug]`

One template, seven instances, each with genuinely distinct content. Roughly 700 to 1000 words of real information, not a rewritten paragraph with a swapped noun.

Structure: photo band, what the job includes as a plain prose list, how often it is needed and why (this is where the Bay Area agronomy detail goes and it must differ per service), what it costs to skip it, one relevant review, estimate CTA, three FAQs with `FAQPage` schema, links to two sibling services.

Per-service factual hooks so the pages are not interchangeable:

- **Mowing.** Tall fescue at 3 to 3.5 inches. The one-third rule. Weekly March through October, every other week when growth slows. Contra Costa Water District advises mowing at 2.5 to 3 inches so taller blades shade the soil and reduce evaporation, and warns that dull blades shred the tips and make a lawn look brown when it is not. Worth saying plainly: we sharpen blades.
- **Edging and trimming.** Why the line is the visible proof of maintenance. Trimming around sprinkler heads so spray is not blocked, which CCWD calls out specifically.
- **Yard cleanup.** Debris volume, haul-off, what happens to green waste.
- **Weed removal.** Pre-emergent timing in February, the curb strip, why weeds return if the bed edge is not maintained.
- **Hedge and shrub.** Timing by species, why over-shearing produces a hollow shell.
- **Gutter cleaning.** Bay Area timing after the first rains and after tree drop. The customer review about gutters lives here.
- **Commercial.** Scheduled service, before-open windows, the sign-island photo pair as the case example.

One genuinely local, verifiable detail worth using and no competitor page mentions it: Contra Costa Water District warns that bermuda grass spreads house to house on gardeners' uncleaned mowers, and advises homeowners to make sure their gardener cleans the deck before mowing. This doubles as a trust point about how Jaydin maintains equipment. Put it on the mowing page.

### 4.3 About

The differentiator page. Five of the six reviews name Jaydin personally. That is the asset.

Owner-operated, who shows up, what the standard is, one photograph of real work. Written in first person. No stock photography, no team grid, no founder-story arc. Around 350 words.

### 4.4 Work

The gallery. Four before-and-after pairs plus standalone finished-work shots.

Pair presentation: a drag-handle wipe comparison, not two side-by-side images and not an auto-playing crossfade. The handle is a 2px `--turf` vertical line with a square grip. Keyboard accessible via arrow keys on a focused `role="slider"` with `aria-valuenow`. Under reduced motion the wipe still works because it is user-driven, but remove any easing.

Each pair carries a caption naming the job type and the city once it is known.

### 4.5 Reviews

All six verbatim from section 6, each with name, review count, relative date, and profile link. Aggregate stated as 5.0 from 6.

Then the leave-a-review block: a short honest ask, and a button to `https://search.google.com/local/writereview?placeid=PLACE_ID`. This URL form opens the write-review dialog directly instead of dropping the customer on the listing to hunt for the button, which is where most of them give up.

`TODO(gibson)` supply the Place ID. Until then, read it from `NEXT_PUBLIC_GOOGLE_PLACE_ID` and if the variable is absent, render the button pointing at the Google Business Profile URL instead and log a build warning. Do not ship a dead link.

Also generate the same URL as a QR code at build time into `/public/brand/review-qr.png` for truck decals and leave-behind cards.

---

## 5. Service areas

The client asked for all Bay Area cities. Doing that literally, as 101 near-identical city pages, is the single fastest way to damage this site, so the strategy below delivers the coverage claim without the risk.

### 5.1 Why not 101 pages

Google's doorway page policy has been enforced since March 2015 and is still listed under the Search spam policies. It names, specifically, multiple pages targeted at particular regions or cities that funnel users to one page. The failure mode is not a dramatic manual action. It is a quiet cluster-wide demotion where a set of thin pages loses ground together and drags the domain's quality signal with it. Location pages are legitimate; they become doorway pages when the only thing that changes is the city name.

A solo operator with six reviews cannot produce 101 pages of genuinely differentiated local content, and a page that exists only because a keyword exists is weaker than it looks.

### 5.2 What to build instead

**Tier 1: twelve built city pages.** Real pages, 500 words plus, each with content that could only be about that city: named neighborhoods, the local water district, the dominant housing stock and lot size, drive time from the core area, and a job from that city once one exists. These are the cities where Jaydin actually works.

`oakland`, `berkeley`, `alameda`, `san-leandro`, `hayward`, `castro-valley`, `san-lorenzo`, `union-city`, `fremont`, `newark`, `richmond`, `el-cerrito`

`TODO(gibson)` confirm or amend this list. It should be the twelve he genuinely services, not the twelve with the most search volume.

**Tier 2: the coverage hub at `/areas`.** One substantial page that names all 101 incorporated cities grouped by county, states the honest coverage rule, and links out to the twelve built pages. Cities without a built page are plain text, not links. This gives full-region keyword surface on one legitimate page with zero doorway exposure, and it is where `areaServed` in the schema points.

**Tier 3: promotion.** When a city produces three or more completed jobs with photographs, it graduates to a built page. The gallery and the CRM already hold the evidence. Add a `city_job_count` view in the admin so this is visible rather than guessed.

### 5.3 The 101 cities

Ship this as `src/data/bay-area-cities.ts`. Counts verified: 14 + 19 + 11 + 5 + 1 + 20 + 15 + 7 + 9 = 101.

**Alameda County (14)** Alameda, Albany, Berkeley, Dublin, Emeryville, Fremont, Hayward, Livermore, Newark, Oakland, Piedmont, Pleasanton, San Leandro, Union City

**Contra Costa County (19)** Antioch, Brentwood, Clayton, Concord, Danville, El Cerrito, Hercules, Lafayette, Martinez, Moraga, Oakley, Orinda, Pinole, Pittsburg, Pleasant Hill, Richmond, San Pablo, San Ramon, Walnut Creek

**Marin County (11)** Belvedere, Corte Madera, Fairfax, Larkspur, Mill Valley, Novato, Ross, San Anselmo, San Rafael, Sausalito, Tiburon

**Napa County (5)** American Canyon, Calistoga, Napa, St. Helena, Yountville

**San Francisco (1)** San Francisco

**San Mateo County (20)** Atherton, Belmont, Brisbane, Burlingame, Colma, Daly City, East Palo Alto, Foster City, Half Moon Bay, Hillsborough, Menlo Park, Millbrae, Pacifica, Portola Valley, Redwood City, San Bruno, San Carlos, San Mateo, South San Francisco, Woodside

**Santa Clara County (15)** Campbell, Cupertino, Gilroy, Los Altos, Los Altos Hills, Los Gatos, Milpitas, Monte Sereno, Morgan Hill, Mountain View, Palo Alto, San Jose, Santa Clara, Saratoga, Sunnyvale

**Solano County (7)** Benicia, Dixon, Fairfield, Rio Vista, Suisun City, Vacaville, Vallejo

**Sonoma County (9)** Cloverdale, Cotati, Healdsburg, Petaluma, Rohnert Park, Santa Rosa, Sebastopol, Sonoma, Windsor

Note that several of these (Cloverdale, Rio Vista, Half Moon Bay) are two hours from the East Bay. The coverage page should say plainly that the core area is the East Bay and that jobs outside it are quoted case by case. Claiming same-day service in Cloverdale would be a lie the site does not need to tell.

Also note: unincorporated communities are not on this list but matter operationally. Castro Valley and San Lorenzo are unincorporated Alameda County, not incorporated cities, which is why they appear in Tier 1 but not in the 101.

### 5.4 ZIP validation

The estimate form validates the entered ZIP against a served-ZIP list. Seed it with the East Bay ZIPs and mark everything else "outside the core area, quoted case by case" rather than rejecting outright. `TODO(gibson)` confirm the ZIP list. Never silently accept a lead from a location that cannot be serviced; tell the customer honestly on the form.

---

## 6. Reviews (verbatim, do not edit)

Stored in `src/data/reviews.ts`. Text is reproduced exactly as the customer wrote it, including the run-on in Geraldine's. Do not clean up grammar; edited testimonials read as fabricated.

```ts
export const reviews = [
  {
    id: 'operations-llc',
    author: 'Operations LLC',
    profile: 'https://www.google.com/maps/contrib/118418934525877168530/reviews?hl=en-US',
    reviewCount: null,
    localGuide: false,
    photos: 0,
    when: 'a month ago',
    rating: 5,
    service: 'yard-cleanup',
    body: `We had a great experience with Green Line Lawn Care LLC. Sir Jaydin was very responsive and easy to communicate with from start to finish. He arrived on time, worked efficiently, and cleaned the property thoroughly. He was polite, professional, and respectful throughout the service. We really appreciate his fast and quality work and would definitely recommend them to anyone looking for reliable lawn care services.`,
  },
  {
    id: 'ryan-dunahoe',
    author: 'Ryan Dunahoe',
    profile: 'https://www.google.com/maps/contrib/108265717777346508581/reviews?hl=en-US',
    reviewCount: 7,
    localGuide: false,
    photos: 5,
    when: 'a month ago',
    rating: 5,
    service: 'mowing',
    body: `Jaydin is dependable, hardworking, and takes pride in doing quality work. He is honest, professional, and pays attention to detail. If you're looking for reliable lawn care and someone who will treat your property with care, I highly recommend him.`,
  },
  {
    id: 'chris-b',
    author: 'Chris B',
    profile: 'https://www.google.com/maps/contrib/103403786676355589518/reviews?hl=en-US',
    reviewCount: 9,
    localGuide: false,
    photos: 0,
    when: 'a month ago',
    rating: 5,
    service: 'mowing',
    body: `Exceptional work, and very keen to detail. This company performs quality work at a fair price. They've established a long term relationship and I'd recommend them to all my neighbors and friends!`,
  },
  {
    id: 'geraldine-brown',
    author: 'Geraldine Brown',
    profile: 'https://www.google.com/maps/contrib/114608951183130337359/reviews?hl=en-US',
    reviewCount: 93,
    localGuide: true,
    photos: 3,
    when: 'Edited a month ago',
    rating: 5,
    service: 'yard-cleanup',
    body: `Very professional work and always pays attention to detail guaranteed customer satisfaction.I recommended this business highly.Even the most difficult job will be awesome. Landscape detail to a perfection.`,
  },
  {
    id: 'josiah-barbeau',
    author: 'Josiah Barbeau',
    profile: 'https://www.google.com/maps/contrib/102567892405148266786/reviews?hl=en-US',
    reviewCount: 1,
    localGuide: false,
    photos: 0,
    when: 'a month ago',
    rating: 5,
    service: 'mowing',
    body: `Outstanding lawn care service. The business is consistently reliable, punctual, and highly professional in all aspects of their work. Every visit is completed with strong attention to detail, and the results are always clean, well-maintained, and visually impressive. Communication is clear and efficient, and the level of care shown in their work reflects a high standard of quality. I would confidently recommend this lawn care service to anyone seeking dependable and professional yard maintenance.`,
  },
  {
    id: 'salvador-moreno',
    author: 'Salvador Moreno',
    profile: 'https://www.google.com/maps/contrib/106708663472943224547/reviews?hl=en-US',
    reviewCount: 4,
    localGuide: false,
    photos: 0,
    when: 'a month ago',
    rating: 5,
    service: 'gutter-cleaning',
    body: `Jaydin came out and cleaned all of the gutters around our roof and did a great job. He was professional, easy to work with, and showed up when he said he would. Everything was cleaned out thoroughly, and he made sure the area was left clean before he left.

It's refreshing to find someone who takes pride in their work. I wouldn't hesitate to recommend Jaydin to anyone needing their gutters cleaned!`,
  },
] as const;
```

Homepage uses Chris B, Salvador Moreno, and Ryan Dunahoe, in that order. Chris B leads because "very keen to detail" is the line that supports the whole design concept.

---

## 7. Photo assets

Already processed and delivered. All Instagram chrome removed: 84px from each side to clear the navigation arrows, 74px from the bottom to clear the dot indicators, and 42px from the top of `front-lawn-after` for the overlay bar.

```
/public/photos/
  hero/
    edge-line-16x9.jpg    1920x1080   the striped lawn and driveway edge. HERO.
    edge-line-3x4.jpg     1200x1600
    edge-line-1x1.jpg     1200x1200   social
  pairs/
    side-yard-before.jpg          1200x1600
    side-yard-after.jpg           1200x1600
    back-lawn-before.jpg          1200x1600
    back-lawn-after.jpg           1200x1600
    front-lawn-before.jpg         1200x1600
    front-lawn-after.jpg          1200x1600
    commercial-island-before.jpg  1200x1600
    commercial-island-after.jpg   1200x1600
  clean/
    (nine full-frame chrome-free originals, for future crops)
  sidewalk-edge.jpg       the original low-angle sidewalk shot, used on /services/edging-and-trimming
```

**Known limitation, state it rather than hide it.** The four pairs were shot from different camera positions, and the commercial island pair was shot on two different days (overcast before, full sun after). Automated registration was attempted with SIFT feature matching and a rotation-locked RANSAC and produced 6 to 9 inliers per pair, which is noise. The pairs are hand-framed to a shared horizontal anchor. They read correctly in a wipe comparison but they are not pixel-registered and no amount of cropping will make them so.

Going forward, the shot protocol for Jaydin: pick a findable mark on the ground, hold the phone at chest height, no zoom, shoot the before. Stand on the same mark when the job is done and shoot again. Those pairs register on their own.

**Delivery.** Convert to AVIF with WebP fallback at build. Serve through `next/image` with explicit dimensions and `sizes`. The hero gets `priority` and a blur placeholder derived from the asset. Everything else is lazy.
---

## 8. The estimate flow

### 8.1 Why multi-step

Form field count has a measurable cost. Current benchmarks put the drop-off at roughly 1.5 percentage points per field up to five fields and roughly 2.8 points per field beyond that, and mobile completion runs at about half of desktop. This form needs more than five fields to produce a quotable lead, so it is split. Multi-step formats with a progress indicator consistently and substantially outperform the equivalent single-step form on the same field set.

Four steps, three fields maximum per step, with a progress rule (the line device, filling left to right) rather than a dot stepper.

### 8.2 Steps

**Step 1. What do you need?**
Multi-select from the seven services plus "something else". Tappable rows, minimum 48px tall, not a dropdown. Nothing to type, so the first commitment costs nothing.

**Step 2. Where is it?**
Address (single line, `autocomplete="street-address"`), city, ZIP (`inputmode="numeric"`, `autocomplete="postal-code"`). ZIP validates against the served list on blur. Outside the core area shows an inline honest message and still allows submission, flagged `out_of_area` on the lead.

**Step 3. Show us.**
Photo upload. **Library picker, not camera.** Use `<input type="file" accept="image/*" multiple>` with **no `capture` attribute**, because adding `capture` forces the camera and the client wants people choosing from the roll. Up to six photos. Optional, framed as: "Photos get you an accurate price without us needing to come out first."

**Step 4. How do we reach you?**
Name, phone (`inputmode="tel"`, `autocomplete="tel"`), email (optional), notes (optional textarea). SMS consent checkbox per section 13.

Submit button reads `Send my estimate request` and the resulting confirmation reads `Estimate request sent`. The verb does not change between the action and its result.

### 8.3 Photo pipeline

The single largest source of failure in this feature is iPhone HEIC. Since iOS 11 the camera writes HEIC by default, no browser natively decodes `image/heic`, and iOS does not reliably transcode on upload when the file is picked from the Files app rather than the photo roll. Since this form is now a library picker, the roll is exactly where those files live.

Client-side pipeline, in order:

1. Read the `File`.
2. Attempt `createImageBitmap(file)`. Chrome 105+ and recent Safari can decode HEIC natively in some paths.
3. On failure, fall back to `heic2any` (WASM) to decode to a bitmap.
4. Draw to an `OffscreenCanvas`, downscale so the long edge is 1600px.
5. Re-encode as JPEG at quality 0.82.
6. Strip EXIF, and specifically discard GPS. Customer home coordinates must never be stored.
7. Request a signed upload URL from `/api/upload-url` and PUT directly to Supabase Storage. The file never passes through a serverless function.

A 4MB phone photo comes out around 250KB. This is what makes the upload survive a bad LTE connection in a driveway, and it guarantees the admin never opens a file it cannot render.

Show per-file progress. Allow removing a file before submit. On decode failure after both paths, show the file as skipped with a plain reason rather than failing the whole submission.

### 8.4 Spam

Honeypot field (visually hidden, not `display:none`, and `tabindex="-1"` with `autocomplete="off"`), a minimum time-on-form of 3 seconds, and Cloudflare Turnstile. No visible captcha, no arithmetic puzzle.

### 8.5 Validation and errors

Validate on blur, not on keystroke. Error text sits directly beneath the field, in `--ink` on a `--concrete-00` field with a 2px `--turf-ink` left edge (this is a form field, not a card, so it is not the banned side-tab pattern). Errors state what happened and how to fix it. They do not apologize and they are never vague.

Every step is a real route segment (`/estimate?step=2`) so the back button behaves and a partial fill survives an accidental navigation. Persist in-progress answers to `sessionStorage`.

---

## 9. Database

Supabase Postgres. This is the site's own project, separate from the blog-farm project. Row Level Security enabled on every table with no permissive public policies. All writes go through server-side code holding the service role key. The service role key is never exposed to the browser and never appears in `NEXT_PUBLIC_*`.

```sql
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
  source        text,                       -- 'website','referral','google','instagram','facebook','walk-up'
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
  sms_consent_text text,                    -- exact wording shown at capture
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
  -- iCalendar bookkeeping
  ics_uid       text not null unique default (gen_random_uuid()::text),
  ics_sequence  int not null default 0,
  last_modified timestamptz not null default now()
);
create index on gl_jobs (starts_at);
create index on gl_jobs (status, starts_at);

-- Bump SEQUENCE and LAST-MODIFIED on any change that a calendar client
-- must observe. This is what makes edits propagate to subscribers.
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
  token        text not null unique,        -- 32+ bytes, base64url
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
```

**Storage.** Bucket `lead-photos`, private. Access exclusively through signed URLs: signed PUT for upload, short-lived signed GET for admin viewing. Never make the bucket public.

---

## 10. API routes

### `POST /api/estimate`
Body: services[], address, city, zip, name, phone, email, notes, smsConsent, photoPaths[], turnstileToken, utm, honeypot, elapsedMs.

1. Verify Turnstile server-side. 2. Reject if honeypot filled or elapsedMs < 3000. 3. Normalize phone to E.164, reject invalid. 4. Rate limit by IP, 5 per hour. 5. Insert `gl_leads`, attach `gl_lead_photos`. 6. Upsert `gl_contacts` matched on E.164 phone. 7. Fire both SMS messages. 8. Return `{ ok: true, leadId }`.

All SMS and contact-upsert work happens after the lead row is committed and failures there must not fail the request. The lead is the thing that matters.

### `POST /api/upload-url`
Body: filename, contentType, bytes. Validates the MIME type is an image and bytes are under 8MB, then returns a Supabase signed upload URL scoped to a generated path. Rate limited.

### `GET /api/calendar/[token].ics`
Section 12.

### `GET /api/calendar/job/[id].ics`
Section 12.

### `POST /api/revalidate`
Section 14.

### `POST /api/sms/status`
Telnyx delivery receipts. Verify the webhook signature, update `gl_sms_log.status`.

---

## 11. Admin CRM

Deliberately small. This is a tool for one person on a phone in a truck, not a sales platform. Every primary action must be reachable with one thumb.

**Auth.** Supabase Auth, email and password, a single admin user. Middleware guards `/admin/*`. No public signup route. Session cookie `httpOnly`, `secure`, `sameSite=lax`.

**`/admin` dashboard.** New leads count, today's jobs, this week's scheduled revenue, the last five SMS messages. No chart library. Numbers set in the `data` type token with tabular figures.

**`/admin/leads`.** Default view is a list, not a kanban board, because a board is unusable on a phone. A segmented control filters by status. Each row: name, city, services, age, and a status chip. Tapping opens the detail.

**`/admin/leads/[id]`.** Photos in a swipeable strip at native aspect, tap to open full screen. Call and Text buttons using `tel:` and `sms:` so the phone's own apps handle it. Status selector. A quoted-amount field. A "Schedule this" action that opens the job composer prefilled from the lead. A "Create contact" action if none was matched.

**`/admin/contacts`.** Searchable list with a manual Add contact form, which the client called out specifically. Detail view shows job history, total billed, cadence, tags, and notes.

**`/admin/calendar`.** Month and week views. Drag to reschedule on desktop; on mobile, tap a job and edit the time, because drag on a touch calendar is a usability trap. Jobs color-coded by `job_type`: estimates in `--turf`, service in `--olive`, followups in `--concrete-30`. Build this with `date-fns` and a hand-rolled grid rather than a heavy calendar dependency; the requirements are simple and calendar libraries are large and hard to restyle away from their own defaults.

**`/admin/jobs/[id]`.** Edit, cancel, mark complete, and an "Add to my calendar" button serving the single-event ICS.

**`/admin/settings`.** The calendar subscription URL with a copy button and a QR code, feed regeneration, served ZIP list, SMS template editing, and business hours.

---

## 12. Calendar and Apple sync

This was researched carefully because there is a lot of confidently wrong advice about it. The relevant facts:

- Apple publishes **no public REST calendar API, no SDK, and no developer portal** for iCloud Calendar. CalDAV is the only programmatic path.
- CalDAV against `caldav.icloud.com:443` requires a manually generated 16-character app-specific password from the Apple account settings. There is no way to generate one programmatically and no OAuth.
- Apple Calendar polls subscribed feeds **about once an hour by default**, and a Mac user can set a specific calendar to refresh every 5 or 15 minutes via Get Info. On iPhone the interval follows Settings, Calendar, Accounts, Fetch New Data. This is the fastest refresh of any major calendar client; Google is 8 to 24 hours with no user control at all.

So the plan is three tiers, and tiers 1 and 2 are what actually ship.

### 12.1 Tier 1: subscribed feed (default, ships first)

`GET /api/calendar/[token].ics` returns the full job calendar. Jaydin taps a `webcal://` link once on his iPhone and it lands in iCloud, which propagates to his Mac and iPad automatically.

Required properties, and the ones that are usually skipped are the ones that matter:

```
BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//Green Line Lawn Care//Jobs//EN
CALSCALE:GREGORIAN
METHOD:PUBLISH
X-WR-CALNAME:Green Line Jobs
X-WR-CALDESC:Scheduled jobs and estimates
X-WR-TIMEZONE:America/Los_Angeles
X-PUBLISHED-TTL:PT1H
REFRESH-INTERVAL;VALUE=DURATION:PT1H
BEGIN:VTIMEZONE
TZID:America/Los_Angeles
BEGIN:DAYLIGHT
TZOFFSETFROM:-0800
TZOFFSETTO:-0700
TZNAME:PDT
DTSTART:19700308T020000
RRULE:FREQ=YEARLY;BYMONTH=3;BYDAY=2SU
END:DAYLIGHT
BEGIN:STANDARD
TZOFFSETFROM:-0700
TZOFFSETTO:-0800
TZNAME:PST
DTSTART:19701101T020000
RRULE:FREQ=YEARLY;BYMONTH=11;BYDAY=1SU
END:STANDARD
END:VTIMEZONE
BEGIN:VEVENT
UID:{gl_jobs.ics_uid}@greenlinelawncare.com
SEQUENCE:{gl_jobs.ics_sequence}
DTSTAMP:{now, UTC}
LAST-MODIFIED:{gl_jobs.last_modified, UTC}
DTSTART;TZID=America/Los_Angeles:{starts_at}
DTEND;TZID=America/Los_Angeles:{ends_at}
SUMMARY:{title}
LOCATION:{address_line}\, {city}\, CA {zip}
DESCRIPTION:{contact name}\n{phone}\n\n{services}\n\n{notes}
STATUS:{CONFIRMED|CANCELLED}
URL:https://{domain}/admin/jobs/{id}
BEGIN:VALARM
TRIGGER:-PT60M
ACTION:DISPLAY
DESCRIPTION:{title}
END:VALARM
END:VEVENT
END:VCALENDAR
```

Implementation rules that are not optional:

- **Fold lines at 75 octets** with a CRLF and a single leading space on continuation lines, per RFC 5545. Long addresses and notes will exceed this and unfolded output breaks strict parsers.
- **Escape** commas, semicolons, and backslashes in TEXT values. Newlines become a literal `\n`.
- **Line endings are CRLF throughout.**
- **Cancelled jobs stay in the feed** with `STATUS:CANCELLED` and an incremented `SEQUENCE`. Do not delete the VEVENT. Most calendar clients do not remove an event that simply disappears from the feed, so deletion leaves a ghost on the phone forever.
- **Window the feed** to jobs from 90 days ago through 365 days ahead, so it does not grow without bound.
- **`UID` is stable for the life of the job.** It is generated once at insert and never regenerated.
- **`SEQUENCE` increments on every observable change,** handled by the `gl_bump_ics` trigger in section 9.
- Serve `Content-Type: text/calendar; charset=utf-8` with `Cache-Control: public, max-age=300`.
- Support `HEAD` and `If-Modified-Since`, returning 304 where possible. Some clients poll aggressively.
- The token is at least 32 random bytes, base64url. Treat the URL as a bearer credential. A revoked token returns 404, not 403, so the URL reveals nothing.
- Log `last_fetched` and `fetch_count` so the settings page can show whether the subscription is actually alive.

In `/admin/settings`, present the URL in both `webcal://` and `https://` forms, plus a QR code, plus a one-line instruction: on iPhone, tap the webcal link; on Mac, File then New Calendar Subscription, and set auto-refresh to 15 minutes if you want it faster than hourly.

### 12.2 Tier 2: single-event file (same sprint)

`GET /api/calendar/job/[id].ics` returns one `METHOD:PUBLISH` VEVENT for immediate adding. Surfaced as "Add to my calendar" in the job detail and attached to the confirmation email.

**Known limitation, documented on the Apple developer forums:** iOS Safari adds the event correctly the first time, but does **not** reliably apply updates from a re-downloaded ICS even when UID is unchanged and SEQUENCE is incremented. So tier 2 is for adding and tier 1 is the source of truth for changes. Do not build an update flow around single-file downloads.

### 12.3 Tier 3: CalDAV push (optional, behind a settings toggle, build last)

Server-to-server PUT of VEVENT resources to iCloud over CalDAV, authenticated with an Apple app-specific password stored encrypted at rest. This gives genuinely instant appearance plus edit and delete propagation.

Costs, stated honestly: it is a real credential to secure and rotate, it needs PROPFIND principal discovery to locate the calendar home, there is no push in either direction so change detection means polling, and a plain GET to `caldav.icloud.com` returns an empty HTTP 400 because the server answers WebDAV verbs and not `GET /`, which will confuse anyone debugging it.

Build tiers 1 and 2, run them for two weeks, and only build tier 3 if Jaydin says the hourly lag actually bothers him. It probably will not.

---

## 13. SMS

Telnyx, matching the existing stack. Two messages fire on lead submission.

**To Jaydin:**
```
New estimate request
{name} · {city}
{services}
{phone}
{photoCount} photo(s)
{siteUrl}/admin/leads/{id}
```

**To the customer:**
```
Green Line Lawn Care: thanks {firstName}, we got your request.
Jaydin will text or call you back today with a price.
Questions in the meantime, reply here or call (925) 436-6691.
Reply STOP to opt out.
```

**Consent.** The checkbox is unchecked by default and its label is stored verbatim on the lead row along with the timestamp:

> Text me about my estimate at this number. Message and data rates may apply. Message frequency varies. Reply STOP to opt out or HELP for help.

Link to `/sms-terms` beside it. Honor STOP, START, and HELP on the inbound webhook and suppress sends to any number that has opted out. The consent record is the defense if a carrier ever asks, so do not store a boolean alone.

A2P 10DLC brand and campaign registration is required before production traffic. `TODO(gibson)` register the campaign under Green Line Lawn Care LLC. Use case: customer care, low volume mixed.

**Review request.** Not in v1. Add later as a job-completion trigger sending the Google review link 24 to 48 hours after completion, which is where the response rate is highest. Requires the Place ID first.
---

## 14. Blog and blog-farm integration

Green Line becomes a new tenant on the existing multi-tenant blog-farm, the same way JB Lawn Care was onboarded. Understand the architecture before writing code, because the failure modes here are specific and have already bitten this system once.

### 14.1 Architecture

Blog-farm is a **separate Vercel application with its own Supabase project**. It is not part of this site. The relationship is:

```
blog-farm (Vercel app + its own Supabase)
  Vercel cron  →  /api/cron/autopilot?business=greenline
                  Phase 1: strategist picks topic → web research → write → save draft
                  Phase 2: template → QC scoring → quality gate → publish
                            │
                            ├─ writes status to blog_generated_posts
                            ├─ upserts into blog_existing_posts (dedup memory)
                            └─ POST to this site's revalidate_url
                                      │
                                      ▼
greenline site (this build)
  lib/blog.ts reads blog-farm Supabase READ-ONLY with the anon key
  /api/revalidate receives the hook and calls revalidatePath()
  /blog and /blog/[slug] render with ISR
```

The site never writes to the blog-farm database. It reads published posts and it revalidates.

### 14.2 Tables

Verify these against the live schema before running anything; the column list below is reconstructed from the JB onboarding and may have drifted.

| Table | Role |
|---|---|
| `blog_businesses` | tenant registry: slug, name, domain, publish_mode, phone, revalidate_url, gsc_property_url, indexnow_key, active |
| `blog_brand_kits` | per-tenant voice: company_description, target_audience, pricing_info, value_propositions, brand_voice, dos, donts, cta_templates, writing_style_examples, internal_link_targets, content_strategy |
| `blog_existing_posts` | dedup and internal-link memory. Seed with anything already published. |
| `blog_generated_posts` | the posts themselves |
| `blog_content_queue` | optional pre-scheduled topics |
| `blog_generation_logs` | run timing and errors |

**Status values are constrained to exactly:** `pending`, `approved`, `published`, `rejected`, `revision_needed`. There is no `failed`. Using it throws.

**Known schema trap:** `github_owner` and `github_repo` on `blog_businesses` are `NOT NULL` even for `publish_mode = 'nextjs'`, which does not use them. Supply values or the insert fails with a 23502.

### 14.3 Onboarding SQL

```sql
-- 1. TENANT
insert into blog_businesses (
  slug, name, domain, publish_mode, phone,
  github_owner, github_repo, github_branch,
  blog_file_prefix, blog_index_path, sitemap_path,
  revalidate_url, active
) values (
  'greenline',
  'Green Line Lawn Care LLC',
  'greenlinelawncare.com',              -- TODO(gibson) real domain
  'nextjs',
  '925-436-6691',
  'gibsonthompson',                      -- required despite nextjs mode
  'greenline-lawn',
  'main',
  null, null, null,
  'https://greenlinelawncare.com/api/revalidate',
  true
);

-- 2. BRAND KIT
insert into blog_brand_kits (
  business_id, company_description, target_audience, pricing_info,
  value_propositions, brand_voice, dos, donts, cta_templates,
  writing_style_examples, internal_link_targets, content_strategy
) values (
  (select id from blog_businesses where slug = 'greenline'),

  'Green Line Lawn Care LLC is an owner-operated lawn care and property maintenance company serving the San Francisco Bay Area, with a core service area in the East Bay: Oakland, Berkeley, Alameda, San Leandro, Hayward, Castro Valley, San Lorenzo, Union City, Fremont, Newark, Richmond, and El Cerrito. Services are lawn mowing and maintenance, edging and trimming, yard and landscape cleanup, weed removal, hedge and shrub trimming, gutter cleaning, and commercial property upkeep. Owner and operator is Jaydin. 5.0 Google rating from 6 reviews. Free same-day estimates. Customers can send photos through the website to get a price without an on-site visit.',

  'Bay Area homeowners, primarily East Bay, who want their property maintained on a schedule they do not have to manage. Mix of working professionals, families, and older homeowners who can no longer do the yard themselves. Also landlords, property managers, and small commercial property owners with storefronts, sign islands, and parking strips. They find services through Google and Google Maps. They have usually been burned by a previous crew that stopped showing up. They value someone who arrives when they said they would, communicates, and leaves the property clean.',

  'Free estimates, no charge and no obligation. Same-day quotes on most requests. Pricing quoted per property after seeing photos or the site. Recurring weekly and every-other-week maintenance available at a lower per-visit rate than one-time service. No hidden fees, the quoted price is the price.',

  'Owner-operated, so the person who quoted the job is the person doing it. Shows up when he said he would. Cleans up completely before leaving, including blowing off walks and drives. Attention to the edge line and detail work, which is what customers actually notice. Free estimates with a same-day turnaround. Photo-based quoting so no one has to wait around for a site visit. Licensed and insured.',

  'Plain, direct, and specific. Written the way a competent tradesperson explains something to a homeowner: no hedging, no filler, no salesmanship. Confident without boasting. Uses real numbers and real plant and turf names rather than vague claims. Second person. Short sentences. Assumes the reader is smart but does not know lawn care.',

  'Use concrete Bay Area specifics: tall fescue is the dominant local turf, the mow height is three to three and a half inches, the one-third rule, weekly mowing March through October and less in the cool months, deep and infrequent watering at one to one and a half inches per week including rainfall. Name real cities and real local conditions. Cite water districts and university extension sources where a claim needs backing. Include at least two external links to authoritative sources per post. Answer the title question in the first hundred words. Use tables for comparisons and schedules.',

  'Never use: transform, elevate, streamline, seamless, world-class, take your outdoor space to the next level, passionate about lawns, unlock, supercharge. Never use em-dashes; use commas, periods, colons, or parentheses. Do not open a post with a rhetorical question. Do not write a paragraph that could apply to a lawn care company in any other state. Do not invent statistics, prices, or customer stories. Do not claim licenses, certifications, or affiliations the business does not hold. Do not promise same-day service outside the East Bay core area.',

  'Get a free estimate at greenlinelawncare.com or call (925) 436-6691. | Send a few photos of your yard and get a price the same day. | Set up weekly or every-other-week service and stop thinking about it.',

  'The edge is the tell. A lawn that has been mowed and a property that is being maintained look identical from the street until you get to where the grass meets the concrete. | Cut tall fescue at three to three and a half inches and never take off more than a third of the blade at once. Shorter does not mean longer between visits, it means a thinner lawn and more weeds.',

  '/services/mowing | /services/edging-and-trimming | /services/yard-cleanup | /services/weed-removal | /services/hedge-and-shrub | /services/gutter-cleaning | /services/commercial-maintenance | /areas | /work | /reviews | /estimate',

  'Five pillars. 1. Lawn maintenance how-to: mowing height, frequency, watering, seasonal calendars, all specific to Bay Area turf. 2. Seasonal Bay Area guides: what a yard needs in each month given the local wet winter and dry summer. 3. Cost and hiring guides: what lawn care costs in the East Bay, how to evaluate a crew, recurring versus one-time. 4. Problem diagnosis: brown patches, thatch, weeds, bare spots, drainage, with honest guidance on what a homeowner can fix versus what needs a crew. 5. City and neighborhood guides for the twelve core service cities, each grounded in that city local water district rules, lot sizes, and housing stock. Cadence starts at one post per week and ramps only after the first ten posts hold a QC overall score of seven or better.'
);

-- 3. SEED EXISTING POSTS
-- Green Line has no published posts at launch, so seed nothing.
-- If launch content is hand-written first, insert one row per post so the
-- strategist does not re-pick those topics and can link to them internally.
```

### 14.4 Site-side integration

**`lib/blog.ts` must use a lazy Supabase client.** This is the bug that cost a day on the JB build and it will recur here.

The cause: client components import type definitions and label constants from `lib/blog.ts`. Because they are `'use client'`, the whole module gets bundled to the browser, and a top-level `createClient(process.env.BLOG_FARM_SUPABASE_URL!, ...)` executes there, where the variable is `undefined`, throwing `supabaseUrl is required`. The site then silently falls back to seed posts and looks like an env-var problem when it is not.

```ts
import { createClient, SupabaseClient } from '@supabase/supabase-js'

const BUSINESS_SLUG = 'greenline'
let _client: SupabaseClient | null | undefined

function getBlogFarmClient(): SupabaseClient | null {
  if (_client !== undefined) return _client
  const url = process.env.BLOG_FARM_SUPABASE_URL
  const key = process.env.BLOG_FARM_SUPABASE_KEY
  _client = url && key ? createClient(url, key) : null
  return _client
}
```

Every function then calls `getBlogFarmClient()` and returns an empty array when it is null. No module-level client, ever.

**`app/api/revalidate/route.ts`** accepts `{ secret, slug }`, compares the secret against `REVALIDATION_SECRET` in constant time, and calls `revalidatePath('/blog/' + slug)`, `revalidatePath('/blog')`, and `revalidatePath('/')`. Returns 401 on mismatch.

**`/blog` and `/blog/[slug]`** use `export const revalidate = 3600` plus the on-demand hook. Blog posts render inside the same design system: National Park for headings, Public Sans for body, concrete surface, 68ch measure, and the line device as the horizontal rule between sections. They must not look like a different website.

Do not hardcode a `BLOG_POSTS` array anywhere, including a homepage teaser. On the JB build that array kept showing three stale posts forever after the pipeline went live.

### 14.5 Cron and timing

Two Vercel crons per business, spaced 6 to 7 hours apart, because the pipeline runs one action per invocation and a single daily cron produces a two-day minimum gap between posts.

Measured timings from `blog_generation_logs`: Phase 1 takes 230 to 245 seconds, Phase 2 takes 72 to 210 seconds. Vercel Hobby caps `maxDuration` at 300 seconds, which is why the split is mandatory rather than stylistic.

Pick a slot that does not collide with the five existing tenants. Suggested: `06:00 UTC` for Phase 2 and `13:00 UTC` for Phase 1. `TODO(gibson)` confirm against the current `vercel.json` in the blog-farm repo.

**Cadence:** maximum 3 posts per week, minimum 1 day between posts. Start at 1 per week per the content strategy above and ramp.

**Quality gate:** overall score 7 or better and info_gain 6 or better with no hallucination flags auto-publishes. One or two flags with overall 7 and factual_accuracy 7 auto-publishes with an SMS warning. Three or more flags holds for review. QC weighting is SEO 25 percent, AEO 25 percent, brand voice 20 percent, info gain 15 percent, content quality 10 percent, technical 5 percent.

### 14.6 Launch checklist for the blog

1. Run the SQL in 14.3 against the blog-farm Supabase.
2. Add `BLOG_FARM_SUPABASE_URL`, `BLOG_FARM_SUPABASE_KEY`, and `REVALIDATION_SECRET` to this site's Vercel project. **Then redeploy.** Vercel does not pick up variables added after the last build, and this is the second thing that will look like a code bug and is not.
3. Deploy `lib/blog.ts` and `app/api/revalidate/route.ts`.
4. Test the revalidate route directly with a curl before wiring the cron.
5. Add the two crons to the blog-farm `vercel.json`.
6. Trigger one manual run and confirm the post appears at `/blog`.

---

## 15. SEO and structured data

### 15.1 Schema

Site-wide `LandscapingBusiness` (a `LocalBusiness` subtype) in the root layout:

```json
{
  "@context": "https://schema.org",
  "@type": "LandscapingBusiness",
  "@id": "https://greenlinelawncare.com/#business",
  "name": "Green Line Lawn Care LLC",
  "telephone": "+1-925-436-6691",
  "url": "https://greenlinelawncare.com",
  "image": "https://greenlinelawncare.com/photos/hero/edge-line-1x1.jpg",
  "priceRange": "$$",
  "areaServed": [ { "@type": "City", "name": "Oakland" }, ... ],
  "openingHoursSpecification": [{
    "@type": "OpeningHoursSpecification",
    "dayOfWeek": ["Monday","Tuesday","Wednesday","Thursday","Friday"],
    "opens": "08:00", "closes": "17:00"
  }],
  "sameAs": [
    "https://www.instagram.com/greenlinelawncare.llc/",
    "https://www.facebook.com/profile.php?id=61566223880858"
  ],
  "hasOfferCatalog": { "@type": "OfferCatalog", "itemListElement": [ ...7 services... ] },
  "aggregateRating": { "@type": "AggregateRating", "ratingValue": "5.0", "reviewCount": "6" },
  "review": [ ...the six reviews... ]
}
```

Plus `Service` on each service page, `BreadcrumbList` sitewide, `FAQPage` where FAQs exist, and `BlogPosting` on posts.

### 15.2 The honest note about star ratings

`AggregateRating` and `Review` are included above, and they will **not** produce star ratings in Google search results. Google removed self-serving reviews from review snippet eligibility in September 2019 and has reinforced the policy since: when the entity being reviewed controls the reviews about itself, pages using `LocalBusiness` or `Organization` structured data are ineligible for the star feature. This applies whether the reviews are hand-coded or pulled in through an embedded Google reviews widget.

It is still worth including, because Google reads and processes the markup for entity understanding and it feeds AI Overviews and AI Mode. But set the expectation now: the stars come from the Google Business Profile, not from this markup. Anyone promising otherwise is selling something.

### 15.3 Metadata

Unique title and description per page, written by hand, no template with a swapped noun. Titles under 60 characters, descriptions 140 to 158. Canonical on every page. OG image per page type, generated at build with `next/og` using the actual photography and National Park type rather than a generic gradient card.

`/thank-you`, `/admin/*`, and all API routes are `noindex`. Sitemap excludes them.

Dynamic `sitemap.xml` from the route set plus published blog posts. `robots.txt` allows everything except `/admin` and `/api`.

---

## 16. Performance and accessibility

**Stack.** Next.js **16.2.11** pinned exactly, not a caret range. The July 2026 security release covers four high-severity items including a Server Actions denial of service, a middleware and proxy bypass under Turbopack with a single configured locale, and two SSRF paths. React 19.2. Turbopack is the default bundler in 16. Tailwind with the default theme fully replaced by the tokens in section 2; an unmodified default scale is itself a documented tell. Deployed on Vercel.

**Budget.**
- LCP under 2.0s on a simulated 4G mobile connection. The LCP element is the hero photograph.
- CLS 0. Every image has explicit dimensions and both fonts are loaded through `next/font/local` with metric-adjusted fallbacks.
- INP under 200ms.
- First-party JavaScript under 90KB gzipped on marketing routes. The homepage should be almost entirely server-rendered; the only client components are the estimate form, the gallery wipe, and the mobile nav.
- No calendar library, no charting library, no animation library. The one orchestrated moment in 2.5 is an SVG `stroke-dashoffset` transition in CSS.

**Accessibility, to a real floor and not a badge.**
- Every interactive element reachable and operable by keyboard with a visible focus ring, `--ink` at 2px with 2px offset, measured 11.44:1.
- Heading levels never skip. One `h1` per page.
- The gallery wipe is a `role="slider"` with `aria-valuenow`, `aria-valuemin`, `aria-valuemax`, and arrow-key support.
- Form inputs have real `<label>` elements, not placeholder text doing double duty.
- Errors are associated with `aria-describedby` and announced through a polite live region.
- Touch targets 48px minimum.
- `prefers-reduced-motion` respected everywhere.
- Contrast: every combination in section 2.3 is measured. Do not introduce a new color without measuring it.

---

## 17. Environment variables

Names only. Values live in Vercel and never in the repo, in a comment, or in this document.

```
NEXT_PUBLIC_SITE_URL
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY
SUPABASE_SERVICE_ROLE_KEY          server only, never NEXT_PUBLIC
NEXT_PUBLIC_GOOGLE_PLACE_ID        TODO(gibson)
TELNYX_API_KEY
TELNYX_MESSAGING_PROFILE_ID
TELNYX_FROM_NUMBER
OWNER_SMS_NUMBER
TURNSTILE_SITE_KEY                 public
TURNSTILE_SECRET_KEY
BLOG_FARM_SUPABASE_URL
BLOG_FARM_SUPABASE_KEY
REVALIDATION_SECRET
CALENDAR_FEED_PEPPER               extra entropy for feed tokens
ICLOUD_APPLE_ID                    tier 3 only
ICLOUD_APP_PASSWORD                tier 3 only, encrypted at rest
```

Add `gitleaks` to CI. A committed key on a site with a public repo is a same-day incident.

---

## 18. Build order

Each milestone ends in something deployable and reviewable. Do not build the whole thing and then integrate.

**M1. Foundation.** Repo, Next.js 16.2.11, Tailwind with the token layer from section 2, both fonts self-hosted, the black header and footer, the line device as a reusable component, and a tokens page at `/_design` (noindex, removed before launch) showing every color with its measured contrast ratio, every type step, and the spacing scale. Review this before any page is built.

**M2. Home.** All seven sections in order. Real copy from section 4.1, real photography. This is the milestone where the silhouette test from 2.2 gets run. If it fails, stop and fix the structure before continuing.

**M3. Estimate flow.** Four steps, the HEIC pipeline, signed uploads, Turnstile, the leads and photos tables, and both SMS messages. End to end on a real iPhone with a real HEIC file from the photo library, not a simulator.

**M4. Admin.** Auth, dashboard, leads list and detail, contacts with manual add, settings.

**M5. Calendar.** Jobs table with the SEQUENCE trigger, the calendar views, the job composer, the subscription feed, and the single-event file. Test by subscribing on an actual iPhone, then editing a job and confirming the change lands within the hour.

**M6. Content pages.** Seven service pages, twelve city pages, the areas hub, work, reviews, about, and the legal pages.

**M7. Blog.** Section 14 in the order given in 14.6.

**M8. Launch.** Schema validation, Lighthouse against the budget in section 16, sitemap, Search Console and Analytics, Place ID wired in, A2P campaign live, gitleaks clean.

---

## 19. Acceptance checklist

**Design**
- [ ] Zero instances of every item in the section 2.2 anti-pattern list
- [ ] Silhouette test passed against three competitors
- [ ] Section padding varies deliberately, no uniform rhythm
- [ ] `--turf` appears as text only on `--field` and `--black`, never on concrete
- [ ] Exactly one orchestrated motion moment on the site
- [ ] No box shadows on the marketing site
- [ ] Zero em-dashes in the entire repo

**Function**
- [ ] HEIC upload from an iPhone photo library succeeds and renders in admin
- [ ] Photo input opens the library, not the camera
- [ ] Out-of-area ZIP submits with an honest message and the `out_of_area` flag
- [ ] Both SMS messages deliver, consent text and timestamp stored
- [ ] Feed subscribes on a real iPhone; an edited job propagates within one hour
- [ ] A cancelled job shows as cancelled on the phone rather than lingering
- [ ] ICS lines fold at 75 octets and text values are escaped
- [ ] Blog post published from blog-farm appears at `/blog` after revalidation

**Quality**
- [ ] LCP under 2.0s, CLS 0, first-party JS under 90KB on `/`
- [ ] Every measured contrast pair passes its stated level
- [ ] Full keyboard pass with visible focus on every control
- [ ] No secret anywhere in the repo, gitleaks clean
- [ ] RLS on with no permissive public policies
- [ ] Storage bucket private, signed URLs only

---

## 20. Open items for Gibson

| Item | Needed for |
|---|---|
| Domain | everything, blocks launch |
| Google Place ID | review CTA, review QR code, review request SMS |
| Jaydin's surname | About page, author byline |
| Business email | footer, schema, confirmation email |
| Weekend hours | schema, hours display |
| Confirm the twelve Tier 1 cities | section 5.2 |
| Served ZIP list | estimate form validation |
| Blog-farm cron slots free at 06:00 and 13:00 UTC | section 14.5 |
| A2P 10DLC registration | SMS in production |
| Alignment corrections from the review tool | final photo pair crops |
