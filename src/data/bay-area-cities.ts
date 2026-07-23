// All 101 incorporated cities and towns of the nine-county Bay Area.
// Counts: 14 + 19 + 11 + 5 + 1 + 20 + 15 + 7 + 9 = 101.
// Castro Valley and San Lorenzo are unincorporated Alameda County
// communities: they are Tier 1 service cities but not in this list.
export const bayAreaCounties: { county: string; cities: string[] }[] = [
  {
    county: "Alameda County",
    cities: ["Alameda","Albany","Berkeley","Dublin","Emeryville","Fremont","Hayward","Livermore","Newark","Oakland","Piedmont","Pleasanton","San Leandro","Union City"],
  },
  {
    county: "Contra Costa County",
    cities: ["Antioch","Brentwood","Clayton","Concord","Danville","El Cerrito","Hercules","Lafayette","Martinez","Moraga","Oakley","Orinda","Pinole","Pittsburg","Pleasant Hill","Richmond","San Pablo","San Ramon","Walnut Creek"],
  },
  {
    county: "Marin County",
    cities: ["Belvedere","Corte Madera","Fairfax","Larkspur","Mill Valley","Novato","Ross","San Anselmo","San Rafael","Sausalito","Tiburon"],
  },
  {
    county: "Napa County",
    cities: ["American Canyon","Calistoga","Napa","St. Helena","Yountville"],
  },
  { county: "San Francisco", cities: ["San Francisco"] },
  {
    county: "San Mateo County",
    cities: ["Atherton","Belmont","Brisbane","Burlingame","Colma","Daly City","East Palo Alto","Foster City","Half Moon Bay","Hillsborough","Menlo Park","Millbrae","Pacifica","Portola Valley","Redwood City","San Bruno","San Carlos","San Mateo","South San Francisco","Woodside"],
  },
  {
    county: "Santa Clara County",
    cities: ["Campbell","Cupertino","Gilroy","Los Altos","Los Altos Hills","Los Gatos","Milpitas","Monte Sereno","Morgan Hill","Mountain View","Palo Alto","San Jose","Santa Clara","Saratoga","Sunnyvale"],
  },
  {
    county: "Solano County",
    cities: ["Benicia","Dixon","Fairfield","Rio Vista","Suisun City","Vacaville","Vallejo"],
  },
  {
    county: "Sonoma County",
    cities: ["Cloverdale","Cotati","Healdsburg","Petaluma","Rohnert Park","Santa Rosa","Sebastopol","Sonoma","Windsor"],
  },
];

export const totalCityCount = bayAreaCounties.reduce((n, c) => n + c.cities.length, 0);
