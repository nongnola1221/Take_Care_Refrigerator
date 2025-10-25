import apiClient from '../api/axios';

// TODO: Replace with your actual VAPID public key
const VAPID_PUBLIC_KEY = 'YOUR_VAPID_PUBLIC_KEY_HERE';

function urlBase64ToUint8Array(base64String: string) {
  const padding = '='.repeat((4 - base64String.length % 4) % 4);
  const base64 = (base64String + padding).replace(/\-/g, '+').replace(/_/g, '/');
  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);
  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

export const subscribeToPush = async () => {
  if (!('serviceWorker' in navigator) || !('PushManager' in window)) {
    alert('푸시 알림이 이 브라우저에서는 지원되지 않습니다.');
    return;
  }

  try {
    const registration = await navigator.serviceWorker.ready;
    const subscription = await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: urlBase64ToUint8Array(VAPID_PUBLIC_KEY),
    });

    await apiClient.post('/auth/subscribe', subscription);
    alert('푸시 알림이 구독되었습니다!');
  } catch (error) {
    console.error('Failed to subscribe to push notifications:', error);
    alert('푸시 알림 구독에 실패했습니다.');
  }
};
