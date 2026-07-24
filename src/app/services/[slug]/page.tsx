import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { services, getService } from "@/data/services";
import { serviceContent } from "@/data/service-content";
import { reviews } from "@/data/reviews";
import { SITE } from "@/data/site";

export function generateStaticParams() {
  return services.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const s = getService(slug);
  if (!s) return {};
  return {
    title: s.metaTitle,
    description: s.metaDescription,
    alternates: { canonical: `/services/${s.slug}` },
  };
}

export default async function ServicePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const s = getService(slug);
  const content = serviceContent[slug];
  if (!s || !content) notFound();

  const review = reviews.find((r) => r.id === content.reviewId);
  const siblings = content.siblings.map(getService).filter((x): x is NonNullable<typeof x> => Boolean(x));

  const schema = [
    {
      "@context": "https://schema.org",
      "@type": "Service",
      name: s.name,
      serviceType: s.name,
      provider: { "@id": `${SITE.url}/#business` },
      areaServed: "East Bay, San Francisco Bay Area, CA",
      url: `${SITE.url}/services/${s.slug}`,
    },
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: content.faqs.map((f) => ({
        "@type": "Question",
        name: f.q,
        acceptedAnswer: { "@type": "Answer", text: f.a },
      })),
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Services", item: `${SITE.url}/services` },
        { "@type": "ListItem", position: 2, name: s.name, item: `${SITE.url}/services/${s.slug}` },
      ],
    },
  ];

  return (
    <article>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />

      {/* Dark banner clears the fixed header and gives the page a real top */}
      <header className="dark relative overflow-hidden">
        <Image src={s.photo} alt="" fill sizes="100vw" className="object-cover opacity-25" />
        <div className="relative mx-auto max-w-[1340px] px-[clamp(1.1rem,4.2vw,4rem)] pb-12 pt-[clamp(7rem,13vw,10.5rem)]">
          <nav aria-label="Breadcrumb" className="t-sm text-mute-d">
            <Link href="/services" className="text-lime-br hover:underline hover:underline-offset-4">Services</Link>
            <span className="px-2" aria-hidden="true">/</span>
            <span>{s.name}</span>
          </nav>
          <div className="rule mt-4" />
          <h1 className="h1 mt-2 max-w-[20ch] text-white">{s.name}</h1>
          <p className="lead mt-4 max-w-[54ch] text-white/90">{content.lead}</p>
          <div className="mt-7 flex flex-wrap gap-3">
            <Link href="/estimate" className="btn btn-l">Get My Free Estimate</Link>
            <a href={`tel:${SITE.phoneE164}`} className="btn btn-o">Call {SITE.phoneDisplay}</a>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-[1340px] px-[clamp(1.1rem,4.2vw,4rem)] py-12">
        <div className="relative aspect-[16/9] max-h-[460px] w-full overflow-hidden bg-forest-2">
          <Image src={s.photo} alt={s.name} fill priority sizes="(min-width:1400px) 1300px, 100vw" className="object-cover" />
        </div>
      </div>

      <div className="mx-auto max-w-[1340px] gap-14 px-[clamp(1.1rem,4.2vw,4rem)] pb-16 lg:grid lg:grid-cols-[minmax(0,1fr)_320px]">
        <div className="prose-gl">
          {content.body}
          <hr />
          <h2>Common Questions</h2>
          {content.faqs.map((f) => (
            <div key={f.q}>
              <h3>{f.q}</h3>
              <p>{f.a}</p>
            </div>
          ))}
        </div>

        <aside className="mt-12 lg:mt-0">
          {review && (
            <figure className="border-l-[3px] border-lime bg-paper-2 p-5">
              <div className="stars mb-2" aria-hidden="true">&#9733;&#9733;&#9733;&#9733;&#9733;</div>
              <blockquote className="text-[1rem] leading-relaxed">&ldquo;{review.body}&rdquo;</blockquote>
              <figcaption className="mt-3 text-[0.9rem] text-mute-l">
                <span className="font-bold text-ink">{review.author}</span> on Google
              </figcaption>
            </figure>
          )}

          <div className="mt-8 border border-line bg-white p-6">
            <h2 className="h3">Get A Price Today</h2>
            <p className="mt-2 text-[0.94rem] text-mute-l">
              Send a few photos and your written quote comes back the same day. No cost, no obligation.
            </p>
            <Link href="/estimate" className="btn btn-p mt-4 w-full">Get My Free Estimate</Link>
            <a href={`tel:${SITE.phoneE164}`} className="btn btn-ol mt-3 w-full">Call {SITE.phoneDisplay}</a>
          </div>

          {siblings.length > 0 && (
            <div className="mt-8">
              <h2 className="kicker">Related Services</h2>
              <ul className="mt-3 flex flex-col gap-2">
                {siblings.map((sib) => (
                  <li key={sib.slug}>
                    <Link href={`/services/${sib.slug}`} className="font-semibold text-green hover:underline hover:underline-offset-4">
                      {sib.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </aside>
      </div>
    </article>
  );
}
