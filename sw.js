const CACHE_NAME = 'aual-stock-v1';
const urlsToCache = [
  './',
  './index.html',
  './manifest.json',
  './img/Asset%202.png'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(urlsToCache);
    })
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(response => {
      if (response) {
        return response; 
      }
      return fetch(event.request).then(networkResponse => {
        if (event.request.url.startsWith('http')) {
          return caches.open(CACHE_NAME).then(cache => {
            cache.put(event.request, networkResponse.clone());
            return networkResponse;
          });
        }
        return networkResponse;
      });
    }).catch(() => {
      console.log('Mode Offline: Data tidak ditemukan di cache.');
    })
  );
});