# Android Development Build Workflow

STILL's native monitoring work requires an Expo development build. Expo Go is still useful for previewing JavaScript-only UI, but it cannot load the Kotlin modules needed for Usage Access, unlock detection, overlays, or native event bridges.

## Current Decision

- Use Expo SDK 57 with `expo-dev-client`.
- The Android project was intentionally generated when Phase 3 native permission work began and should remain tracked as native source of truth.
- App-owned Kotlin code lives in local Expo modules under `modules/` and is autolinked into the generated project.
- Do not edit generated native files casually during UI-only work.

## Before Building

1. Use Node `24.12.0`.
2. Install Android Studio and the Android SDK.
3. Enable Developer Options and USB debugging on the Android phone.
4. Connect the phone by USB and trust the computer.
5. Confirm a device is visible:

```bash
adb devices
```

## Build And Run On Android

For a native build on a connected device:

```bash
npm run android:device
```

That command runs `expo run:android --device`. Native code changes require rebuilding the development client.

After the app is installed, start Metro for the development build:

```bash
npm start
```

Open the installed Still development build on the phone. Use Expo Go only for UI-only checks that do not depend on native monitoring.

## Native Project Commit Rule

When regenerating `android/`:

1. Confirm regeneration is intentional and preserve app-owned native behavior.
2. Review the full native diff before committing.
3. Keep Kotlin monitoring code in the Android project and bridge only typed events to React Native.
4. Document tested device model, Android version, and API level in the session notes.

Do not run destructive clean regeneration without first reviewing app configuration and local modules.

## Verification

For development-build workflow changes:

```bash
npm run typecheck
npm run functions:build
npx expo-doctor
```

For actual native monitoring changes, also run the Android build on a physical device and document the result.
