const CACHE_NAME = "dtracker-v1";
const OFFLINE_PAGE_URL = "/offline";

const STATIC_FILES_TO_CACHE = [OFFLINE_PAGE_URL, "/manifest.webmanifest"];

self.addEventListener("install", (event) => {
  event.waitUntil(preloadStaticFiles());
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(removeOldCaches());
  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  const { request } = event;
  const url = new URL(request.url);

  if (!shouldHandleRequest(request, url)) {
    return;
  }

  if (isPageRequest(request)) {
    event.respondWith(handlePageRequest(request));
    return;
  }

  if (isStaticAssetRequest(request, url)) {
    event.respondWith(handleStaticAssetRequest(request));
  }
});

async function preloadStaticFiles() {
  const cache = await caches.open(CACHE_NAME);
  await cache.addAll(STATIC_FILES_TO_CACHE);
}

async function removeOldCaches() {
  const cacheNames = await caches.keys();

  await Promise.all(
    cacheNames
      .filter((cacheName) => cacheName !== CACHE_NAME)
      .map((cacheName) => caches.delete(cacheName)),
  );
}

function shouldHandleRequest(request, url) {
  if (request.method !== "GET") {
    return false;
  }

  if (url.origin !== self.location.origin) {
    return false;
  }

  if (url.pathname.startsWith("/api/")) {
    return false;
  }

  return true;
}

function isPageRequest(request) {
  console.log("Request mode:", request.mode);
  return request.mode === "navigate";
}

function isStaticAssetRequest(request, url) {
  return (
    url.pathname.startsWith("/_next/static/") ||
    ["style", "script", "image", "font"].includes(request.destination)
  );
}

async function handlePageRequest(request) {
  try {
    const response = await fetch(request);
    await saveInCache(request, response);
    return response;
  } catch {
    const cachedResponse = await caches.match(request);

    if (cachedResponse) {
      return cachedResponse;
    }

    return getOfflinePage();
  }
}

async function handleStaticAssetRequest(request) {
  const cachedResponse = await caches.match(request);

  if (cachedResponse) {
    return cachedResponse;
  }

  try {
    const response = await fetch(request);
    await saveInCache(request, response);
    return response;
  } catch {
    return Response.error();
  }
}

async function saveInCache(request, response) {
  if (!response.ok) {
    return;
  }

  const cache = await caches.open(CACHE_NAME);
  await cache.put(request, response.clone());
}

async function getOfflinePage() {
  const offlineResponse = await caches.match(OFFLINE_PAGE_URL);

  if (offlineResponse) {
    return offlineResponse;
  }

  return Response.error();
}
