# STILL Roadmap

This is the durable multi-session plan. Update checkboxes only when a step is actually implemented and verified.

## Verification Policy

After every implementation task, run `npm run typecheck` under Node `24.12.0` and any task-specific focused check. Run `npm run functions:build` for Firebase Functions changes. Run `npx expo-doctor` for Expo/tooling changes or broad health checks; if it needs network or hangs, report that explicitly. Final task reports must say which checks passed, failed, or were skipped as not relevant.

## Current Status

- Current milestone: Phase 3, Android development build and native monitoring.
- App foundation exists: Expo, TypeScript, Expo Router, Firebase Functions scaffold.
- Numbered user-story backlog exists in `story.md`.
- Full product functionality is not implemented yet.
- Android-native monitoring has not started.

## Phase 0: Operating System For The Project

- [x] Create product spec: `STILL_PRODUCT.md`.
- [x] Store design mockups in `design/`.
- [x] Add design reference library in `design-md/`.
- [x] Create repo agent workforce in `agents/`.
- [x] Install repo-local Codex auto-router skill: `.codex/skills/still-workforce`.
- [x] Create strict design system guide: `docs/DESIGN_SYSTEM.md`.
- [x] Create strict codebase structure guide: `docs/CODEBASE_STRUCTURE.md`.
- [x] Create roadmap/progress tracker: `docs/ROADMAP.md`.
- [x] Create numbered end-to-end user-story backlog: `story.md`.
- [x] Confirm Node 24 setup on the developer machine.
- [x] Decide exact legal font package/assets for premium serif and sans typography.

## Phase 1: Visual Foundation And Navigation

- [x] Replace starter home with app shell.
- [x] Build shared theme tokens.
- [x] Build shared UI primitives: buttons, cards, rows, toggle, segmented control, tabs, prompt sheet.
- [x] Remove leaf/botanical decoration from current screens after device review.
- [x] Build five onboarding screens.
- [x] Persist onboarding completion.
- [x] Build four-tab navigation: Home, My Apps, Insights, Settings.
- [x] Build static Home screen matching design.
- [x] Build static My Apps screen matching design.
- [x] Build static Insights screen matching design.
- [x] Build static Settings screen matching design.
- [x] Build static prompt UI flows for unlock, app opening, and reminder.
- [ ] Verify responsive layout on small/tall phone sizes.

## Phase 2: Local App Functionality

- [x] Add typed models for tracked apps, sessions, prompts, reminders, summaries.
- [x] Add local persistence adapter.
- [x] Make onboarding choices persist.
- [x] Make app toggles persist.
- [x] Make reminder timing settings persist.
- [x] Add prompt/session state machine.
- [x] Add debug simulator for unlock/app-open/reminder events.
- [x] Compute Home metrics from local data.
- [x] Compute Insights trends from local data.
- [x] Add empty states for insufficient data.

## Phase 3: Android Development Build And Native Monitoring

- [x] Set up Expo development build workflow.
- [x] Generate/commit native Android project only when needed.
- [x] Add Android permission inspection.
- [x] Add usage-access settings link and state refresh.
- [ ] Prototype foreground app detection.
- [ ] Prototype selected-app opening event.
- [ ] Add cooldown and duplicate prompt suppression.
- [ ] Prototype unlock detection.
- [ ] Decide permitted prompt surface: overlay, notification, or Activity fallback.
- [ ] Test on physical Android phone and document device/API behavior.

## Phase 4: Real Prompt Behavior

- [ ] Connect app-opening prompt to native app detection.
- [ ] Connect unlock prompt to feasible native unlock signal.
- [ ] Connect reminder prompt to observed session duration.
- [ ] Handle Skip without classifying as unplanned.
- [ ] Handle "5 more min" extension.
- [ ] Handle task completion feedback.
- [ ] Handle permission revocation, reboot, app kill, and selected app uninstall.

## Phase 5: Firebase Optional Sync

