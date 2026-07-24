/* Green Line admin service worker.
   Installability plus fast repeat loads. Data is always fetched fresh: API and
   Supabase requests are never cached, so the admin never shows stale jobs. */
const CACHE = "glc-admin-v1";
const PRECACHE = [
  "/admin",
  "/admin/login",
  "/brand/logo.png",
  "/fonts/Archivo.woff2",
  "/fonts/PublicSans-Variable.woff2",
];

self.addEventListener("install", (event) => {
  event.waitUntil((async () => {
    const cache = await caches.open(CACHE);
    // allSettled so one missing asset never breaks the whole install
    await Promise.allSettled(PRECACHE.map((url) => cache.add(url)));
    await self.skipWaiting();
  })());
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

  const url = new URL(req.url);

  // Never cache data. Always network for API routes and Supabase.
  if (url.pathname.startsWith("/api") || url.hostname.endsWith("supabase.co")) return;

  // Navigations: network first, fall back to cache, then to the login shell.
  if (req.mode === "navigate") {
    event.respondWith((async () => {
      try {
        const res = await fetch(req);
        const cache = await caches.open(CACHE);
        cache.put(req, res.clone());
        return res;
      } catch {
        const cached = await caches.match(req);
        return cached || (await caches.match("/admin/login")) || Response.error();
      }
    })());
    return;
  }

  // Same-origin static assets: cache first, then network.
  if (url.origin === self.location.origin) {
    event.respondWith((async () => {
      const cached = await caches.match(req);
      if (cached) return cached;
      try {
        const res = await fetch(req);
        if (res.ok) {
          const cache = await caches.open(CACHE);
          cache.put(req, res.clone());
        }
        return res;
      } catch {
        return cached || Response.error();
      }
    })());
  }
});
