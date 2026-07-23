import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto max-w-6xl px-5 py-24 md:px-8">
      <div aria-hidden="true" className="line-h w-24" />
      <h1 className="t-display-lg mt-6">That page is not here.</h1>
      <p className="t-body-lg mt-4 max-w-[44ch] text-ink-60">
        The address may have changed. Everything on the site is reachable from the home page.
      </p>
      <Link href="/" className="btn btn-fill mt-8">
        Back to the home page
      </Link>
    </div>
  );
}
