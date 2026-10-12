import { initializeApp } from 'firebase-admin/app';
import { onCall } from 'firebase-functions/v2/https';

initializeApp();

export const ping = onCall({ region: 'us-central1' }, () => ({
  message: 'Still backend is reachable.',
  timestamp: new Date().toISOString(),
}));
