const APP_SHELL_CACHE = 'app-shell-v1';
const IMAGE_CACHE = 'faculty-images-v1';
const DATA_CACHE = 'faculty-data-v1';

const APP_SHELL_URLS = ['/', '/index.html'];

// Install: pre-cache the app shell
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(APP_SHELL_CACHE).then((cache) => cache.addAll(APP_SHELL_URLS))
  );
  self.skipWaiting();
});

// Activate: clean up old caches
self.addEventListener('activate', (event) => {
  const validCaches = [APP_SHELL_CACHE, IMAGE_CACHE, DATA_CACHE];
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys
          .filter((key) => !validCaches.includes(key))
          .map((key) => caches.delete(key))
      )
    )
  );
  self.clients.claim();
});

// Fetch: route requests to the appropriate cache strategy
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Cache-first for faculty images from isb.nu.edu.pk
  if (url.hostname === 'isb.nu.edu.pk') {
    event.respondWith(cacheFirst(request, IMAGE_CACHE));
    return;
  }

  // Cache-first for static faculty JSON data
  if (
    url.pathname === '/data/faculty.json' ||
    url.pathname === '/data/facultyOffices.json'
  ) {
    event.respondWith(cacheFirst(request, DATA_CACHE));
    return;
  }

  // Cache-first for app shell (HTML, JS, CSS)
  if (
    url.pathname === '/' ||
    url.pathname === '/index.html' ||
    url.pathname.startsWith('/assets/')
  ) {
    event.respondWith(cacheFirst(request, APP_SHELL_CACHE));
    return;
  }
});

async function cacheFirst(request, cacheName) {
  const cached = await caches.match(request);
  if (cached) return cached;

  try {
    const response = await fetch(request);
    if (response.ok) {
      const cache = await caches.open(cacheName);
      cache.put(request, response.clone());
    }
    return response;
  } catch (err) {
    return new Response('Network error', { status: 503, statusText: 'Service Unavailable' });
  }
}
