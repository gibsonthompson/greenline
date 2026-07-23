export const SITE = {
  name: "Green Line Lawn Care LLC",
  shortName: "Green Line Lawn Care",
  owner: "Jaydin", // TODO(gibson): surname
  phoneDisplay: "(925) 436-6691",
  phoneE164: "+19254366691",
  email: process.env.NEXT_PUBLIC_BUSINESS_EMAIL || "hello@greenlinelawncare.com", // TODO(gibson)
  url: process.env.NEXT_PUBLIC_SITE_URL || "https://greenlinelawncare.com", // TODO(gibson): domain
  instagram: "https://www.instagram.com/greenlinelawncare.llc/",
  facebook: "https://www.facebook.com/profile.php?id=61566223880858",
  googlePlaceId: process.env.NEXT_PUBLIC_GOOGLE_PLACE_ID || "", // TODO(gibson)
  hours: { days: "Monday to Friday", open: "8:00 AM", close: "5:00 PM" },
  region: "the San Francisco Bay Area",
  coreArea: "the East Bay",
} as const;

export function reviewLink(): string {
  return SITE.googlePlaceId
    ? `https://search.google.com/local/writereview?placeid=${SITE.googlePlaceId}`
    : "https://www.google.com/search?q=Green+Line+Lawn+Care+LLC+reviews";
}
