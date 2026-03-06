const CACHE_NAME="book-pwa-v2";

/* основные файлы */

const STATIC_FILES=[
"./",
"./index.html",
"./manifest.json",
"./book.json"
];

/* установка */

self.addEventListener("install",event=>{

event.waitUntil(

caches.open(CACHE_NAME).then(async cache=>{

/* кэшируем основные файлы */

await cache.addAll(STATIC_FILES);

/* получаем список страниц */

const response=await fetch("./book.json");

const book=await response.json();

/* формируем список страниц */

const pageFiles=book.pages.map(p=>p.file);

/* кэшируем всю книгу */

await cache.addAll(pageFiles);

})

);

self.skipWaiting();

});

/* активация */

self.addEventListener("activate",event=>{

event.waitUntil(self.clients.claim());

});

/* перехват запросов */

self.addEventListener("fetch",event=>{

event.respondWith(

caches.match(event.request)
.then(response=>{

/* если есть в кеше */

if(response) return response;

/* иначе загрузить и сохранить */

return fetch(event.request).then(fetchResponse=>{

const clone=fetchResponse.clone();

caches.open(CACHE_NAME).then(cache=>{
cache.put(event.request,clone);
});

return fetchResponse;

});

})

);

});