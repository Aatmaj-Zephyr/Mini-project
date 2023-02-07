var staticCacheName = "pwa";
const assetsToCache = [
  './index.html',
  './mystyle.css'
];
self.addEventListener("install", function (e) {
  e.waitUntil(
    caches.open(staticCacheName).then(function (cache) {
      console.log("Service worker installed");
      return cache.addAll(assetsToCache);
    }) 
  );
});
 
self.addEventListener("fetch", function (event) {
  console.log(event.request.url);
 
  event.respondWith(
    caches.match(event.request).then(function (response) {
      console.log("Service worker Fetched");
      return response || fetch(event.request);
    })
  );
});

