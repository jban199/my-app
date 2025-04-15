// Service Worker Version - Update this to force new installs
const SW_VERSION = '1.0.0';
const CACHE_NAME = `app-cache-v${SW_VERSION}`;
const OFFLINE_URL = '/offline.html';

// Precache these files - Add your core assets here
const PRECACHE_ASSETS = [
  '/',
  '/index.html',
  '/styles.css',
  '/dark-theme.css',
  '/light-theme.css',
  '/footermenu.html',
  '/sbm.html',
  '/sidebar.html',
  '/calls.html',
  '/hologram.html',
  '/nearme.html',
  '/indexeddb.html',
  '/phonebook.html',
  '/topsites.html',

  '/favicon.ico',
  '/images/icon-192x192.png',
  '/images/icon-512x512.png',
  '/images/icons/srn-balloon.svg',
  '/images/icons/srn-crow.svg',
  '/images/icons/srn-dog.svg',
  '/images/icons/srn-electric.svg',
  '/images/icons/srn-flash.svg',
  '/images/icons/srn-flash-off.svg',
  '/images/icons/srn-fox.svg',
  '/images/icons/srn-life.svg',
  '/images/icons/srn-neon-blink.svg',
  '/images/icons/srn-red.svg',
  '/images/icons/srn-red-blink.svg',
  '/images/icons/srn-siren.svg',
  '/images/icons/srn-siren-blink.svg',
  '/images/icons/srn-wolf.svg',
  '/media/srn-sounds/warfare_taser_gun_005.mp3',
  '/media/srn-sounds/warfare_taser_gun_002.mp3',
  '/media/srn-sounds/balloon-rubbing-foley-5-184049.mp3',
  '/media/srn-sounds/big-dog-barking-300504.mp3',
  '/media/srn-sounds/fox-calling-243999.mp3',
  '/media/srn-sounds/scary-wolf-growling-224086.mp3',
  '/media/srn-sounds/hooded-crow-cawing-217457.mp3',
  '/media/srn-sounds/crow-bird-calling-bird-crow-sound-8908.mp3',
  '/media/srn-sounds/crow-67929.mp3',
  '/media/srn-sounds/civil-defense-siren-128262.mp3',
  '/media/srn-sounds/siren-38642.mp3',
  '/media/srn-sounds/delta-7-evacuation-siren-22510.mp3',
  '/media/srn-sounds/siren-a-248662.mp3',
  '/media/srn-sounds/siren-police-63597.mp3',
  '/media/srn-sounds/fox-calling-243999.mp3',
  '/media/srn-sounds/police-operation-siren-144229.mp3',
  '/media/srn-sounds/fire-truck-siren-29900.mp3',

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
    }).then(() => {
      // Take control of all clients immediately
      return self.clients.claim();
    })
  );
});

// ===== FETCH EVENT (Stale-While-Revalidate) =====
self.addEventListener('fetch', (event) => {
  // Skip non-GET requests
  if (event.request.method !== 'GET') return;

  // Handle navigation requests (HTML pages) with offline fallback
  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request)
        .catch(() => caches.match(OFFLINE_URL))
    );
    return;
  }

  // For all other assets, use Stale-While-Revalidate
  event.respondWith(
    caches.match(event.request)
      .then((cachedResponse) => {
        // Always try to update from network in background
        const fetchPromise = fetch(event.request)
          .then((networkResponse) => {
            // Update cache with fresh response
            caches.open(CACHE_NAME)
              .then((cache) => cache.put(event.request, networkResponse.clone()));
            return networkResponse;
          })
          .catch(() => {}); // Silently fail if network fails

        // Return cached response immediately, then update
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

// ===== PERIODIC UPDATE CHECK =====
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

// Check for updates every 6 hours
self.addEventListener('periodicsync', (event) => {
  if (event.tag === 'update-check') {
    event.waitUntil(checkForUpdates());
  }
});
