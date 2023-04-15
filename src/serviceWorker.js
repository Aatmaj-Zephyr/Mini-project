var staticCacheName = "pwa";
const assetsToCache = [
  './src/index.html',
  './src/mystyle.css'
];
self.addEventListener("install", function (e) {
  e.waitUntil(
    caches.open(staticCacheName).then(function (cache) {
      console.log("Service worker installed");
      return cache.addAll(assetsToCache);
    }) 
  );
});
 
self.addEventListener("fetch", function (event) {
  console.log(event.request.url);
 
  event.respondWith(
    caches.match(event.request).then(function (response) {
      console.log("Service worker Fetched");
      return response || fetch(event.request);
    })
  );


  
}); 

self.addEventListener('sync', event => {
  if (event.tag === 'unique-tag-name') {
    console.log("blablabla");
  }
});
// service-worker.js

self.addEventListener('push', event => {
  const options = {
    body: 'Hello', // set the body of the notification to 'Hello'
    icon: 'icon.png', // set the icon for the notification
    badge: 'badge.png' // set the badge for the notification
  };

  event.waitUntil(
    self.registration.showNotification('Notification Title', options)
  );
});

// Schedule a push notification every 30 seconds
self.addEventListener('install', event => {
  event.waitUntil(
    self.registration.showNotification('Notification Title', {
      body: 'Hello',
      icon: 'icon.png',
      badge: 'badge.png',
      tag: 'my-notification' // set a unique tag for the notification
    })
  );

  // Schedule the next push notification after 30 seconds
  setInterval(() => {
    self.registration.showNotification('Notification Title', {
      body: 'Hello',
      icon: 'icon.png',
      badge: 'badge.png',
      tag: 'my-notification'
    });
  }, 30000); // 30 seconds in milliseconds
});

// Handle notification click event
self.addEventListener('notificationclick', event => {
  // handle notification click event, e.g., open a specific page or perform a certain action
  self.registration.getNotifications({ tag: 'my-notification' }).then(notifications => {
    notifications.forEach(notification => {
      notification.close();
    });
  });
});
