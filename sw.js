const VERSION = "sahu-moe-ultra-plus-v2";

const STATIC_CACHE = "static-" + VERSION;
const UI_CACHE = "ui-" + VERSION;

const EXPERT_CACHES = {
  deepseek: "expert-deepseek-" + VERSION,
  gpt: "expert-gpt-" + VERSION,
  kimi: "expert-kimi-" + VERSION,
  qwen: "expert-qwen-" + VERSION,
  glm: "expert-glm-" + VERSION,
  misc: "expert-misc-" + VERSION
};

const STATIC_FILES = [
  "./",
  "./index.html",
  "./manifest.json",
  "./icon-512.png"
];

self.addEventListener("install", event => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(STATIC_CACHE).then(cache => cache.addAll(STATIC_FILES))
  );
});

self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys.filter(k => !k.includes(VERSION)).map(k => caches.delete(k))
      )
    )
  );
  self.clients.claim();
});

self.addEventListener("fetch", event => {
  const req = event.request;
  if (req.method !== "GET") return;

  const url = req.url;

  if (url.includes("/chat") || url.includes("/completion") || url.includes("/api")) {
    event.respondWith(handleAI(req));
    return;
  }

  event.respondWith(cacheFirst(req));
});

async function cacheFirst(req) {
  const cached = await caches.match(req);
  return cached || fetch(req).then(res => {
    const copy = res.clone();
    caches.open(UI_CACHE).then(c => c.put(req, copy));
    return res;
  });
}

async function handleAI(req) {
  const expert = detectExpert(req.url);
  const cacheName = EXPERT_CACHES[expert] || EXPERT_CACHES.misc;

  try {
    const res = await fetch(req);
    const copy = res.clone();

    const cache = await caches.open(cacheName);
    await cache.put(req, copy);

    trim(cache, 20);
    return res;

  } catch {
    const cached = await caches.match(req);
    return cached || new Response(JSON.stringify({
      error: "offline",
      message: "No cached response available"
    }), { headers: { "Content-Type": "application/json" } });
  }
}

function detectExpert(url) {
  url = url.toLowerCase();
  if (url.includes("deepseek")) return "deepseek";
  if (url.includes("gpt")) return "gpt";
  if (url.includes("kimi")) return "kimi";
  if (url.includes("qwen")) return "qwen";
  if (url.includes("glm")) return "glm";
  return "misc";
}

async function trim(cache, max) {
  const keys = await cache.keys();
  if (keys.length > max) await cache.delete(keys[0]);
}

self.addEventListener("message", e => {
  if (e.data === "SKIP_WAITING") self.skipWaiting();
});
