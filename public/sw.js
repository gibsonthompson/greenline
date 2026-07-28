/* Green Line admin service worker.
   Page navigations always go straight to the network, with no cache read
   or write, so a tap loads immediately and never waits on the cache. Only
   static sub-resources (JS, CSS, images, fonts) are cached, network-first,
   as an offline nicety. API and Supabase requests are never touched. */
const CACHE = "glc-admin-v3";

self.addEventListener("install", () => {
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k)));
    await self.clients.claim();
  })());
});

self.addEventListener("fetch", (event) => {
  const req = event.request;
  if (req.method !== "GET") return;

  // Page navigations (tapping a link, loading a route) must never go through
  // the cache. The previous version cached HTML and could stall a tap while
  // it raced the network, which showed up as needing several taps to load.
  // Let the browser handle navigations directly against the network.
  if (req.mode === "navigate") return;

  const url = new URL(req.url);
  if (url.origin !== self.location.origin) return;
  if (url.pathname.startsWith("/api") || url.hostname.endsWith("supabase.co")) return;

  event.respondWith((async () => {
    try {
      const res = await fetch(req);
      const cache = await caches.open(CACHE);
      cache.put(req, res.clone());
      return res;
    } catch {
      const cached = await caches.match(req);
      return cached || Response.error();
    }
  })());
});
