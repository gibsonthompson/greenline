import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { cityPages, getCityPage } from "@/data/city-pages";
import { services } from "@/data/services";
import { SITE } from "@/data/site";

export function generateStaticParams() {
  return cityPages.map((c) => ({ city: c.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ city: string }>;
}): Promise<Metadata> {
  const { city } = await params;
  const c = getCityPage(city);
  if (!c) return {};
  return {
    title: `Lawn Care in ${c.name}`,
    description: `${c.intro} Free same-day estimates from an owner-operated East Bay crew.`,
    alternates: { canonical: `/areas/${c.slug}` },
  };
}

export default async function CityPage({ params }: { params: Promise<{ city: string }> }) {
  const { city } = await params;
  const c = getCityPage(city);
  if (!c) notFound();

  const schema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Service areas", item: `${SITE.url}/areas` },
      { "@type": "ListItem", position: 2, name: c.name, item: `${SITE.url}/areas/${c.slug}` },
    ],
  };

  return (
    <article className="mx-auto max-w-6xl px-5 pb-16 pt-[clamp(8rem,12vw,10rem)] md:px-8">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
      <nav aria-label="Breadcrumb" className="t-sm text-mute-l">
        <Link href="/areas" className="text-green underline underline-offset-2">
          Service areas
        </Link>{" "}
        / {c.name}
      </nav>
      <h1 className="h2 mt-3 max-w-[20ch]">Lawn care in {c.name}</h1>
      <p className="lead mt-4 max-w-[52ch] text-mute-l">{c.intro}</p>

      <div className="prose-gl mt-10 max-w-[68ch]">
        <p>{c.local}</p>
        <h2>What we do in {c.name}</h2>
        <p>
          The full scope:{" "}
          {services.map((s, i) => (
            <span key={s.slug}>
              <Link href={`/services/${s.slug}`}>{s.name.toLowerCase()}</Link>
              {i < services.length - 1 ? ", " : "."}
            </span>
          ))}{" "}
          Weekly and every-other-week maintenance runs on fixed weekdays, and one-time cleanups
          are quoted from photos, usually the same day.
        </p>
        <h2>Getting a price</h2>
        <p>
          Send a few photos through the <Link href="/estimate">estimate form</Link> with your{" "}
          {c.name} address and Jaydin will come back with a number. Water here is managed by{" "}
          {c.waterDistrict}, and our mowing heights and schedules follow what actually keeps a lawn
          alive under local watering rules rather than what pads a route.
        </p>
      </div>

      <div className="mt-12 flex flex-wrap gap-4">
        <Link href="/estimate" className="btn btn-p">
          Get a free estimate in {c.name}
        </Link>
        <a href={`tel:${SITE.phoneE164}`} className="btn btn-ol">
          Call {SITE.phoneDisplay}
        </a>
      </div>
    </article>
  );
}
