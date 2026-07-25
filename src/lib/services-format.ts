// Turns stored service slugs into display labels.
// "mowing" -> "Mowing", "edging-and-trimming" -> "Edging And Trimming".
// Every word capitalized, matching the site's Title Case convention.

export function titleCaseService(slug: string): string {
  return slug
    .split("-")
    .filter(Boolean)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

export function formatServices(services: string[] | null | undefined): string {
  return (services ?? []).map(titleCaseService).join(", ");
}
