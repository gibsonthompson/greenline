// Static, simplified nine-county Bay Area figure. No tiles, no JS map
// library, no API key, zero layout shift (spec 4.1.5). Shapes are
// deliberately schematic: the bay as negative space, counties as
// blocks, the East Bay core filled in turf.
export default function CoverageMap() {
  return (
    <figure aria-label="Simplified map of the nine-county Bay Area with the East Bay core service area highlighted">
      <svg viewBox="0 0 420 400" role="img" className="w-full max-w-[420px]">
        <title>East Bay core service area within the nine-county Bay Area</title>
        {/* wider region outline */}
        <g fill="none" stroke="var(--color-concrete-30)" strokeWidth="2">
          <path d="M60 30 L200 22 L232 60 L215 108 L150 120 L120 90 L58 78 Z" /> {/* Sonoma/Napa */}
          <path d="M200 22 L330 30 L340 96 L232 60 Z" />                          {/* Solano */}
          <path d="M58 78 L120 90 L150 120 L138 176 L92 190 L52 150 Z" />         {/* Marin */}
          <path d="M92 214 L138 200 L150 262 L104 300 Z" />                        {/* SF + Peninsula */}
          <path d="M104 300 L150 262 L196 330 L150 376 Z" />                       {/* San Mateo south */}
          <path d="M196 330 L288 300 L330 366 L226 384 Z" />                       {/* Santa Clara */}
        </g>
        {/* the bay */}
        <path
          d="M150 130 C170 150 168 200 158 240 C152 268 160 292 180 306 L204 296 C190 270 192 236 200 206 C208 178 200 148 178 128 Z"
          fill="var(--color-concrete-20)"
          stroke="var(--color-concrete-30)"
          strokeWidth="1.5"
        />
        {/* East Bay core: Richmond down through Fremont */}
        <path
          d="M178 120 L262 104 L300 150 L296 222 L268 292 L204 296 L190 250 L198 196 L184 152 Z"
          fill="var(--color-turf)"
          fillOpacity="0.24"
          stroke="var(--color-turf-fill)"
          strokeWidth="2.5"
        />
        {/* Contra Costa / Alameda outer */}
        <g fill="none" stroke="var(--color-concrete-30)" strokeWidth="2">
          <path d="M262 104 L340 96 L372 180 L300 150 Z" />
          <path d="M300 150 L372 180 L352 280 L296 222 Z" />
        </g>
        <g fontFamily="var(--font-body)" fontSize="13" fill="var(--color-ink)">
          <text x="212" y="150">Richmond</text>
          <text x="214" y="196">Oakland</text>
          <text x="226" y="240">Hayward</text>
          <text x="230" y="282">Fremont</text>
        </g>
      </svg>
      <figcaption className="t-body-sm mt-2 text-ink-60">
        Core service area shaded. Wider Bay Area quoted case by case.
      </figcaption>
    </figure>
  );
}
