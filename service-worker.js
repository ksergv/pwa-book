const CACHE_NAME = "reader-cache-v4";

const APP_FILES = [
"./manifest.json"
];

self.addEventListener("install", event => {

event.waitUntil(
caches.open(CACHE_NAME).then(cache => cache.addAll(APP_FILES))
);

self.skipWaiting();

});

self.addEventListener("activate", event => {

event.waitUntil(

caches.keys().then(keys =>
Promise.all(
keys.filter(k => k !== CACHE_NAME)
.map(k => caches.delete(k))
)
)

);

self.clients.claim();

});

self.addEventListener("fetch", event => {

const url = new URL(event.request.url);

if(url.pathname.includes("/books/")){

event.respondWith(

caches.match(event.request).then(res => {

if(res) return res;

return fetch(event.request).then(net => {

const clone = net.clone();

caches.open(CACHE_NAME).then(cache => cache.put(event.request, clone));

return net;

});

})

);

return;

}

event.respondWith(fetch(event.request));

});