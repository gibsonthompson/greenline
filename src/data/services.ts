export type Service = {
  slug: string;
  name: string;
  short: string;       // one-sentence for the homepage index
  photo: string;
  metaTitle: string;
  metaDescription: string;
};

export const services: Service[] = [
  {
    slug: "mowing",
    name: "Lawn Mowing and Maintenance",
    short: "Weekly or every other week, cut at the right height for the grass you actually have.",
    photo: "/photos/clean/1_51_34.jpg",
    metaTitle: "Lawn Mowing East Bay | Green Line Lawn Care",
    metaDescription: "Weekly and every-other-week lawn mowing across the East Bay. Tall fescue cut at the right height, edges included, clippings handled. Free same-day estimates.",
  },
  {
    slug: "edging-and-trimming",
    name: "Edging and Trimming",
    short: "The clean line along your walk, drive, and beds. This is the part people notice.",
    photo: "/photos/sidewalk-edge.jpg",
    metaTitle: "Lawn Edging and Trimming East Bay | Green Line",
    metaDescription: "Crisp edges along walks, driveways, and beds, and careful trimming around sprinklers and fences. The visible proof your property is maintained.",
  },
  {
    slug: "yard-cleanup",
    name: "Yard and Landscape Cleanup",
    short: "Overgrown, storm-hit, or years behind. We clear it and haul the debris off.",
    photo: "/photos/pairs/side-yard-after.jpg",
    metaTitle: "Yard Cleanup East Bay | Green Line Lawn Care",
    metaDescription: "One-time and seasonal yard cleanups in the East Bay. Overgrowth cleared, beds reset, debris hauled off, property left clean. Free photo-based quotes.",
  },
  {
    slug: "weed-removal",
    name: "Weed Removal",
    short: "Beds, cracks, fence lines, and the strip along the curb everyone forgets.",
    photo: "/photos/clean/1_49_11.jpg",
    metaTitle: "Weed Removal East Bay | Green Line Lawn Care",
    metaDescription: "Weed clearing for beds, fence lines, sidewalk cracks, and curb strips across the East Bay, with honest advice on keeping them from coming back.",
  },
  {
    slug: "hedge-and-shrub",
    name: "Hedge and Shrub Trimming",
    short: "Shaped so they read as intentional instead of neglected.",
    photo: "/photos/clean/1_48_46.jpg",
    metaTitle: "Hedge and Shrub Trimming East Bay | Green Line",
    metaDescription: "Hedges and shrubs shaped cleanly and trimmed at the right time for the plant, not just whenever. East Bay service with free estimates.",
  },
  {
    slug: "gutter-cleaning",
    name: "Gutter Cleaning",
    short: "Cleared, flushed, and the ground left clean before we go.",
    photo: "/photos/clean/1_48_39.jpg",
    metaTitle: "Gutter Cleaning East Bay | Green Line Lawn Care",
    metaDescription: "Gutters cleared and downspouts flushed before Bay Area winter rains, with the ground cleaned up before we leave. Free estimates.",
  },
  {
    slug: "commercial-maintenance",
    name: "Commercial Property Upkeep",
    short: "Storefronts, sign islands, and parking strips on a schedule you can count on.",
    photo: "/photos/pairs/commercial-island-after.jpg",
    metaTitle: "Commercial Property Maintenance East Bay | Green Line",
    metaDescription: "Scheduled exterior upkeep for storefronts, sign islands, and parking strips in the East Bay. Before-open service windows available.",
  },
];

export function getService(slug: string) {
  return services.find((s) => s.slug === slug);
}
