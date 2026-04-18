const CACHE_NAME = 'foodmaster-v3'
const BASE_PATH = new URL(self.registration.scope).pathname.replace(/\/$/, '')
const withBase = (path) => `${BASE_PATH}${path}`
const APP_FILES = [
  withBase('/'),
  withBase('/manifest.webmanifest'),
  withBase('/icons/icon-192.svg'),
  withBase('/icons/icon-512.svg'),
]

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(APP_FILES)
    }),
  )
})

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key)))
    }),
  )
})

self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return
  event.respondWith(
    caches.match(event.request).then((cached) => {
      return (
        cached ||
        fetch(event.request).then((response) => {
          const cloned = response.clone()
          caches.open(CACHE_NAME).then((cache) => cache.put(event.request, cloned))
          return response
        })
      )
    }),
  )
})
