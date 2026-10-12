# Still

Still is a React Native app built with Expo, TypeScript, Expo Router, and Firebase Functions.

## Requirements

- Node 24.12.0 or newer
- npm
- Android Studio for Android device builds
- Xcode for iOS device builds

This project includes `.nvmrc`, so you can run `nvm use` if you manage Node with nvm.

## Start The App

```bash
npm install
npm start
```

For USB device builds:

```bash
npm run android:device
npm run ios:device
```

More detail is in `docs/USB_DEVICE_SETUP.md`. Android native monitoring requires a development build; see `docs/ANDROID_DEVELOPMENT_BUILD.md`.

## Firebase Setup

1. Create a Firebase project.
2. Register a web app in Firebase.
3. Copy `.env.example` to `.env`.
4. Fill in the `EXPO_PUBLIC_FIREBASE_*` values.
5. Copy `.firebaserc.example` to `.firebaserc` and replace the project id.

The mobile app has a `Ping backend` button that calls the scaffolded Firebase Function.

## Useful Commands

```bash
npm run typecheck
npm run functions:build
npm run functions:serve
npm run emulators
```

## How To Work On STILL

Start every new session from:

1. `docs/ROADMAP.md` for current progress and the next task.
2. `story.md` for the numbered user-story backlog.
3. `STILL_PRODUCT.md` for product behavior.
4. `docs/DESIGN_SYSTEM.md` for UI fidelity.
5. `docs/CODEBASE_STRUCTURE.md` for folder ownership.
6. `agents/README.md` to choose the right workflow agent.

When a story or roadmap item is completed and verified, mark it in `story.md` and `docs/ROADMAP.md`, then add a short session note.

## Project Structure

- `src/app`: Expo Router screens and layouts
- `src/components`: shared UI components
- `src/config`: environment and theme configuration
- `src/features`: feature-owned screens and logic
- `src/services`: integrations such as Firebase
- `functions`: Firebase Functions backend
- `agents`: reusable repo-local workflow agents
- `design`: UI mockups used as visual source of truth
- `docs`: roadmap, setup, design, and architecture notes
- `story.md`: numbered user-story backlog
