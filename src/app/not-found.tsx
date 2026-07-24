import Link from "next/link";
import { SITE } from "@/data/site";

export default function NotFound() {
  return (
    <article>
      <header className="dark">
        <div className="mx-auto max-w-[1340px] px-[clamp(1.1rem,4.2vw,4rem)] pb-14 pt-[clamp(7rem,13vw,10.5rem)]">
          <div className="rule" />
          <div className="kicker">Page Not Found</div>
          <h1 className="h1 mt-2 max-w-[16ch] text-white">That Page Is Not Here</h1>
          <p className="lead mt-4 max-w-[46ch] text-white/90">
            The address may have changed. Everything on the site is reachable from the home page,
            or call us and we will point you the right way.
          </p>
          <div className="mt-7 flex flex-wrap gap-3">
            <Link href="/" className="btn btn-l">Back To The Home Page</Link>
            <a href={`tel:${SITE.phoneE164}`} className="btn btn-o">Call {SITE.phoneDisplay}</a>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-[1340px] px-[clamp(1.1rem,4.2vw,4rem)] py-14">
        <h2 className="h3">Popular Pages</h2>
        <ul className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {[
            ["Services", "/services"],
            ["Our Work", "/work"],
            ["Reviews", "/reviews"],
            ["Service Area", "/areas"],
          ].map(([label, href]) => (
            <li key={href}>
              <Link href={href} className="block border border-line bg-white p-4 font-semibold text-green transition-shadow hover:shadow-[0_4px_18px_rgba(17,26,19,.10)]">
                {label} &rarr;
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </article>
  );
}
