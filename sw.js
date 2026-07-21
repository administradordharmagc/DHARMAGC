/* SW ligero: no bloquea la app. Red primero; cache solo como respaldo. */
const CACHE = "dharma-tablero-v2";

self.addEventListener("install", (event) => {
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.map((k) => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (event) => {
  const req = event.request;
  if (req.method !== "GET") return;
  const url = new URL(req.url);
  if (url.hostname.includes("jsonblob.com") || url.hostname.includes("cdn.sheetjs.com") || url.hostname.includes("fonts.")) {
    return;
  }
  event.respondWith(
    fetch(req).catch(() => caches.match(req).then((hit) => hit || caches.match("./index.html")))
  );
});
