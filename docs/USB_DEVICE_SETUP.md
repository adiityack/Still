# Running Still On Your Phone

## First-Time Setup

1. Install Node 24.12.0 or newer.
2. From this folder, run `npm install`.
3. Copy `.env.example` to `.env` and add your Firebase web app values.

## Easiest Phone Preview

Run:

```bash
npm start
```

Install Expo Go on your phone and scan the QR code. If your phone and computer are not on the same network, use:

```bash
npm run start:tunnel
```

Expo Go is only for UI and JavaScript-only preview. Android monitoring, Usage Access, unlock events, overlays, and native bridges require the development build workflow in `docs/ANDROID_DEVELOPMENT_BUILD.md`.

## Android By USB

1. Install Android Studio.
2. Enable Developer Options and USB debugging on your phone.
3. Connect the phone by USB and trust the computer.
4. For local Firebase emulators, run `adb reverse tcp:5001 tcp:5001`.
5. Run:

```bash
npm run android:device
```

This creates or updates the native Android project if needed. Run it only when you intentionally need a development build or native validation.

## iPhone By USB

1. Install full Xcode from the App Store.
2. Open Xcode once and finish its setup.
3. Connect your iPhone by USB and trust the computer.
4. Run:

```bash
npm run ios:device
```

For local Firebase emulators on a physical iPhone, set `EXPO_PUBLIC_FIREBASE_FUNCTIONS_EMULATOR_HOST` to your computer's local network IP address.

If iOS fails with an Xcode command line tools error, select full Xcode:

```bash
sudo xcode-select -s /Applications/Xcode.app/Contents/Developer
```
