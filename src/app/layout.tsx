import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import MobileDock from "@/components/MobileDock";
import { SITE } from "@/data/site";
import { services } from "@/data/services";
import { reviews, AGGREGATE } from "@/data/reviews";
import { cityPages } from "@/data/city-pages";

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: {
    default: "Green Line Lawn Care | Lawn Mowing, Edging and Cleanups, East Bay",
    template: "%s | Green Line Lawn Care",
  },
  description:
    "Owner-operated lawn maintenance across the East Bay. Mowing, edging, cleanups, weed removal, and gutter cleaning. Send photos, get a free same-day quote.",
  openGraph: {
    siteName: SITE.shortName,
    type: "website",
    images: [{ url: "/photos/hero/edge-line-16x9.jpg", width: 1920, height: 1080 }],
  },
};

function businessSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "LandscapingBusiness",
    "@id": `${SITE.url}/#business`,
    name: SITE.name,
    telephone: "+1-925-436-6691",
    email: SITE.email,
    url: SITE.url,
    image: `${SITE.url}/photos/hero/edge-line-1x1.jpg`,
    priceRange: "$$",
    areaServed: cityPages.map((c) => ({ "@type": "City", name: c.name })),
    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
        opens: "08:00",
        closes: "17:00",
      },
    ],
    sameAs: [SITE.instagram, SITE.facebook],
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "Lawn care services",
      itemListElement: services.map((s) => ({
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          name: s.name,
          url: `${SITE.url}/services/${s.slug}`,
        },
      })),
    },
    // Note: self-serving reviews are ineligible for star rich results
    // (Google, Sept 2019 policy). Included for entity understanding and
    // AI surfaces, not for SERP stars. See build spec 15.2.
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: AGGREGATE.rating.toFixed(1),
      reviewCount: String(AGGREGATE.count),
    },
    review: reviews.map((r) => ({
      "@type": "Review",
      author: { "@type": "Person", name: r.author },
      reviewRating: { "@type": "Rating", ratingValue: String(r.rating) },
      reviewBody: r.body,
    })),
  };
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <a href="#main" className="skip-link">
          Skip to content
        </a>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(businessSchema()) }}
        />
        <Header />
        <main id="main">{children}</main>
        <Footer />
        <MobileDock />
      </body>
    </html>
  );
}
