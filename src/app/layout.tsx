import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { SITE } from "@/data/site";
import { services } from "@/data/services";
import { reviews, AGGREGATE } from "@/data/reviews";
import { cityPages } from "@/data/city-pages";

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: {
    default: "Green Line Lawn Care | Lawn Mowing & Cleanups | East Bay, CA",
    template: "%s | Green Line Lawn Care",
  },
  description:
    "Owner-operated lawn care across the East Bay. Weekly and every-other-week mowing, cleanups, and gutters. Send a few photos and get a price the same day.",
  openGraph: {
    siteName: SITE.shortName,
    type: "website",
    images: [{ url: "/photos/hero-wide.jpg", width: 2000, height: 1125 }],
  },
};

function businessSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "LandscapingBusiness",
    "@id": `${SITE.url}/#business`,
    name: SITE.name,
    telephone: "+1-510-342-9043",
    email: SITE.email,
    url: SITE.url,
    image: `${SITE.url}/photos/hero-wide.jpg`,
    logo: `${SITE.url}/brand/logo.png`,
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
        itemOffered: { "@type": "Service", name: s.name, url: `${SITE.url}/services/${s.slug}` },
      })),
    },
    // Self-serving reviews are ineligible for star rich results (Google,
    // Sept 2019). Included for entity understanding and AI surfaces only.
    // ratingCount is intentionally omitted: the live Google profile has
    // more reviews than the six reproduced on this site.
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: AGGREGATE.rating.toFixed(1),
      bestRating: "5",
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
        <a href="#main" className="skip-link">Skip to content</a>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(businessSchema()) }} />
        <Header />
        <main id="main">{children}</main>
        <Footer />
      </body>
    </html>
  );
}