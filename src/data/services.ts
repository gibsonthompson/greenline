export type Service = {
  slug: string;
  name: string;
  short: string;
  photo: string;
  feature: boolean;   // renders as a wide card on the homepage grid
  metaTitle: string;
  metaDescription: string;
};

export const services: Service[] = [
  {
    slug: "mowing",
    name: "Mowing And Maintenance",
    short:
      "A lawn that stays thick and green through the dry season, cut on the same day every week so you never have to think about it or ask when we are coming.",
    photo: "/photos/svc-mowing.jpg",
    feature: true,
    metaTitle: "Lawn Mowing In The East Bay",
    metaDescription:
      "Weekly and every-other-week mowing across the East Bay, cut at the right height with edging and blow-off included. Send photos, get a price the same day.",
  },
  {
    slug: "edging-and-trimming",
    name: "Edging And Trimming",
    short:
      "The crisp lines along your walks and driveway that make a property read as cared for rather than simply cut. Included with every mow.",
    photo: "/photos/svc-edging.jpg",
    feature: true,
    metaTitle: "Lawn Edging And Trimming In The East Bay",
    metaDescription:
      "Crisp edges along walks, drives, and beds, with careful trimming around fences and sprinkler heads. Included in every Green Line mowing visit.",
  },
  {
    slug: "yard-cleanup",
    name: "Yard Cleanups",
    short: "Hand back a yard that got away from you looking like someone has been keeping it all along.",
    photo: "/photos/svc-cleanup.jpg",
    feature: false,
    metaTitle: "Yard Cleanups In The East Bay",
    metaDescription:
      "One-time and seasonal yard cleanups across the East Bay. Overgrowth cleared, beds reset, and every load hauled away. Free photo quotes.",
  },
  {
    slug: "weed-removal",
    name: "Weed Removal",
    short: "Clear beds and clean fence lines, so the front of your house is not the one people notice for the wrong reason.",
    photo: "/photos/svc-weeds.jpg",
    feature: false,
    metaTitle: "Weed Removal In The East Bay",
    metaDescription:
      "Weed clearing for beds, fence lines, driveway cracks, and curb strips, with straight advice on keeping them from coming back.",
  },
  {
    slug: "hedge-and-shrub",
    name: "Hedges And Shrubs",
    short: "Shaped so your front yard looks designed instead of overgrown, and stays that way between visits.",
    photo: "/photos/svc-shrub.jpg",
    feature: false,
    metaTitle: "Hedge And Shrub Trimming In The East Bay",
    metaDescription:
      "Hedges and shrubs trimmed on a cadence that suits the species, not the route. East Bay service with free estimates.",
  },
  {
    slug: "gutter-cleaning",
    name: "Gutter Cleaning",
    short: "Cleared before the winter rains so water runs off your roof instead of down your siding and into your foundation.",
    photo: "/photos/svc-gutter.jpg",
    feature: false,
    metaTitle: "Gutter Cleaning In The East Bay",
    metaDescription:
      "Gutters cleared and downspouts flushed before the Bay Area rains, with the ground underneath cleaned up before we leave.",
  },
  {
    slug: "commercial-maintenance",
    name: "Commercial Properties",
    short:
      "A frontage that tells customers you are open and you care, kept on a schedule you never have to police. Early service windows available so the work is done before your doors open.",
    photo: "/photos/svc-commercial.jpg",
    feature: true,
    metaTitle: "Commercial Grounds Maintenance In The East Bay",
    metaDescription:
      "Scheduled exterior upkeep for storefronts, sign islands, and parking strips. Early service windows and completion photos on request.",
  },
  {
    slug: "mulch-and-plantings",
    name: "Mulch, Stone, And Plantings",
    short:
      "Fresh mulch, stone, and planting that makes tired beds look finished, and keeps the weeds from marching back in.",
    photo: "/photos/svc-beds.jpg",
    feature: true,
    metaTitle: "Mulch, Stone, And Planting In The East Bay",
    metaDescription:
      "Fresh mulch, stone, and replacement plantings for tired beds, plus the clean bed border that keeps weeds out.",
  },
];

export function getService(slug: string) {
  return services.find((s) => s.slug === slug);
}