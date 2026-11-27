/* Racer offline cache. Only touches the files below; every other page on the site is left alone. */
var CACHE="racer-v1";
var FILES=["/racer.html","/manifest.webmanifest","/icon-180.png","/icon-192.png","/icon-512.png"];
self.addEventListener("install",function(e){e.waitUntil(caches.open(CACHE).then(function(c){return c.addAll(FILES)}).then(function(){return self.skipWaiting()}))});
self.addEventListener("activate",function(e){e.waitUntil(caches.keys().then(function(ks){return Promise.all(ks.filter(function(k){return k!==CACHE&&k.indexOf("racer-")===0}).map(function(k){return caches.delete(k)}))}).then(function(){return self.clients.claim()}))});
self.addEventListener("fetch",function(e){
  var u=new URL(e.request.url);
  if(e.request.method!=="GET"||u.origin!==location.origin||FILES.indexOf(u.pathname)<0)return;
  /* cache first, refresh in the background so updates arrive on the next launch */
  e.respondWith(caches.match(u.pathname).then(function(hit){
    var net=fetch(e.request).then(function(r){if(r&&r.ok){var cp=r.clone();caches.open(CACHE).then(function(c){c.put(u.pathname,cp)})}return r}).catch(function(){return hit});
    return hit||net;
  }));
});
