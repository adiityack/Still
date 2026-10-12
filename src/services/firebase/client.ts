import { getApp, getApps, initializeApp } from 'firebase/app';

import { env, hasFirebaseConfig } from '@/config/env';

export const firebaseApp = hasFirebaseConfig
  ? getApps().length
    ? getApp()
    : initializeApp({
        apiKey: env.firebase.apiKey,
        appId: env.firebase.appId,
        authDomain: env.firebase.authDomain,
        messagingSenderId: env.firebase.messagingSenderId,
        projectId: env.firebase.projectId,
        storageBucket: env.firebase.storageBucket,
      })
  : null;
