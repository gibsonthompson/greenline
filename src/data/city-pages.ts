// Tier 1: the twelve built city pages. Each must contain content that
// could only be about that city. TODO(gibson): confirm this list is the
// twelve Jaydin actually services.
export type CityPage = {
  slug: string;
  name: string;
  county: string;
  waterDistrict: string;
  intro: string;
  local: string; // the paragraph that could only be about this city
};

export const cityPages: CityPage[] = [
  {
    slug: "oakland",
    name: "Oakland",
    county: "Alameda County",
    waterDistrict: "EBMUD",
    intro: "Lawn mowing, edging, cleanups, and property upkeep across Oakland, from the flats to the hills.",
    local: "Oakland yards run the full range: small deep lots in Fruitvale and East Oakland, shaded hill parcels above Highway 13 where redwood duff smothers turf, and Craftsman front yards in Rockridge and Temescal where the lawn is a small rectangle that has to be perfect because the whole street can see it. EBMUD's tiered rates make overwatering expensive here, so we cut tall fescue high, at three to three and a half inches, so it shades its own roots and needs less water to stay green.",
  },
  {
    slug: "berkeley",
    name: "Berkeley",
    county: "Alameda County",
    waterDistrict: "EBMUD",
    intro: "Weekly maintenance and one-time cleanups for Berkeley homes, rentals, and small commercial frontages.",
    local: "Berkeley properties are dense and close to the sidewalk, which means the edge along the public walk is the first thing every neighbor and every passing student sees. Fog influence off the Bay keeps west Berkeley lawns growing later into the fall than inland cities, so we hold weekly cuts longer here before dropping to every other week. A lot of Berkeley homes are rentals, and we work with landlords who need documented, scheduled service between tenants.",
  },
  {
    slug: "alameda",
    name: "Alameda",
    county: "Alameda County",
    waterDistrict: "EBMUD",
    intro: "Flat lots, Victorian frontages, and salt air. Lawn care built for the island.",
    local: "Alameda is flat and walkable, and its Victorian and Craftsman frontages put the lawn right at the sidewalk where the edge line is everything. The island's sandy fill soil drains fast, so lawns here dry out quicker than the same grass a mile inland; we watch for early browning and advise deep, infrequent watering rather than daily sprinkles that evaporate off the surface.",
  },
  {
    slug: "san-leandro",
    name: "San Leandro",
    county: "Alameda County",
    waterDistrict: "EBMUD",
    intro: "Reliable weekly and every-other-week service for San Leandro homes from Estudillo to Washington Manor.",
    local: "San Leandro's postwar tracts, Broadmoor, Estudillo Estates, Washington Manor, were built with generous front lawns that read badly the moment they go shaggy. Lots here are big enough that a missed month becomes a real cleanup job. We keep recurring clients on a fixed weekday so the block always sees the same crisp line on the same day.",
  },
  {
    slug: "hayward",
    name: "Hayward",
    county: "Alameda County",
    waterDistrict: "EBMUD",
    intro: "Mowing, cleanups, and commercial upkeep across Hayward, flats and hills alike.",
    local: "Hayward runs hotter and drier than the shoreline cities, and the hills above Mission Boulevard cure to gold by June. Lawns here fight dormancy pressure all summer, and cutting them short to stretch visits is what kills them. We also handle commercial strips along Mission and Hesperian, where sign islands and parking strips are the first impression a business makes.",
  },
  {
    slug: "castro-valley",
    name: "Castro Valley",
    county: "Alameda County (unincorporated)",
    waterDistrict: "EBMUD",
    intro: "Lawn and property maintenance for Castro Valley's larger unincorporated lots.",
    local: "Castro Valley is unincorporated Alameda County, and its lots are noticeably larger than the incorporated cities next door, with longer fence lines, more bed edge, and more oak drop to clean up each fall. County code enforcement handles overgrowth complaints here, and we regularly bring neglected properties back before a notice turns into a fine.",
  },
  {
    slug: "san-lorenzo",
    name: "San Lorenzo",
    county: "Alameda County (unincorporated)",
    waterDistrict: "EBMUD",
    intro: "Weekly cuts and cleanups for San Lorenzo Village and the surrounding tracts.",
    local: "San Lorenzo Village is one of the country's original planned postwar suburbs, and its identical setbacks make an unmowed lawn stand out from three houses away. The Village homes association keeps standards on front yards, and a scheduled weekly or every-other-week cut is the cheapest way to never think about a letter.",
  },
  {
    slug: "union-city",
    name: "Union City",
    county: "Alameda County",
    waterDistrict: "ACWD",
    intro: "Lawn maintenance and cleanups for Union City homes and townhome frontages.",
    local: "Union City sits on Alameda County Water District rather than EBMUD, with its own drought-stage rules, and the newer developments around Union Landing mix small private lawns with HOA-managed frontage. We handle both: the strip the HOA does not touch, and the backyard the HOA never sees.",
  },
  {
    slug: "fremont",
    name: "Fremont",
    county: "Alameda County",
    waterDistrict: "ACWD",
    intro: "From Niles to Warm Springs, scheduled lawn care for Fremont's long dry season.",
    local: "Fremont is one of the warmest, driest cities we service, in the Hayward fault's rain shadow, and ACWD's watering guidelines shape what a lawn here can realistically look like in August. We set expectations honestly: a tall-cut fescue lawn watered deeply twice a week will hold decent color; a short-cut lawn on daily light watering will not, no matter who mows it.",
  },
  {
    slug: "newark",
    name: "Newark",
    county: "Alameda County",
    waterDistrict: "ACWD",
    intro: "Weekly and every-other-week lawn service for Newark's compact, wind-exposed lots.",
    local: "Newark is flat, close to the salt ponds, and windier than its neighbors, which dries turf and scatters debris across yards after every gusty afternoon. Lots are compact, so a visit here is efficient, and most Newark clients land on every-other-week service with a seasonal cleanup after the wind has done its work.",
  },
  {
    slug: "richmond",
    name: "Richmond",
    county: "Contra Costa County",
    waterDistrict: "EBMUD",
    intro: "Lawn care and property cleanups across Richmond, the Annex, and Point Richmond.",
    local: "Richmond spans everything from Point Richmond cottages to North and East's deep lots, and the city's rental inspection program means landlords here need exterior maintenance they can document. Contra Costa Water District guidance applies east of the hills, but Richmond itself is EBMUD; either way the advice we follow is the same: mow high, mow weekly in season, and never take more than a third of the blade.",
  },
  {
    slug: "el-cerrito",
    name: "El Cerrito",
    county: "Contra Costa County",
    waterDistrict: "EBMUD",
    intro: "Precise, scheduled lawn maintenance for El Cerrito's hillside and flatland homes.",
    local: "El Cerrito climbs from San Pablo Avenue up into the hills, and the upslope lots terrace their yards into small lawns with a lot of edge per square foot of grass. That ratio is exactly our specialty: on a terraced lawn the line is most of the job. Fog through the Golden Gate keeps these lawns growing later into fall than inland Contra Costa."
  },
];

export function getCityPage(slug: string) {
  return cityPages.find((c) => c.slug === slug);
}
