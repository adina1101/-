const CACHE_NAME = 'cardix-offline-v1';
const STATIC_ASSETS = [
  '/', '/manifest.webmanifest', '/assets/cardix-brand.png',
  '/assets/shop/dice-diamonds-card.jpg',
  '/assets/shop/mechanical-ace-card.jpg',
  '/assets/shop/neon-ace-card.jpg',
  '/assets/shop/royal-blood-card.jpg',
  '/assets/shop/vintage-spades-card.jpg',
];

async function cacheAppShell() {
  const cache = await caches.open(CACHE_NAME);
  await cache.addAll(STATIC_ASSETS);
  const response = await fetch('/');
  const html = await response.text();
  const assetUrls = [...html.matchAll(/(?:src|href)="([^"#]+)"/g)]
    .map((match) => match[1])
    .filter((url) => url.startsWith('/'));
  await Promise.allSettled(assetUrls.map((url) => cache.add(url)));
}

self.addEventListener('install', (event) => {
  event.waitUntil(cacheAppShell().then(() => self.skipWaiting()));
});

self.addEventListener('activate', (event) => {
  event.waitUntil(Promise.all([
    caches.keys().then((keys) => Promise.all(keys
      .filter((key) => key.startsWith('cardix-offline-') && key !== CACHE_NAME)
      .map((key) => caches.delete(key)))),
    self.clients.claim(),
  ]));
});

self.addEventListener('fetch', (event) => {
  const request = event.request;
  const url = new URL(request.url);
  if (request.method !== 'GET' || url.origin !== self.location.origin) return;
  event.respondWith((async () => {
    const cache = await caches.open(CACHE_NAME);
    const key = request.mode === 'navigate' ? '/' : request;
    const cached = await cache.match(key);
    const refresh = fetch(request).then((response) => {
      if (response.ok) void cache.put(key, response.clone());
      return response;
    });
    if (cached) {
      event.waitUntil(refresh.catch(() => undefined));
      return cached;
    }
    try { return await refresh; }
    catch { return (await cache.match('/')) ?? Response.error(); }
  })());
});
