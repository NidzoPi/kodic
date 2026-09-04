const CACHE_NAME = "kodic-v1";

self.addEventListener("install", (event) => {
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(self.clients.claim());
});

self.addEventListener("fetch", (event) => {
  // Za sada ne keširamo zahtjeve.
  // Aplikacija nastavlja normalno koristiti Vercel/server.
});