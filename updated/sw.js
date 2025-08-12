const CACHE_NAME = 'foysal-cybersec-v1.0.0';
const urlsToCache = [
  '/',
  '/blog.html',
  '/projects.html',
  '/tools.html',
  '/contact/index.html',
  '/assets/css/modern-style.css',
  '/assets/css/style.css',
  '/assets/js/modern-script.js',
  '/assets/image/2025-05-19.webp',
  'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Orbitron:wght@400;700;900&family=JetBrains+Mono:wght@400;500&family=Noto+Sans+Bengali:wght@300;400;500;600&display=swap',
  'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css'
];

// Install event
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
  );
});

// Fetch event
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Return cached version or fetch from network
        if (response) {
          return response;
        }
        return fetch(event.request);
      }
    )
  );
});

// Activate event
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            console.log('Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

// Background sync for offline form submissions
self.addEventListener('sync', event => {
  if (event.tag === 'contact-form') {
    event.waitUntil(syncContactForm());
  }
});

async function syncContactForm() {
  // Handle offline form submissions when back online
  const formData = await getStoredFormData();
  if (formData) {
    try {
      await submitContactForm(formData);
      await clearStoredFormData();
    } catch (error) {
      console.error('Failed to sync contact form:', error);
    }
  }
}

// Push notification handler
self.addEventListener('push', event => {
  const options = {
    body: event.data ? event.data.text() : 'New update available!',
    icon: '/assets/image/2025-05-19.webp',
    badge: '/assets/image/2025-05-19.webp',
    vibrate: [100, 50, 100],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: 1
    },
    actions: [
      {
        action: 'explore',
        title: 'Explore',
        icon: '/assets/icons/checkmark.png'
      },
      {
        action: 'close',
        title: 'Close',
        icon: '/assets/icons/xmark.png'
      }
    ]
  };

  event.waitUntil(
    self.registration.showNotification('Foysal Cybersec', options)
  );
});

// Notification click handler
self.addEventListener('notificationclick', event => {
  event.notification.close();

  if (event.action === 'explore') {
    event.waitUntil(
      clients.openWindow('/')
    );
  }
});

// Helper functions
async function getStoredFormData() {
  // Implementation for retrieving stored form data
  return null;
}

async function submitContactForm(formData) {
  // Implementation for submitting contact form
  return fetch('/contact', {
    method: 'POST',
    body: formData
  });
}

async function clearStoredFormData() {
  // Implementation for clearing stored form data
  return true;
}

