import { connectFunctionsEmulator, getFunctions, httpsCallable } from 'firebase/functions';

import { env } from '@/config/env';
import { firebaseApp } from '@/services/firebase/client';

type PingResponse = {
  message: string;
  timestamp: string;
};

let emulatorConnected = false;

export async function pingBackend() {
  if (!firebaseApp) {
    throw new Error('Firebase app is not configured.');
  }

  const functions = getFunctions(firebaseApp, env.firebase.functionsRegion);

  if (env.firebase.useEmulators && !emulatorConnected) {
    connectFunctionsEmulator(functions, env.firebase.functionsEmulatorHost, env.firebase.functionsEmulatorPort);
    emulatorConnected = true;
  }

  const ping = httpsCallable<void, PingResponse>(functions, 'ping');
  const response = await ping();

  return response.data;
}
