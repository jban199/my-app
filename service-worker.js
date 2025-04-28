// Service Worker Version - Update this to force new installs
const SW_VERSION = '1.0.0';
const CACHE_NAME = `app-cache-v${SW_VERSION}`;
const OFFLINE_URL = 'https://jban199.github.io/my-app/offline.html';

// Precache these files - Add your core assets here
const PRECACHE_ASSETS = [
  'https://jban199.github.io/my-app',
  'https://jban199.github.io/my-app/index.html',
  'https://jban199.github.io/my-app/styles.css',
  'https://jban199.github.io/my-app/dark-theme.css',
  'https://jban199.github.io/my-app/light-theme.css',
  'https://jban199.github.io/my-app/footermenu.html',
  'https://jban199.github.io/my-app/sbm.html',
  'https://jban199.github.io/my-app/sidebar.html',
  'https://jban199.github.io/my-app/offline.html',
  'https://jban199.github.io/my-app/calls.html',
  'https://jban199.github.io/my-app/hologram.html',
  'https://jban199.github.io/my-app/nearme.html',
  'https://jban199.github.io/my-app/siren.html',
  'https://jban199.github.io/my-app/indexeddb.html',
  'https://jban199.github.io/my-app/phonebook.html',
  'https://jban199.github.io/my-app/topsites.html',
  'https://jban199.github.io/my-app/favicon.ico',
  'https://jban199.github.io/my-app/images/icon-192x192.png',
  'https://jban199.github.io/my-app/images/icon-512x512.png',
  'https://jban199.github.io/my-app/images/icons/srn-balloon.svg',
  'https://jban199.github.io/my-app/images/icons/srn-crow.svg',
  'https://jban199.github.io/my-app/images/icons/srn-dog.svg',
  'https://jban199.github.io/my-app/images/icons/srn-electric.svg',
  'https://jban199.github.io/my-app/images/icons/srn-flash.svg',
  'https://jban199.github.io/my-app/images/icons/srn-flash-off.svg',
  'https://jban199.github.io/my-app/images/icons/srn-fox.svg',
  'https://jban199.github.io/my-app/images/icons/srn-life.svg',
  'https://jban199.github.io/my-app/images/icons/srn-neon-blink.svg',
  'https://jban199.github.io/my-app/images/icons/srn-red.svg',
  'https://jban199.github.io/my-app/images/icons/srn-red-blink.svg',
  'https://jban199.github.io/my-app/images/icons/srn-siren.svg',
  'https://jban199.github.io/my-app/images/icons/srn-siren-blink.svg',
  'https://jban199.github.io/my-app/images/icons/srn-wolf.svg',
  'https://jban199.github.io/my-app/media/srn-sounds/warfare_taser_gun_005.mp3',
  'https://jban199.github.io/my-app/media/srn-sounds/warfare_taser_gun_002.mp3',
  'https://jban199.github.io/my-app/media/srn-sounds/balloon-rubbing-foley-5-184049.mp3',
  'https://jban199.github.io/my-app/media/srn-sounds/big-dog-barking-300504.mp3',
  'https://jban199.github.io/my-app/media/srn-sounds/fox-calling-243999.mp3',
  'https://jban199.github.io/my-app/media/srn-sounds/scary-wolf-growling-224086.mp3',
  'https://jban199.github.io/my-app/media/srn-sounds/hooded-crow-cawing-217457.mp3',
  'https://jban199.github.io/my-app/media/srn-sounds/crow-bird-calling-bird-crow-sound-8908.mp3',
  'https://jban199.github.io/my-app/media/srn-sounds/crow-67929.mp3',
  'https://jban199.github.io/my-app/media/srn-sounds/civil-defense-siren-128262.mp3',
  'https://jban199.github.io/my-app/media/srn-sounds/siren-38642.mp3',
  'https://jban199.github.io/my-app/media/srn-sounds/delta-7-evacuation-siren-22510.mp3',
  'https://jban199.github.io/my-app/media/srn-sounds/siren-a-248662.mp3',
  'https://jban199.github.io/my-app/media/srn-sounds/siren-police-63597.mp3',
  'https://jban199.github.io/my-app/media/srn-sounds/police-operation-siren-144229.mp3',
  'https://jban199.github.io/my-app/media/srn-sounds/fire-truck-siren-29900.mp3'
  'https://jban199.github.io/my-app/images/moon/krishna-amavasya.webp',
  'https://jban199.github.io/my-app/images/moon/krishna-ashtami.webp',
  'https://jban199.github.io/my-app/images/moon/krishna-chaturdashi.webp',
  'https://jban199.github.io/my-app/images/moon/krishna-chaturthi.webp',
  'https://jban199.github.io/my-app/images/moon/krishna-dashami.webp',
  'https://jban199.github.io/my-app/images/moon/krishna-dwadashi.webp',
  'https://jban199.github.io/my-app/images/moon/krishna-dwitiya.webp',
  'https://jban199.github.io/my-app/images/moon/krishna-ekadashi.webp',
  'https://jban199.github.io/my-app/images/moon/krishna-navami.webp',
  'https://jban199.github.io/my-app/images/moon/krishna-panchami.webp',
  'https://jban199.github.io/my-app/images/moon/krishna-pratipada.webp',
  'https://jban199.github.io/my-app/images/moon/krishna-saptami.webp',
  'https://jban199.github.io/my-app/images/moon/krishna-shashthi.webp',
  'https://jban199.github.io/my-app/images/moon/krishna-trayodashi.webp',
  'https://jban199.github.io/my-app/images/moon/krishna-tritiya.webp',
  'https://jban199.github.io/my-app/images/moon/shukla-ashtami.webp',
  'https://jban199.github.io/my-app/images/moon/shukla-chaturdashi.webp',
  'https://jban199.github.io/my-app/images/moon/shukla-chaturthi.webp',
  'https://jban199.github.io/my-app/images/moon/shukla-dashami.webp',
  'https://jban199.github.io/my-app/images/moon/shukla-dwadashi.webp',
  'https://jban199.github.io/my-app/images/moon/shukla-dwitiya.webp',
  'https://jban199.github.io/my-app/images/moon/shukla-ekadashi.webp',
  'https://jban199.github.io/my-app/images/moon/shukla-navami.webp',
  'https://jban199.github.io/my-app/images/moon/shukla-panchami.webp',
  'https://jban199.github.io/my-app/images/moon/shukla-pratipada.webp',
  'https://jban199.github.io/my-app/images/moon/shukla-purnima.webp',
  'https://jban199.github.io/my-app/images/moon/shukla-saptami.webp',
  'https://jban199.github.io/my-app/images/moon/shukla-shashthi.webp',
  'https://jban199.github.io/my-app/images/moon/shukla-trayodashi.webp',
  'https://jban199.github.io/my-app/images/moon/shukla-tritiya.webp',
  'https://jban199.github.io/my-app/images/dashboard/day/sun-duration.png',
  'https://jban199.github.io/my-app/images/dashboard/day/moon-duration.png',
  'https://jban199.github.io/my-app/images/dashboard/day/morning.svg',
  'https://jban199.github.io/my-app/images/dashboard/day/afternoon.svg',
  'https://jban199.github.io/my-app/images/dashboard/day/evening.svg',
  'https://jban199.github.io/my-app/images/dashboard/day/night.svg',
  'https://jban199.github.io/my-app/images/nm/nm-placeholder.svg'

];

