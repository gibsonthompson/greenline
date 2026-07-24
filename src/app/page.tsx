import Image from "next/image";
import Link from "next/link";
import BeforeAfter from "@/components/BeforeAfter";
import GoogleReviews from "@/components/GoogleReviews";
import ServiceArea from "@/components/ServiceArea";
import { SITE } from "@/data/site";
import { homepageServices } from "@/data/services";

const WRAP = "mx-auto max-w-[1340px] px-[clamp(1.1rem,4.2vw,4rem)]";
const PAD = "py-[clamp(3.4rem,5.6vw,5.4rem)]";

const Check = () => (
  <svg viewBox="0 0 20 20" fill="currentColor" className="h-[15px] w-[15px] flex-none text-lime-br" aria-hidden="true">
    <path d="M8 14.2 4.3 10.5l1.4-1.4L8 11.4l6.3-6.3 1.4 1.4z" />
  </svg>
);

const creds = [
  { t: "You Will Never Chase Us Down", d: "We arrive on the day we promised, every time, without a reminder call from you." },
  { t: "A Finished Look Every Visit", d: "Edging, trimming, and a full blow-down are included in your price, never billed as extras." },
  { t: "We Leave Nothing Behind", d: "Every clipping, branch, and bag leaves on our truck. Your curb stays clear." },
  { t: "A Price Today, Not Next Week", d: "Send a few photos and your written quote comes back the same day." },
];

const steps = [
  { t: "Send Photos", d: "Four quick questions and a few pictures off your phone. No appointment, nobody walking your property." },
  { t: "Get A Price", d: "A per-visit price for regular service, or a flat price for a one-time job. In writing, usually same day." },
  { t: "Pick Your Day", d: "Regular customers get a set weekday, so the yard is cut the same day every week or every other week." },
  { t: "We Take It From There", d: "We show up, do the whole job including edging and blow-off, and text you if we spot something you should know about." },
];

const faqs = [
  { q: "How fast will I hear back?", a: "Same day if you reach us during business hours. Next morning if you send it late at night or over the weekend." },
  { q: "Do I need to be home?", a: "No. We can price most yards off photos, which is why the form asks for them. If yours is unusual enough that we need to see it in person, we'll say so and set up a time." },
  { q: "How often does my lawn need cutting?", a: "Weekly from about March through October while it's actively growing, then every other week once it slows down. We adjust as the season changes instead of holding you to one schedule year-round." },
  { q: "What happens to the clippings?", a: "Usually we mulch them back into the lawn, where they break down and feed it. If the grass got ahead of us, or it's a cleanup job, we bag it and take it with us." },
  { q: "Are you licensed and insured?", a: "Yes. We can send the paperwork over if you're a landlord or property manager and need it on file." },
  { q: "Can you work around a code or HOA deadline?", a: "Yes, and those jump the line. Put the date in your estimate request and we'll schedule around it." },
];

