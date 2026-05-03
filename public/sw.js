const CACHE_NAME = "real-kebab-menu-v3";

const CORE_ASSETS = [
  "/",
  "/index.html",
  "/manifest.webmanifest",
  "/real-kebab-istanbul/masa-1",
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
      fetch(event.request).catch(async () => {
        return (await caches.match(event.request)) || caches.match("/index.html");
      })
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