- [ ] Configure local Firebase environment for optional sync development.
- [ ] Add anonymous auth that does not block first use.
- [ ] Add Firestore schema for opt-in settings/summaries.
- [ ] Add Firestore security rules.
- [ ] Add Cloud Function validation/deletion support.
- [ ] Add emulator workflow.
- [ ] Add explicit opt-in sync controls.
- [ ] Verify no raw activity/intention/accessibility data syncs by default.

## Phase 6: Experimental Reel/Shorts Detection

- [ ] Write feasibility note.
- [ ] Decide whether AccessibilityService is policy-compliant for this app.
- [ ] Prototype only if justified and explicitly consented.
- [ ] Mark unsupported apps as Unavailable.
- [ ] Add confidence/status to metrics.

## Phase 7: Hardening And Release Prep

- [ ] Add unit tests for state machines and summaries.
- [ ] Add component tests where useful.
- [ ] Add Firebase emulator tests.
- [ ] Add native device test checklist.
- [ ] Add feature support matrix.
- [ ] Add privacy/data deletion documentation.
- [ ] Run full verification.

## Session Log

### 2026-10-10

- Set up Expo/React Native foundation and Firebase Functions scaffold.
- Added `STILL_PRODUCT.md`, `design/`, `design-md/`, agent workforce, design guide, structure guide, and roadmap.
- Moved Codex `still-workforce` skill into repo-local `.codex/skills/still-workforce` so it does not apply to unrelated repositories.
- Replaced prompt-style `story.md` with a numbered implementation backlog.
- Confirmed Node `24.12.0` is installed through `nvm` and verified the repo with `npm run typecheck` and `npm run functions:build` under Node `24.12.0`.
- Chose legal typography packages: `@expo-google-fonts/cormorant-garamond` for display serif and `@expo-google-fonts/inter` for UI sans, loaded through `expo-font` in a later implementation slice.
- Replaced the starter backend/status home with the first STILL app shell: brand header, calm empty-state Home content, setup CTA, and readiness rows that do not fabricate metrics.
- Expanded `src/config/theme.ts` with the STILL palette, spacing, radii, typography, icon sizes, and card shadow tokens; verified TypeScript and checked feature screens for one-off hex colors.
- Built shared UI primitives from the mapped `design/` mockups: button variants, brand header, cards/metric cards, rows, toggle, segmented control, bottom tabs, and prompt sheet. Refactored Home to use the shared header/card/row primitives and verified TypeScript.
- Removed leaf/botanical decoration from visible screens after device review feedback and updated the design guide so future tasks keep the UI clean and compact.
- Added the always-report verification policy to `AGENTS.md` and this roadmap: run typecheck after implementation tasks, run task-specific checks, and state skipped/blocked checks honestly.
- Built the five-step onboarding flow from the mapped `design/` mockups and made it the initial route, with `/home` preserving the current Home shell. Verified with `npm run typecheck` and `npx expo-doctor`.
- Added Expo-compatible AsyncStorage and persisted onboarding completion locally; startup now skips onboarding after completion and falls back to onboarding if the completion flag is missing.
- Added Expo Router `(tabs)` navigation with exactly four tabs: Home, My Apps, Insights, and Settings. Home uses the existing shell; the other tabs are wired with design-aligned placeholders until their static screen slices are built.
- Reworked the Home tab into the static mockup-matched dashboard structure: hero, four empty-state metric cards, insight card, and intentional break row, without fabricating monitoring data. Verified TypeScript, Functions build, and no one-off screen hex colors.
- Replaced the My Apps placeholder with a static design-aligned management screen: monitored app rows, in-memory toggles, chevrons, and Add more apps. Verified TypeScript, Functions build, and no one-off screen hex colors.
- Replaced the Insights placeholder with a static clean dashboard: three empty-state weekly metric cards, muted chart placeholders, and a weekly insight card without fabricated analytics or leaf decoration. Verified TypeScript, Functions build, no one-off screen hex colors, and no leaf/botanical source usage.
- Replaced the Settings placeholder with a static settings screen covering unlock check-in, selected apps, reminder timing, reel counting, privacy, tracking status, and local history actions.
- Added a static prompt preview route for unlock, app-opening, and scrolling reminder prompt states, without claiming native Android overlay behavior is implemented. Verified TypeScript, Functions build, no one-off screen hex colors, and no leaf/botanical source usage.
- Hardened responsive behavior across current screens: rows now shrink text safely, Home/Insights cards wrap chart sections on narrow widths, and prompt preview stat cards/dock wrap instead of overflowing. Verified TypeScript, Functions build, no one-off screen hex colors, and no leaf/botanical source usage; small/tall device screenshot review remains before checking the responsive verification item.
- Added core TypeScript domain models for tracked apps, user preferences, unlock events, prompt events, app sessions, reminders, reel tracking, daily summaries, and weekly summaries with explicit data provenance and unsupported-detector states.
- Added a local AsyncStorage-backed repository adapter for onboarding completion, preferences, tracked apps, prompt/unlock/session/reminder/reel events, and daily summaries. Existing onboarding persistence now uses the shared repository boundary.
- Persisted onboarding app selections and rhythm settings into the local repository, with hydration when onboarding opens again and compatibility with the existing onboarding-completed storage key.
- Persisted My Apps toggles through the shared tracked-app repository records, using the same package IDs created by onboarding and saving prompt/reminder enabled state with each toggle.
- Persisted Settings reminder timing through the shared preferences repository and synchronized tracked apps' default reminder duration when the setting changes.
- Added pure TypeScript session and prompt state machines for monitored-app foreground/background transitions, duplicate session suppression, active prompt suppression, configurable cooldowns, ignored system/STILL apps, and prompt priority ordering.

