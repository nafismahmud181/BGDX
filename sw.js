const V = 'bgdx-v1.1.0';
const SHELL = ['./', './index.html', './support.js', './firebase-config.js', './manifest.webmanifest', './icon-192.png', './icon-512.png'];
// Push: Firebase shows notifications that arrive while the app is closed, and opens the task when tapped.
try {
  importScripts('./firebase-config.js');
  if (self.BGDX_FIREBASE && self.BGDX_FIREBASE.apiKey) {
    importScripts('https://www.gstatic.com/firebasejs/10.14.1/firebase-app-compat.js', 'https://www.gstatic.com/firebasejs/10.14.1/firebase-messaging-compat.js');
    firebase.initializeApp(self.BGDX_FIREBASE);
    firebase.messaging();
  }
} catch (e) {}
self.addEventListener('install', e => { e.waitUntil(caches.open(V).then(c => c.addAll(SHELL)).then(() => self.skipWaiting())); });
self.addEventListener('activate', e => { e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== V).map(k => caches.delete(k)))).then(() => self.clients.claim())); });
self.addEventListener('fetch', e => {
  const r = e.request;
  if (r.method !== 'GET') return;
  const u = new URL(r.url);
  if (u.hostname === 'script.google.com' || u.hostname.endsWith('googleusercontent.com')) return;
  if (r.mode === 'navigate') {
    e.respondWith(fetch(r).then(res => { const c = res.clone(); caches.open(V).then(ch => ch.put('./index.html', c)); return res; }).catch(() => caches.match('./index.html')));
    return;
  }
  e.respondWith(caches.match(r).then(hit => {
    const net = fetch(r).then(res => { if (res.ok || res.type === 'opaque') { const c = res.clone(); caches.open(V).then(ch => ch.put(r, c)); } return res; }).catch(() => hit);
    return hit || net;
  }));
});
