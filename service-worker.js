const CACHE_NAME = "reader-cache-v1";

/* основные файлы приложения */

const APP_FILES = [
"./",
"./index.html",
"./reader.html",
"./manifest.json"
];

/* установка */

self.addEventListener("install", event => {

event.waitUntil(

caches.open(CACHE_NAME).then(cache => {

return cache.addAll(APP_FILES);

})

);

self.skipWaiting();

});

/* активация */

self.addEventListener("activate", event => {

event.waitUntil(self.clients.claim());

});

/* fetch */

self.addEventListener("fetch", event => {

const url = new URL(event.request.url);

/* книги */

if(url.pathname.includes("/books/")){

event.respondWith(

caches.match(event.request).then(response => {

if(response) return response;

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

/* обычные файлы */

event.respondWith(

caches.match(event.request).then(response => {

return response || fetch(event.request);

})

);

});