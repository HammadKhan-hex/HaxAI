self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', () => clients.claim());
self.addEventListener('fetch', () => {
  // Minimal service worker so Chrome recognizes this as an installable PWA.
});
