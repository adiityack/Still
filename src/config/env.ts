const readEnv = (key: string) => process.env[key]?.trim() ?? '';

export const env = {
  firebase: {
    apiKey: readEnv('EXPO_PUBLIC_FIREBASE_API_KEY'),
    authDomain: readEnv('EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN'),
    projectId: readEnv('EXPO_PUBLIC_FIREBASE_PROJECT_ID'),
    storageBucket: readEnv('EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET'),
    messagingSenderId: readEnv('EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID'),
    appId: readEnv('EXPO_PUBLIC_FIREBASE_APP_ID'),
    functionsRegion: readEnv('EXPO_PUBLIC_FIREBASE_FUNCTIONS_REGION') || 'us-central1',
    functionsEmulatorHost: readEnv('EXPO_PUBLIC_FIREBASE_FUNCTIONS_EMULATOR_HOST') || 'localhost',
    functionsEmulatorPort: Number(readEnv('EXPO_PUBLIC_FIREBASE_FUNCTIONS_EMULATOR_PORT') || 5001),
    useEmulators: readEnv('EXPO_PUBLIC_USE_FIREBASE_EMULATORS') === 'true',
  },
};

export const hasFirebaseConfig = Boolean(env.firebase.apiKey && env.firebase.projectId && env.firebase.appId);
