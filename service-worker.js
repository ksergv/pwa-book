const CACHE_NAME = "book-pwa-v4";

const STATIC_FILES = [
  "./",
  "./index.html",
  "./manifest.json",
  "./book.json"
];

/* установка */

self.addEventListener("install", event => {

  event.waitUntil(

    caches.open(CACHE_NAME).then(async cache => {

      await cache.addAll(STATIC_FILES);

      /* получаем список страниц */

      const response = await fetch("./book.json");
      const book = await response.json();

      const pages = book.pages.map(p => p.file);

      await cache.addAll(pages);

    })

  );

  self.skipWaiting();

});

/* активация */

self.addEventListener("activate", event => {
  event.waitUntil(self.clients.claim());
});

/* обработка запросов */

self.addEventListener("fetch", event => {

  const url = new URL(event.request.url);

  /* картинки */

  if (url.pathname.includes("/img/")) {

    event.respondWith(

      caches.match(event.request).then(response => {

        if (response) return response;

        return fetch(event.request).then(fetchResponse => {

          const clone = fetchResponse.clone();

          caches.open(CACHE_NAME).then(cache => {
            cache.put(event.request, clone);
          });

          return fetchResponse;

        });

      })

    );

    return;
  }

  /* обычная cache-first */

  event.respondWith(

    caches.match(event.request).then(response => {

      return response || fetch(event.request);

    })

  );

});