### 2026-10-11

- Added debug-only local simulation tools for unlock events, intentional app sessions, reminder responses, and experimental reel estimates. Simulated records are marked with `debug-simulated` provenance and can be cleared from the debug screen.
- Added a development-only debug simulator route from Settings so Home/Insights data work can be checked before Android native monitoring exists.
- Connected Home metrics to local session and reel-event storage through a pure selector. Home now refreshes when focused, counts intentional sessions from explicit local choices, sums selected-app foreground duration, shows reel estimates only for supported detector events, and keeps unplanned opens unavailable unless an explicit local category exists.
- Connected Insights to local weekly aggregates for intentional sessions, scrolling check-ins, selected-app time, skipped prompts, extensions, intention drift, and supported reel estimates.
- Added explicit insufficient-data states for Insights so unavailable values, real zeroes, and populated weekly trends render differently without fake analytics.
- Installed Expo's development-client package for SDK 57 and documented the Android development-build workflow in `docs/ANDROID_DEVELOPMENT_BUILD.md`.
- Documented the native Android project policy: keep `android/` uncommitted until Phase 3 native work intentionally generates it, then review and commit it as the Kotlin source of truth.
- Fixed onboarding's inert permission action: `Allow permissions` now opens Android's Usage Access settings and resumes onboarding when the user returns. Actual grant-state inspection and the separate overlay/notification flows remain pending.
- Intentionally generated the Android project and added an autolinked Kotlin permission module for Usage Access, overlay, notifications, and optional accessibility-service inspection. Onboarding and Settings now refresh real state on app resume, while Expo Go reports that a development build is required. Kotlin compilation and a full debug APK build pass; the roadmap item remains open pending physical-device grant/revoke verification.
- Added explicit Usage Access guidance before leaving onboarding: select STILL, enable `Permit usage access`, and return. Onboarding verifies the result and stays on the permission step with corrective guidance if access remains off.
- Physically verified Usage Access grant detection and return-state refresh, completing Android permission inspection and the Usage Access settings-link slice.
- Extended onboarding into a sequential permission flow for Usage Access, Display over other apps, and Notifications. Already-granted permissions are skipped and every step can be declined for reduced functionality; overlay and notification paths remain pending physical-device verification.
- Added the foreground-app detection prototype: Kotlin queries supported Android Usage Events for enabled package IDs, and React Native stores deduplicated native-provenance sessions when STILL returns active. Kotlin compilation and the full debug APK build pass; physical selected/unselected-app testing remains before checking the roadmap item.
