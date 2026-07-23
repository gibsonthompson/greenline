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

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const s = getService(slug);
  if (!s) return {};
  return {
    title: s.metaTitle.replace(" | Green Line Lawn Care", "").replace(" | Green Line", ""),
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
  const siblings = content.siblings
    .map((sl) => getService(sl))
    .filter((x): x is NonNullable<typeof x> => Boolean(x));

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
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />

      <div className="mx-auto max-w-6xl px-5 pt-14 md:px-8">
        <nav aria-label="Breadcrumb" className="t-body-sm text-ink-60">
          <Link href="/services" className="text-turf-ink underline underline-offset-2">
            Services
          </Link>{" "}
          / {s.name}
        </nav>
        <h1 className="t-display-lg mt-3 max-w-[20ch]">{s.name}</h1>
        <p className="t-body-lg mt-4 max-w-[52ch] text-ink-60">{content.lead}</p>
      </div>

      <div className="mx-auto mt-10 max-w-6xl px-5 md:px-8">
        <div className="relative aspect-[16/9] max-h-[480px] w-full overflow-hidden rounded-md bg-field">
          <Image
            src={s.photo}
            alt={s.name}
            fill
            priority
            sizes="(min-width: 1152px) 1088px, 100vw"
            className="object-cover"
          />
        </div>
      </div>

      <div className="mx-auto max-w-6xl gap-16 px-5 py-14 md:grid md:grid-cols-[minmax(0,1fr)_300px] md:px-8">
        <div className="prose-gl">
          {content.body}
          <hr />
          <h2>Common questions</h2>
          {content.faqs.map((f) => (
            <div key={f.q}>
              <h3>{f.q}</h3>
              <p>{f.a}</p>
            </div>
          ))}
        </div>

        <aside className="mt-12 md:mt-0">
          {review && (
            <figure className="border-l-[3px] border-turf pl-5">
              <blockquote className="text-[1.05rem]">&ldquo;{review.body}&rdquo;</blockquote>
              <figcaption className="mt-3 text-[0.9rem] text-ink-60">
                <span className="font-semibold text-ink">{review.author}</span> on Google
              </figcaption>
            </figure>
          )}
          <div className="mt-10 bg-concrete-00 p-6">
            <h2 className="t-display-sm">Get a price today</h2>
            <p className="mt-2 text-[0.95rem] text-ink-60">
              Send a few photos and Jaydin will come back with a number, usually the same day.
            </p>
            <Link href="/estimate" className="btn btn-fill mt-4 w-full">
              Start your free estimate
            </Link>
            <a href={`tel:${SITE.phoneE164}`} className="btn btn-ghost-light mt-3 w-full">
              Call {SITE.phoneDisplay}
            </a>
          </div>
          <div className="mt-10">
            <h2 className="t-label text-ink-60">Related</h2>
            <ul className="mt-3 space-y-2">
              {siblings.map((sib) => (
                <li key={sib.slug}>
                  <Link
                    href={`/services/${sib.slug}`}
                    className="font-medium text-turf-ink underline decoration-2 underline-offset-4"
                  >
                    {sib.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </aside>
      </div>
    </article>
  );
}
