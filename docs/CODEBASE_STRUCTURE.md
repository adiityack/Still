# STILL Codebase Structure

## Current Stack

- Expo SDK 57.
- React Native 0.86.
- TypeScript.
- Expo Router.
- Firebase client SDK.
- Firebase Functions TypeScript backend.

## Folder Ownership

```text
src/
  app/                 route files only
  components/          shared UI primitives
  config/              env, theme, constants
  features/            product features and screens
  hooks/               shared hooks
  models/              shared TypeScript types
  services/
    firebase/          Firebase client/functions wrappers
    monitoring/        JS-facing monitoring interfaces
  state/               app stores/state machines
  storage/             persistence adapters
  utils/               pure utilities

functions/
  src/                 Firebase Cloud Functions

design/                mockup references
design-md/             optional design inspiration references
agents/                reusable workflow agents
docs/                  roadmap and project docs
```

## Route Rules

- `src/app` files should be thin route wrappers.
- Put screen implementations in `src/features/<feature>/`.
- Use Expo Router for navigation.
- Do not create React Navigation separately unless the architecture is intentionally changed.

## Component Rules

- Shared components go in `src/components`.
- Feature-only components stay inside `src/features/<feature>/components`.
- Use `src/config/theme.ts` for colors, spacing, radii, typography, and shadows.
- Avoid screen-level one-off styling when a shared primitive exists.

## Data Rules

- Production dashboards use real local data or empty states.
- Mock/demo data must live in clearly named debug fixtures and never masquerade as production tracking.
- Typed models belong in `src/models`.
- Core prompt/session behavior must work offline.

## Native Android Rules

- `android/` was intentionally generated when Phase 3 native permission work began and is part of the native source of truth.
- Keep app-owned Kotlin capabilities in local Expo modules under `modules/` so autolinking remains explicit and typed.
- Review generated native diffs whenever app configuration or Expo dependencies change.
- Kotlin owns usage monitoring, unlock detection, overlays, permissions, and lifecycle-sensitive timers.
- React Native consumes native events through a typed service boundary.

## Firebase Rules

- Firebase is optional sync/backend support.
- Cloud Functions live in `functions/src`.
- No production deploys without explicit approval.
- Secrets stay out of git.
