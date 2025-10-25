console.log('Service Worker Loaded');

self.addEventListener('push', event => {
  const data = event.data.json();
  console.log('Push Received...', data);

  const title = data.title || '냉장고 요리사';
  const options = {
    body: data.body || '새로운 알림이 도착했습니다.',
    icon: 'vite.svg', // Optional
  };

  event.waitUntil(self.registration.showNotification(title, options));
});