export default function Home() {
  return (
    <>
      {/* ══ HERO ══ */}
      <section className="relative flex min-h-[min(86vh,780px)] items-end overflow-hidden bg-forest">
        <Image
          src="/photos/hero-wide.jpg"
          alt="A concrete walkway running between two freshly cut and sharply edged lawns"
          fill
          priority
          sizes="100vw"
          quality={82}
          className="object-cover object-[50%_64%]"
        />
        <div className="hero-veil" aria-hidden="true" />
        <div className={`relative w-full ${WRAP} pb-[clamp(3rem,5vw,4.5rem)] pt-[clamp(6rem,10vw,8.5rem)]`}>
          <h1 className="h1 max-w-[17ch] text-white">The Best-Looking Yard On Your Street</h1>
          <p className="lead mt-5 max-w-[52ch] text-white/95">
            Professional lawn care across the East Bay on a schedule you never have to manage.
            Rated 5.0 on Google. Send a few photos and your written quote comes back the same day.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/estimate" className="btn btn-l">Get My Free Estimate</Link>
            <a href={`tel:${SITE.phoneE164}`} className="btn btn-o">Call {SITE.phoneDisplay}</a>
          </div>
          {/* These two sit on ONE line at every width. flex-nowrap plus
              whitespace-nowrap on each item; the type steps down on small
              phones rather than wrapping to a second row. */}
          <div className="mt-8 flex flex-nowrap items-center gap-x-4 text-[0.8rem] text-[#d8e2d4] sm:gap-x-7 sm:text-[0.95rem]">
            <span className="inline-flex flex-none items-center gap-1.5 whitespace-nowrap">
              <span className="stars">&#9733;&#9733;&#9733;&#9733;&#9733;</span> 5.0 on Google
            </span>
            <span className="inline-flex flex-none items-center gap-1.5 whitespace-nowrap">
              <Check /> Licensed &amp; Insured
            </span>
          </div>
        </div>
      </section>

      {/* ══ CREDENTIALS ══ */}
      <div className="border-b border-line bg-paper-2">
        <div className={`${WRAP} grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4`}>
          {creds.map((c, i) => (
            <div key={c.t} className={`border-line px-6 py-7 ${i < 3 ? "lg:border-r" : ""} ${i < 2 ? "sm:border-b lg:border-b-0" : ""} ${i % 2 === 0 ? "sm:border-r lg:border-r" : ""}`}>
              <div className="h4 mb-1">{c.t}</div>
              <p className="max-w-[32ch] text-[0.9rem] text-mute-l">{c.d}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ══ SERVICES ══ */}
      <section id="services" className={PAD}>
        <div className={WRAP}>
          <div className="mb-9 grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,34ch)] lg:items-end">
            <div>
              <div className="rule" />
              <div className="kicker">Services</div>
              <h2 className="h2 mt-2">Complete Lawn And Property Care</h2>
            </div>
            <p className="text-mute-l">
              Everything your property needs to look its best, handled by one company on one schedule.
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {homepageServices.map((s) => (
              <Link
                key={s.slug}
                href={`/services/${s.slug}`}
                className="group flex flex-col border border-line bg-white transition-shadow hover:shadow-[0_6px_28px_rgba(17,26,19,.10)]"
              >
                <div className="relative aspect-[4/3] overflow-hidden bg-forest-2">
                  <Image src={s.photo} alt={s.name} fill sizes="(min-width:1080px) 33vw, (min-width:640px) 50vw, 100vw" className="object-cover saturate-[1.06]" />
                </div>
                <div className="flex flex-1 flex-col gap-2 p-6">
                  <h3 className="h3">{s.name}</h3>
                  <p className="text-[0.94rem] text-mute-l">{s.short}</p>
                  <span className="mt-auto pt-4 text-[0.9rem] font-bold text-green">
                    See Details <span aria-hidden="true" className="inline-block transition-transform group-hover:translate-x-1">&rarr;</span>
                  </span>
                </div>
              </Link>
            ))}
          </div>

          <div className="mt-8 flex flex-wrap items-center gap-4 border-t border-line pt-7">
            <p className="text-mute-l">
              Also available: hedge and shrub trimming, and grounds upkeep for commercial properties.
            </p>
            <Link href="/services" className="tap ml-auto font-bold text-green">View All Services &rarr;</Link>
          </div>
        </div>
      </section>

      {/* ══ WHY GREEN LINE ══ */}
      <section className={`border-y border-line bg-paper-2 ${PAD}`}>
        <div className={`${WRAP} grid gap-10 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] lg:items-start`}>
          <div>
            <div className="rule" />
            <div className="kicker">Why Green Line</div>
            <h2 className="h2 mt-2">Why East Bay Homeowners Choose Green Line</h2>
            <div className="[&>p]:mt-4 [&>p]:max-w-[56ch]">
              <p>
                Your yard should be the reason neighbors slow down when they drive past. Not the
                reason you park in the garage and hope nobody looks.
              </p>
              <p>
                Green Line keeps East Bay properties looking their best all year on a schedule you
                never have to think about. We show up when we said we would, cut and edge to a
                standard the whole street can see, and haul every scrap off your property before we go.
              </p>
              <p>
                What that gets you is simple. A lawn that stays thick and green through a dry Bay
                Area summer. Clean lines along every walk, drive, and bed. A property you are glad
                to pull up to.
              </p>
              <p>
                No chasing anyone down. No wondering whether this is the week they show. No cleaning
                up after the crew that was supposed to clean up.
              </p>
            </div>

            <div className="mt-8 grid gap-6 border-t border-line pt-7 sm:grid-cols-2">
              {[
                ["Your Weekends Back", "Stop spending Saturday morning behind a mower. We handle it while you are doing something better."],
                ["Curb Appeal That Holds", "A property that shows well every day of the year, whether you are selling, renting, or simply living there."],
                ["One Number, One Person", "You deal with the owner directly. No dispatch line, no rotating crew, no explaining your yard twice."],
                ["Nothing Hidden", "Your quote is in writing before we start, and that is the number you pay."],
              ].map(([t, d]) => (
                <div key={t}>
                  <div className="h4">{t}</div>
                  <p className="mt-1 max-w-[34ch] text-[0.92rem] text-mute-l">{d}</p>
                </div>
              ))}
            </div>

            <Link href="/estimate" className="btn btn-p mt-8">Get My Free Estimate</Link>
          </div>

          <aside className="lg:sticky lg:top-28">
            <div className="border border-line bg-white">
              <div
                className="bg-black px-5 py-4 font-[family-name:var(--font-display)] text-[0.82rem] uppercase tracking-[0.09em] text-white"
                style={{ fontVariationSettings: '"wdth" 94, "wght" 700' }}
              >
                Included In Every Maintenance Visit
              </div>
              {[
                "Mow, cut to the right height for the season",
                "Edge every walk, drive, and curb line",
                "Trim fences, trees, and bed borders",
                "Blow down all hard surfaces",
                "Haul away every clipping and cutting",
                "Flag anything on the property you should know about",
              ].map((item, i, arr) => (
                <div key={item} className={`flex items-start justify-between gap-4 px-5 py-4 text-[0.95rem] ${i < arr.length - 1 ? "border-b border-line" : ""}`}>
                  <span>{item}</span>
                  <span className="mt-0.5 font-bold text-green" aria-hidden="true">&#10003;</span>
                </div>
              ))}
            </div>
            <p className="t-sm mt-3 text-mute-l">
              No add-on charges for edging, trimming, or clean-up. It is one price.
            </p>
          </aside>
        </div>
      </section>

      {/* ══ WORK ══ */}
      <section id="work" className={`dark ${PAD}`} style={{ background: "#000000" }}>
        <div className={WRAP}>
          <div className="mb-9 grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,34ch)] lg:items-end">
            <div>
              <div className="rule" />
              <div className="kicker">Our Work</div>
              <h2 className="h2 mt-2 text-white">Before And After</h2>
            </div>
            <p className="text-mute-d">
              Shot on a phone at the property. Every photo on this site is one of our jobs, not stock.
            </p>
          </div>

          <figure className="mt-8 border-t-2 border-lime pt-5">
            <div className="mb-4 flex flex-wrap items-baseline justify-between gap-3">
              <div className="h3 text-white">Backyard Cleanup In One Visit</div>
              <p className="max-w-[64ch] text-[0.95rem] text-mute-d">
                Knee-high and full of dry growth when we got there. Cut down, raked out, and hauled
                away the same day. Drag the handle to see it.
              </p>
            </div>
            <BeforeAfter
              beforeSrc="/photos/slide-yard-before.jpg"
              afterSrc="/photos/slide-yard-after.jpg"
              beforeAlt="Backyard overgrown with tall dry grass around a storage shed"
              afterAlt="The same backyard cleared, with the brick path exposed"
            />
          </figure>

          <figure className="mt-10 border-t-2 border-lime pt-5">
            <div className="mb-4 flex flex-wrap items-baseline justify-between gap-3">
              <div className="h3 text-white">Gutters Cleared Before The Rain</div>
              <p className="max-w-[64ch] text-[0.95rem] text-mute-d">
                Scooped by hand, downspouts flushed until they ran clear, and the ground underneath
                cleaned up. These two are different sections of the roof, so they sit side by side
                rather than in a slider.
              </p>
            </div>
            <div className="grid max-w-[760px] grid-cols-1 gap-[2px] bg-black sm:grid-cols-2">
              <div className="relative">
                <span className="tag tag-b">Before</span>
                <Image src="/photos/pair-gutter-before.jpg" alt="Roof gutter packed with fallen leaves and needles" width={1100} height={1375} sizes="380px" className="aspect-[4/5] w-full object-cover" />
              </div>
              <div className="relative">
                <span className="tag tag-a" style={{ right: "auto", left: 0 }}>After</span>
                <Image src="/photos/pair-gutter-after.jpg" alt="A cleared gutter run" width={1100} height={1375} sizes="380px" className="aspect-[4/5] w-full object-cover" />
              </div>
            </div>
          </figure>
        </div>
      </section>

      {/* ══ PROCESS ══ */}
      <section id="process" className={PAD}>
        <div className={WRAP}>
          <div className="mb-9 grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,34ch)] lg:items-end">
            <div>
              <div className="rule" />
              <div className="kicker">How It Works</div>
              <h2 className="h2 mt-2">Three Steps To A Yard You Never Worry About</h2>
            </div>
            <p className="text-mute-l">Most customers go from first message to scheduled service in under two business days.</p>
          </div>
          <div className="steps grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {steps.map((s) => (
              <div key={s.t} className="step">
                <div className="h4">{s.t}</div>
                <p className="mt-1 text-[0.93rem] text-mute-l">{s.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ REVIEWS ══ */}
      <section id="reviews" className={`border-y border-line bg-paper-2 ${PAD}`}>
        <div className={WRAP}>
          <div className="mb-9 grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,34ch)] lg:items-end">
            <div>
              <div className="rule" />
              <div className="kicker">Reviews</div>
              <h2 className="h2 mt-2">Rated 5.0 By Every Customer Who Has Reviewed Us</h2>
            </div>
            <p className="text-mute-l">Straight from Google, word for word.</p>
          </div>
          <GoogleReviews />
        </div>
      </section>

      {/* ══ PRICING ══ */}
      <section className={PAD}>
        <div className={WRAP}>
          <div className="mb-9 grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,34ch)] lg:items-end">
            <div>
              <div className="rule" />
              <div className="kicker">Pricing</div>
              <h2 className="h2 mt-2">Straightforward Pricing, No Surprises</h2>
            </div>
            <p className="text-mute-l">You get your price in writing before any work starts. That is the number you pay.</p>
          </div>
          <div className="grid gap-5 lg:grid-cols-3">
            {[
              { t: "Regular Mowing", s: "Priced per visit, same day each week.", l: ["How big the lot is and how much of it is actually grass", "Weekly costs less per visit than every other week, because there's less growth to deal with each time", "Gates, slopes, and anything we have to work around", "Edging and blow-off are always included"] },
              { t: "One-Time Cleanups", s: "Flat price, quoted from photos.", l: ["How much material has to come out", "How long it's been since anyone touched it", "Hauling and dump fees are in the quote already", "Tell us if you're up against a code or HOA deadline"] },
              { t: "Commercial", s: "Monthly, on a set scope.", l: ["How much frontage and how often you need us", "Early visits so we're gone before you open", "Photos after each visit if you ask for them", "One person to call, not a dispatch line"] },
            ].map((c) => (
              <div key={c.t} className="border border-line bg-white p-6">
                <div className="h3">{c.t}</div>
                <p className="t-sm mt-1 text-mute-l">{c.s}</p>
                <ul className="mt-4 flex flex-col gap-2">
                  {c.l.map((li) => (
                    <li key={li} className="relative pl-5 text-[0.93rem] text-mute-l before:absolute before:left-0 before:top-[0.55em] before:h-[2px] before:w-2 before:bg-lime">
                      {li}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <p className="t-sm mt-6 max-w-[70ch] text-mute-l">
            You get the price in writing before we start, and that&rsquo;s the price you pay unless the
            job changes and you okay it first.
          </p>
        </div>
      </section>

      {/* ══ SERVICE AREA ══ */}
      <section id="areas" className={`dark ${PAD}`}>
        <ServiceArea />
      </section>

      {/* ══ FAQ ══ */}
      <section id="faq" className={PAD}>
        <div className={WRAP}>
          <div className="mb-9 grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,34ch)] lg:items-end">
            <div>
              <div className="rule" />
              <div className="kicker">Questions</div>
              <h2 className="h2 mt-2">Questions Before You Book</h2>
            </div>
            <p className="text-mute-l">If yours is not here, call or text and you will get a straight answer.</p>
          </div>
          <div className="faq grid gap-x-12 lg:grid-cols-2">
            {faqs.map((f, i) => (
              <details key={f.q} open={i === 0}>
                <summary>{f.q}</summary>
                <p className="mt-2 max-w-[56ch] text-[0.94rem] text-mute-l">{f.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* ══ CTA ══ */}
      <section id="estimate" className={`relative overflow-hidden bg-forest ${PAD}`}>
        <Image src="/photos/hero-square.jpg" alt="" fill sizes="100vw" className="object-cover brightness-[.36] saturate-[1.1]" />
        <div className={`relative ${WRAP} grid items-center gap-10 lg:grid-cols-[minmax(0,1fr)_auto]`}>
          <div>
            <h2 className="h2 max-w-[19ch] text-white">Get Your Free Estimate Today</h2>
            <p className="lead mt-4 max-w-[52ch] text-white/90">
              Send a few photos of your property and your written quote comes back the same day.
              No cost, no obligation, and no pressure if the number is not right for you.
            </p>
          </div>
          <div className="flex min-w-[250px] flex-col gap-3">
            <Link href="/estimate" className="btn btn-l">Get My Free Estimate</Link>
            <a href={`tel:${SITE.phoneE164}`} className="btn btn-o">Call {SITE.phoneDisplay}</a>
            <p className="t-sm text-center text-[#c3d0bf]">
              Monday To Friday, {SITE.hours.open} To {SITE.hours.close}
            </p>
          </div>
        </div>
      </section>
    </>
  );
}