const CACHE_NAME = "real-kebab-menu-v4";

const CORE_ASSETS = [
  "/index.html",
  "/manifest.webmanifest",
  "/brand/opening-poster.png",
  "/brand/real-istanbul-hero-clean.png",
  "/brand/real-istanbul-hero-kebab.png",
  "/brand/real-istanbul-logo-luxe.png",
  "/brand/dish-kebab-rollo.png",
  "/brand/dish-kebab-pan.png",
  "/brand/dish-lahmacun.png",
  "/brand/dish-pizza-kebab.png",
  "/brand/dish-iskender-kebab.png",
  "/brand/dish-baklava-pistachio.png",
  "/brand/drink-softs.png",
  "/brand/drink-water.png",
  "/brand/drink-efes.png",
  "/placeholders/real-kebab-round-sign.svg",
  "/placeholders/doner.svg",
  "/placeholders/wrap.svg",
  "/placeholders/plate.svg",
  "/placeholders/burger.svg",
  "/placeholders/pizza.svg",
  "/placeholders/falafel.svg",
  "/placeholders/fastfood.svg",
  "/placeholders/dessert.svg",
  "/placeholders/drink.svg",
  "/placeholders/game-chef.svg",
  "/placeholders/burnt-doner.svg"
];

function isStaticAsset(request) {
  const url = new URL(request.url);
  return (
    url.origin === self.location.origin &&
    (url.pathname.startsWith("/assets/") ||
      /\.(?:js|css|png|jpg|jpeg|webp|svg|ico|json|webmanifest)$/i.test(url.pathname))
  );
}

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches
      .open(CACHE_NAME)
      .then((cache) => cache.addAll(CORE_ASSETS))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) => Promise.all(keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") {
    return;
  }

  if (event.request.mode === "navigate") {
    event.respondWith(
      (async () => {
        try {
          const response = await fetch(event.request);
          const cache = await caches.open(CACHE_NAME);
          cache.put("/index.html", response.clone());
          return response;
        } catch {
          return (await caches.match("/index.html")) || Response.error();
        }
      })()
    );
    return;
  }

  if (isStaticAsset(event.request)) {
    event.respondWith(
      (async () => {
        const cache = await caches.open(CACHE_NAME);

        try {
          const response = await fetch(event.request);
          if (response.ok) {
            cache.put(event.request, response.clone());
          }
          return response;
        } catch {
          return (await caches.match(event.request)) || Response.error();
        }
      })()
    );
    return;
  }

  event.respondWith(
    caches.match(event.request).then((cached) => {
      const networkRequest = fetch(event.request)
        .then((response) => {
          if (response.ok) {
            const clone = response.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(event.request, clone));
          }
          return response;
        })
        .catch(() => cached);

      return cached || networkRequest;
    })
  );
});
