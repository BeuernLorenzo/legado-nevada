const CACHE_NAME = "nevada-admin-v4-cloud";


const APP_FILES = [
  "./",
  "./index.html",
  "./admin.css",
  "./admin.js",

  "./ponto.html",
  "./ponto.css",
  "./ponto.js",

  "./supabase-config.js",

  "./manifest.webmanifest",

  "./assets/images/logo-nevada-oficial.jpg",
  "./assets/images/logo-nevada-192.png",
  "./assets/images/logo-nevada-512.png",
  "./assets/images/apple-touch-icon.png"
];

self.addEventListener("install", event => {
  event.waitUntil(caches.open(CACHE_NAME).then(cache => cache.addAll(APP_FILES)));
  self.skipWaiting();
});

self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys().then(keys => Promise.all(
      keys.filter(key => key !== CACHE_NAME).map(key => caches.delete(key))
    ))
  );
  self.clients.claim();
});

self.addEventListener("fetch", event => {
  if (event.request.method !== "GET") return;
  event.respondWith(
    caches.match(event.request).then(cached => cached || fetch(event.request))
  );
});

// Estrutura pronta para deep links de futuras notificações Web Push.
self.addEventListener("notificationclick", event => {
  event.notification.close();
  const target = event.notification?.data?.url || "./index.html?section=geral";
  event.waitUntil(clients.openWindow(target));
});
