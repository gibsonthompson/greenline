// TODO(gibson): confirm the served ZIP list with Jaydin.
// Core East Bay coverage. Out-of-list ZIPs are accepted with an
// honest out_of_area flag, never silently rejected.
export const CORE_ZIPS = new Set<string>([
  // Oakland
  "94601","94602","94603","94605","94606","94607","94609","94610","94611","94612","94618","94619","94621",
  // Berkeley / Albany / Emeryville / Piedmont
  "94702","94703","94704","94705","94706","94707","94708","94709","94710","94608","94611",
  // Alameda
  "94501","94502",
  // San Leandro / San Lorenzo / Castro Valley
  "94577","94578","94579","94580","94546","94552",
  // Hayward
  "94541","94542","94544","94545",
  // Union City / Fremont / Newark
  "94587","94536","94538","94539","94555","94560",
  // Richmond / El Cerrito / San Pablo
  "94801","94803","94804","94805","94806","94530",
]);

export function zipStatus(zip: string): "core" | "outside" | "invalid" {
  if (!/^\d{5}$/.test(zip)) return "invalid";
  return CORE_ZIPS.has(zip) ? "core" : "outside";
}
