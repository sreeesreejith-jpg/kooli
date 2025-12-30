/* Updated Service Worker for Instant Updates */
const CACHE_NAME = 'pension-calc-v5';
const ASSETS = [
    './',
    './index.html',
    './style.css',
    './script.js',
    './manifest.json',
    './app-icon.png',
    './screenshot.png'
];
self.addEventListener('install', (event) => {
    self.skipWaiting();
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS))
    );
});
self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cache) => {
                    if (cache !== CACHE_NAME) return caches.delete(cache);
                })
            ).then(() => self.clients.claim());
        })
    );
});
// NETWORK FIRST STRATEGY: This ensures your app updates immediately when you change GitHub
self.addEventListener('fetch', (event) => {
    event.respondWith(
        fetch(event.request)
            .then((response) => {
                const resClone = response.clone();
                caches.open(CACHE_NAME).then((cache) => cache.put(event.request, resClone));
                return response;
            })
            .catch(() => caches.match(event.request))
    );
});
