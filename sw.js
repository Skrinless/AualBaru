const CACHE_NAME = 'aual-stock-v1';
const urlsToCache = [
  './',
  './index.html',
  './manifest.json',
  './img/Asset%202.png'
];

// Install Service Worker dan simpan file utama ke Cache
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(urlsToCache);
    })
  );
});

// Intercept jaringan: Jika offline, ambil dari Cache. Jika online, simpan file baru ke Cache.
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(response => {
      if (response) {
        return response; // Kembalikan dari cache (Sangat Cepat & Offline)
      }
      return fetch(event.request).then(networkResponse => {
        // Simpan CDN eksternal (Tailwind, Tesseract) ke cache untuk offline nanti
        if (event.request.url.startsWith('http')) {
          return caches.open(CACHE_NAME).then(cache => {
            cache.put(event.request, networkResponse.clone());
            return networkResponse;
          });
        }
        return networkResponse;
      });
    }).catch(() => {
      // Fallback jika offline dan file tidak ada di cache
      console.log('Mode Offline: Data tidak ditemukan di cache.');
    })
  );
});