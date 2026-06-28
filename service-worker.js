// ============================================================
// SERVICE WORKER - Deep Learning SD
// Versi: 1.0.1 (Bug Fix Cache Data)
// Fungsi: Cache aset untuk offline mode dan PWA
// ============================================================

const CACHE_NAME = 'deep-learning-sd-v1.1'; // Versi cache dinaikkan untuk force update
const STATIC_ASSETS = [
  './',
  './index.html',
  './style.css',
  './script.js',
  './manifest.json',
  './assets/data/data.js', // FIX: Data materi dan soal ditambahkan ke cache
  'https://cdn.jsdelivr.net/npm/chart.js@4.4.0/dist/chart.umd.min.js',
  'https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js',
  'https://html2canvas.hertzen.com/dist/html2canvas.min.js',
  'https://cdnjs.cloudflare.com/ajax/libs/qrcodejs/1.0.0/qrcode.min.js'
];

// ---- Install Event: Cache semua aset statis ----
self.addEventListener('install', (event) => {
  console.log('[SW] Installing Service Worker...');
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('[SW] Caching static assets');
      return cache.addAll(STATIC_ASSETS).catch((err) => {
        console.warn('[SW] Some assets failed to cache:', err);
      });
    })
  );
  self.skipWaiting();
});

// ---- Activate Event: Hapus cache lama ----
self.addEventListener('activate', (event) => {
  console.log('[SW] Activating Service Worker...');
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((name) => name !== CACHE_NAME)
          .map((name) => {
            console.log('[SW] Deleting old cache:', name);
            return caches.delete(name);
          })
      );
    })
  );
  self.clients.claim();
});

// ---- Fetch Event: Strategi Cache First, lalu Network ----
self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;

  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse) {
        return cachedResponse;
      }
      return fetch(event.request).then((networkResponse) => {
        const responseClone = networkResponse.clone();
        caches.open(CACHE_NAME).then((cache) => {
          cache.put(event.request, responseClone);
        });
        return networkResponse;
      }).catch(() => {
        if (event.request.destination === 'document') {
          return caches.match('./index.html');
        }
      });
    })
  );
});

// ---- Push Notification (opsional) ----
self.addEventListener('push', (event) => {
  const options = {
    body: event.data ? event.data.text() : 'Waktunya belajar! 📚',
    icon: './assets/icons/icon-192.png',
    badge: './assets/icons/icon-72.png',
    vibrate: [100, 50, 100],
    data: { dateOfArrival: Date.now(), primaryKey: 1 }
  };
  event.waitUntil(
    self.registration.showNotification('Deep Learning SD', options)
  );
});
