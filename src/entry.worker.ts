/// <reference lib="webworker" />
import { BackgroundSyncPlugin } from 'workbox-background-sync';
import { precacheAndRoute } from 'workbox-precaching';
import { registerRoute } from 'workbox-routing';
import { NetworkFirst, StaleWhileRevalidate } from 'workbox-strategies';

declare let self: ServiceWorkerGlobalScope;

/* ── Precache app shell ───────────────────────────────── */
// The __WB_MANIFEST placeholder is replaced at build time by
// vite-plugin-pwa with the list of assets to precache.
precacheAndRoute(self.__WB_MANIFEST);

/* ── Google Fonts: stale-while-revalidate ─────────────── */
registerRoute(
  ({ url }) =>
    url.origin === 'https://fonts.googleapis.com' ||
    url.origin === 'https://fonts.gstatic.com',
  new StaleWhileRevalidate({
    cacheName: 'google-fonts',
  }),
);

/* ── API calls: network-first with offline fallback ───── */
const bgSyncPlugin = new BackgroundSyncPlugin('budget-sync', {
  maxRetentionTime: 7 * 24 * 60, // Retry for up to 7 days (minutes)
});

registerRoute(
  ({ url }) => url.pathname.startsWith('/api/'),
  new NetworkFirst({
    cacheName: 'api-cache',
    networkTimeoutSeconds: 5,
    plugins: [bgSyncPlugin],
  }),
  'GET',
);

// POST/PUT/DELETE to API — queue for background sync when offline
registerRoute(
  ({ url, request }) =>
    url.pathname.startsWith('/api/') && request.method !== 'GET',
  new NetworkFirst({
    cacheName: 'api-mutations',
    plugins: [bgSyncPlugin],
  }),
  'POST',
);

/* ── Activate immediately ─────────────────────────────── */
self.addEventListener('install', () => {
  void self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(self.clients.claim());
});
