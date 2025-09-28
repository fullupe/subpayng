// public/sw.js - Enhanced version
const CACHE_NAME = 'subpayng-v1.0.1';
const urlsToCache = [
  '/',
  '/manifest.json',
  '/favicon-196.png'
];

self.addEventListener('install', (event) => {
  console.log('🔄 Service Worker installing...');
  self.skipWaiting(); // Activate immediately
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(urlsToCache))
  );
});

self.addEventListener('activate', (event) => {
  console.log('✅ Service Worker activated');
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('🗑️ Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

self.addEventListener('fetch', (event) => {
  // Skip non-GET requests and chrome-extension requests
  if (event.request.method !== 'GET' || event.request.url.startsWith('chrome-extension://')) return;

  event.respondWith(
    caches.match(event.request)
      .then((cachedResponse) => {
        // Always try network first for HTML pages
        if (event.request.mode === 'navigate') {
          return fetch(event.request)
            .then((networkResponse) => {
              // Cache the new version
              const responseClone = networkResponse.clone();
              caches.open(CACHE_NAME)
                .then((cache) => cache.put(event.request, responseClone));
              return networkResponse;
            })
            .catch(() => {
              // If network fails, return cached version
              return cachedResponse || caches.match('/');
            });
        }

        // For other resources, return cached or fetch
        return cachedResponse || fetch(event.request);
      })
  );
});