// ===== INSTALL EVENT =====
self.addEventListener('install', (event) => {
  console.log('[Service Worker] Installing version', SW_VERSION);

  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('[Service Worker] Precaching assets');
        return cache.addAll(PRECACHE_ASSETS);
      })
      .then(() => self.skipWaiting()) // Force activate new SW
  );
});

// ===== ACTIVATE EVENT =====
self.addEventListener('activate', (event) => {
  console.log('[Service Worker] Activating version', SW_VERSION);

  // Clean up old caches
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('[Service Worker] Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// ===== FETCH EVENT (Stale-While-Revalidate) =====
self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;

  // Handle navigation requests with offline fallback
  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request).catch(() => caches.match(OFFLINE_URL))
    );
    return;
  }

  // For other assets - Stale-While-Revalidate
  event.respondWith(
    caches.match(event.request)
      .then((cachedResponse) => {
        const fetchPromise = fetch(event.request)
          .then((networkResponse) => {
            const responseClone = networkResponse.clone();
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(event.request, responseClone);
            });
            return networkResponse;
          })
          .catch(() => cachedResponse); // fallback to cache on fail

        return cachedResponse || fetchPromise;
      })
  );
});

// ===== MESSAGE HANDLER (Update Notification) =====
self.addEventListener('message', (event) => {
  if (event.data.action === 'skipWaiting') {
    self.skipWaiting();
  }
});

// ===== OPTIONAL: Periodic Update Check =====
function checkForUpdates() {
  caches.open(CACHE_NAME).then((cache) => {
    cache.match('/version.json').then((response) => {
      if (response) {
        response.json().then((data) => {
          if (data.version !== SW_VERSION) {
            notifyClientsUpdateAvailable();
          }
        });
      }
    });
  });
}

function notifyClientsUpdateAvailable() {
  self.clients.matchAll().then((clients) => {
    clients.forEach((client) => {
      client.postMessage({
        type: 'UPDATE_AVAILABLE',
        version: SW_VERSION
      });
    });
  });
}

self.addEventListener('periodicsync', (event) => {
  if (event.tag === 'update-check') {
    event.waitUntil(checkForUpdates());
  }
});
