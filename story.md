# STILL User Stories

This file is the end-to-end implementation backlog for STILL. It converts `STILL_PRODUCT.md` into numbered user stories that can be completed across many sessions.

Rules for this file:

- Do not mark a story complete until it is implemented and verified.
- Do not mark platform-dependent Android behavior complete from mock data alone.
- Keep production dashboards based on real local data or empty states.
- Update `docs/ROADMAP.md` when a story milestone changes.

Status key:

- `[ ]` Not started
- `[~]` In progress
- `[x]` Complete and verified
- `[!]` Blocked or platform-dependent

## Epic A: Project Foundation

### US-001: Maintain A Durable Project Roadmap

**Status:** [x]

As a developer, I want a persistent roadmap so future sessions know what is done and what comes next.

Acceptance criteria:

- `docs/ROADMAP.md` exists.
- Roadmap phases map to product milestones.
- Completed items are checked only after verification.
- Session notes are added after meaningful progress.

Verification:

- Roadmap reviewed and updated.

### US-002: Maintain Product And Design Source Of Truth

**Status:** [x]

As a developer, I want product and design references in the repo so implementation does not depend on chat history.

Acceptance criteria:

- `STILL_PRODUCT.md` exists.
- `story.md` exists.
- `docs/DESIGN_SYSTEM.md` exists.
- `design/` contains the 12 reference mockups.
- `docs/CODEBASE_STRUCTURE.md` defines folder ownership.

Verification:

- Files exist and are referenced by `AGENTS.md`.

### US-003: Use Repo-Scoped Workflow Agents

**Status:** [x]

As a developer, I want project-specific workflow agents so broad prompts like `continue` route to the correct workflow without affecting other repos.

Acceptance criteria:

- `.codex/skills/still-workforce/SKILL.md` exists.
- `agents/skills/` contains detailed repo workflow agents.
- Global `still-workforce` skill is not required.
- `agents/README.md` explains usage.

Verification:

- Repo-local skill validates with the skill validator.

### US-004: Keep Expo Foundation Healthy

**Status:** [~]

As a developer, I want the Expo app foundation to stay buildable while features are added.

Acceptance criteria:

- Expo Router is configured.
- TypeScript strict mode passes.
- Firebase Functions TypeScript build passes.
- Node version requirement is documented.

Verification:

- `npm run typecheck`
- `npm run functions:build`

Remaining work:

- Run `expo-doctor` when network/tooling allows.

## Epic B: Design System And Shared UI

### US-005: Define STILL Theme Tokens

**Status:** [x]

As a developer, I want central theme tokens so every screen uses consistent premium colors, spacing, radii, and typography.

Acceptance criteria:

- `src/config/theme.ts` includes the final STILL palette from `docs/DESIGN_SYSTEM.md`.
- Tokens include colors, spacing, radii, typography, shadows, and icon sizes.
- Screens do not use random one-off hex colors.
- Theme supports small Android screens and larger font settings.

Verification:

- `npm run typecheck` passed under Node `24.12.0`.
- Search confirmed no unnecessary one-off colors in feature screens.

### US-006: Choose Legal Premium Fonts

**Status:** [~]

As a user, I want STILL to feel premium and consistent without relying on unavailable proprietary fonts.

Acceptance criteria:

- Serif-like display font is chosen and legally usable.
- Sans UI font is chosen and legally usable.
- Fonts load in Expo/dev builds.
- Fallbacks are defined.
- Typography styles are centralized.

Verification:

- Font loading tested on device or Expo preview.
- No screen uses ad hoc font families.

Implementation notes:

- Chosen display family: `Cormorant Garamond` from `@expo-google-fonts/cormorant-garamond`.
- Chosen UI family: `Inter` from `@expo-google-fonts/inter`.
- Both are Google Fonts under the SIL Open Font License.
- Remaining work: install packages, wire `expo-font`, centralize typography tokens, and verify rendering.

### US-007: Build Shared Screen Shell

**Status:** [ ]

As a developer, I want a reusable screen shell so all screens share safe-area, background, padding, and scroll behavior.

Acceptance criteria:

- `ScreenShell` supports scroll and non-scroll layouts.
- Applies warm cream background.
- Handles safe area and bottom tab spacing.
- Supports clean screen layouts without decorative leaf/botanical elements.

Verification:

- Used by onboarding and main screens.
- Tested on small and tall phone sizes.

### US-008: Build Shared Brand Header

**Status:** [~]

As a user, I want consistent STILL branding across onboarding and app screens.

Acceptance criteria:

- Displays spaced `STILL` wordmark.
- Displays tagline where required.
- Supports optional profile/settings icon slot.
- Matches mockup proportions.

Verification:

- Used on onboarding and tab screens.

Implementation notes:

- `src/components/BrandHeader.tsx` exists and is used by Home.
- Remaining work: reuse it across onboarding and tab screens as those screens are built.

### US-009: Build Shared Button Components

**Status:** [~]

As a user, I want clear, consistent buttons for primary actions and secondary text actions.

Acceptance criteria:

- `AppButton` supports primary, secondary, outline, and disabled states.
- Buttons meet 44px minimum touch target.
- Button text does not overflow.
- Arrow/icon affordance is supported.

Verification:

- Typecheck passes.
- Used in onboarding and prompts.

Implementation notes:

- `AppButton` supports primary, secondary, outline, disabled, compact sizing, and before/after icon slots.
- Remaining work: use it in onboarding and prompt flows.

### US-010: Build Shared Card Components

**Status:** [~]

As a developer, I want reusable card primitives for metrics, settings, app rows, and prompt content.

Acceptance criteria:

- `Card`, `MetricCard`, `SettingsRow`, and `AppRow` exist or equivalent primitives exist.
- Cards use central radii/colors/shadows.
- Cards support icons, titles, subtitles, toggles, chevrons, and charts.

Verification:

- Used by Home, My Apps, Insights, Settings.

Implementation notes:

- `Card`, `MetricCard`, `SettingsRow`, `AppRow`, and `Chevron` exist.
- Home now uses shared card and row primitives.
- Remaining work: reuse these primitives in My Apps, Insights, and Settings.

### US-011: Build Shared Toggle And Segmented Controls

**Status:** [~]

As a user, I want switches and segmented choices to behave consistently.

Acceptance criteria:

- Toggle supports on/off/disabled.
- Segmented control supports single choice.
- State is accessible and touch targets are large enough.
- Controls are reusable in onboarding and settings.

Verification:

- Used for app selection, reminder duration, and settings.

Implementation notes:

- `Toggle` and `SegmentedControl` exist with accessible state and 44px minimum touch targets.
- Remaining work: use them in onboarding, app selection, reminder timing, and settings screens.

### US-012: Build Shared Bottom Tabs

**Status:** [x]

As a user, I want permanent navigation between Home, My Apps, Insights, and Settings.

Acceptance criteria:

- Four tabs exist exactly: Home, My Apps, Insights, Settings.
- Active state matches mockups.
- Tabs use consistent icons.
- Navigation works through Expo Router.

Verification:

- Route structure reviewed.
- `npm run typecheck` passed under Node `24.12.0`.
- `npx expo-doctor` passed.

Implementation notes:

- `BottomTabs` primitive exists.
- Expo Router `(tabs)` group exists with exactly Home, My Apps, Insights, and Settings.
- Static My Apps, Insights, and Settings screen content remains tracked by later stories.

### US-013: Keep Decorative Visuals Clean And Optional

**Status:** [~]

As a user, I want STILL to feel calm, clean, and readable on a real phone.

Acceptance criteria:

- Leaf and botanical accents are not shown in current screens.
- Decorative assets are only added after explicit approval.
- Decoration does not block content or touch targets.
- UI remains compact, clean, and readable without decoration.

Verification:

- Device review confirms no leaf/botanical decoration appears in screens.

Implementation notes:

- Leaf/botanical screen decoration was removed after device review feedback.
- `BotanicalBackground` is no longer exported or used by screens.
- Future decorative assets require explicit approval before being added back.

## Epic C: Onboarding

### US-014: Show Welcome Screen

**Status:** [~]

As a new user, I want to understand STILL's purpose before setup.

Acceptance criteria:

- Screen matches welcome mockup.
- Shows brand, tagline, headline, description, illustration, pager dots.
- Primary action: `Get started`.
- Secondary action: `I already know how it works`.
- No login is required.

Verification:

- Manual navigation to next onboarding step.
- Responsive layout check.

Implementation notes:

- `src/features/onboarding/OnboardingScreen.tsx` includes the welcome step with brand, tagline, headline, description, illustration, pager dots, primary action, and secondary action.
- `src/app/index.tsx` now opens onboarding first.
- Remaining work: visual/responsive screenshot pass on small and tall phone sizes before marking complete.

### US-015: Choose Monitored Apps During Onboarding

**Status:** [~]

As a user, I want to choose which apps STILL checks in on.

Acceptance criteria:

- Screen matches app-selection mockup.
- Shows Instagram, YouTube, X, Reddit as initial supported examples until native installed-app query exists.
- Each row has icon, app name, toggle.
- Multiple apps can be selected.
- Selection persists locally.
- User can continue or skip.

Verification:

- Restart app and confirm selections remain.

Implementation notes:

- Onboarding app-selection step shows Instagram, YouTube, X, and Reddit with toggles and multi-select state.
- App selections persist locally through `localRepository.setTrackedApps()` and hydrate when onboarding opens again.
- Remaining work: manual restart verification on device.

### US-016: Configure Rhythm During Onboarding

**Status:** [~]

As a user, I want to set unlock check-ins, reminder timing, and reel counting before using the app.

Acceptance criteria:

- Screen matches rhythm mockup.
- Unlock check-in toggle persists.
- Reminder duration supports 5, 10, 15 minutes.
- Reel counting toggle is shown but disabled or marked unsupported until detector exists.
- Defaults are: unlock check-in on when permission allows, reminder 10 minutes, reel counting off.

Verification:

- Settings persist and appear later in Settings.

Implementation notes:

- Rhythm step includes unlock check-in, reminder timing options for 5/10/15 minutes, and disabled reel-counting toggle.
- Unlock check-in, reminder timing, and reel-counting preference persist locally through `localRepository.setPreferences()` and hydrate when onboarding opens again.
- Remaining work: connect persisted preferences to the Settings screen and manually verify restart behavior on device.

### US-017: Explain And Request Permissions

**Status:** [~]

As a user, I want to understand permissions before granting them.

Acceptance criteria:

- Screen matches permissions mockup.
- Explains Usage Access, Display over other apps, Notifications.
- Accessibility access is shown only when a feature actually requires it.
- Permission status is checked after returning from Android settings.
- User can continue with reduced functionality.
- App never claims a permission is granted without verification.

Verification:

- Manual Android permission flow test.

Implementation notes:

- Permissions explanation step exists and does not claim permissions are granted.
- The primary permission action now opens Android's Usage Access settings instead of silently advancing. It advances after the user returns, while still allowing `Later` for reduced functionality.
- Before opening Settings, STILL now explains that the user must select STILL, enable `Permit usage access`, and return. If access is still off, onboarding stays on the permission step and repeats the exact guidance.
- Remaining work: add separate overlay/notification flows and verify all permission paths on a physical Android device.

### US-018: Complete Onboarding

**Status:** [~]

As a user, I want setup completion to take me into the real app.

Acceptance criteria:

- Screen matches finish mockup.
- Shows `Private by design` and `Gentle, not judgmental`.
- `Enter STILL` saves onboarding completion and opens Home.
- `Review settings` opens settings or relevant onboarding review.
- Onboarding does not repeat after restart unless reset.

Implementation notes:

- Finish step saves onboarding completion with AsyncStorage and `Enter STILL` routes to `/home`.
- The index route reads the stored completion flag on startup and skips onboarding when complete.
- Remaining work: support review settings route and manually verify restart behavior on device/simulator.

Verification:

- Restart app after completion.

## Epic D: Main App Navigation And Screens

### US-019: Build App Shell After Onboarding

**Status:** [ ]

As a returning user, I want STILL to open directly into the main app.

Acceptance criteria:

- App chooses onboarding or tabs based on persisted onboarding state.
- Main app contains four tabs.
- Route files stay thin and feature code lives outside `src/app`.

Verification:

- Restart with onboarding complete and incomplete states.

### US-020: Build Home Dashboard UI

**Status:** [~]

As a user, I want a calm overview of today's phone behavior.

Acceptance criteria:

- Screen matches Home mockup.
- Shows four metric cards: intentional sessions, unplanned/casual opens, selected-app screen time, estimated reels.
- Shows one insight card.
- Shows `Take an intentional break` row.
- Shows empty state when no data exists.

Verification:

- Static UI screenshot comparison.

Implementation notes:

- Static Home composition is implemented from `design/ChatGPT Image Oct 10, 2026 at 04_04_06 PM-1.png`.
- Metric cards use honest empty-state values until local/native monitoring data exists.
- Remaining work: screenshot comparison on small/tall Android layouts and later binding metrics to real local data.

### US-021: Build My Apps UI

**Status:** [~]

As a user, I want to manage apps STILL checks in on.

Acceptance criteria:

- Screen matches My Apps mockup.
- Shows monitored app rows with icon, name, summary, toggle, chevron.
- Includes `Add more apps`.
- Toggle state persists.
- Disabled app no longer schedules future prompts.

Verification:

- Toggle and persistence test.

Implementation notes:

- Static My Apps composition is implemented from `design/ChatGPT Image Oct 10, 2026 at 04_04_08 PM-4.png`.
- Rows, toggles, chevrons, and Add more apps are visible in the tab.
- Toggle state now hydrates from and saves to `localRepository` tracked-app records.
- Disabling an app also disables `promptOnOpen` and `reminderEnabled` in the local tracked-app record.
- Remaining work: connect disabled apps to native prompt scheduling behavior in Phase 3/4 and manually verify restart persistence on device.

### US-022: Build App-Specific Settings

**Status:** [ ]

As a user, I want each monitored app to have its own behavior.

Acceptance criteria:

- App settings include ask before opening, reminder enabled, reminder duration, reel counting where supported.
- Settings persist independently per app.
- Existing history is preserved when monitoring is disabled.
- Unsupported detector status is visible.

Verification:

- Update one app and confirm another app is unchanged.

### US-023: Build Add More Apps Flow

**Status:** [ ]

As a user, I want to choose more installed supported apps.

Acceptance criteria:

- Initial version can show supported placeholder app list.
- Native version queries installed apps within Android package visibility rules.
- User can add app to monitored list.
- Duplicate apps are not added.

Verification:

- Add app and confirm it appears in My Apps.

### US-024: Build Insights UI

**Status:** [~]

As a user, I want to understand trends over time without feeling judged.

Acceptance criteria:

- Screen matches Insights mockup.
- Shows intentional sessions, unplanned/casual opens, estimated reels, and weekly insight.
- Charts are minimal and use real data or empty states.
- No addiction, dopamine, or clinical scoring.

Verification:

- Static UI and empty-state check.

Implementation notes:

- Static Insights composition is implemented from `design/ChatGPT Image Oct 10, 2026 at 04_04_07 PM-3.png`.
- Weekly cards and chart placeholders use empty-state values until local activity summaries exist.
- No fake trend numbers, clinical scoring, or leaf/botanical decoration are used.
- Remaining work: bind metrics and trends to real local data in Phase 2.

### US-025: Build Settings UI

**Status:** [~]

As a user, I want to control STILL.

Acceptance criteria:

- Screen matches Settings mockup.
- Includes unlock check-in, selected apps, reminder timing, reel counting, privacy.
- Shows accurate permission status.
- Includes tracking disable and delete local history.
- All controls are wired to real state or clearly disabled as unavailable.

Verification:

- Toggle persistence and status display check.

Implementation notes:

- Static Settings composition is implemented from `design/ChatGPT Image Oct 10, 2026 at 04_04_07 PM-2.png`.
- Unlock check-in, reel counting, and tracking controls are visible; unavailable platform behavior is called out in copy.
- Selected apps, reminder timing, privacy, tracking, and delete local history rows are visible.
- Reminder timing, unlock check-in, and tracking settings now hydrate from and save to `localRepository` preferences.
- Reminder timing changes also update tracked apps' default reminder duration.
- Remaining work: show real Android permission status, wire tracking disable into native monitoring, and delete local history once session storage is populated.

## Epic E: Local Data And State

### US-026: Define Core TypeScript Models

**Status:** [x]

As a developer, I want typed models so app behavior and dashboards are consistent.

Acceptance criteria:

- Models exist for TrackedApp, UserPreferences, UnlockEvent, AppSession, ReminderEvent, ReelTrackingEvent, DailySummary.
- Intention categories distinguish specific, break, scrolling/casual, skipped, unknown.
- Data provenance is represented where needed.

Verification:

- `npm run typecheck`

Implementation notes:

- `src/models/core.ts` defines `TrackedApp`, `UserPreferences`, `UnlockEvent`, `PromptEvent`, `AppSession`, `ReminderEvent`, `ReelTrackingEvent`, `DailySummary`, and `WeeklySummary`.
- Intention categories distinguish specific task, intentional break, planned/casual scrolling, skipped, and unknown.
- Summary and event types include explicit `DataProvenance` and unsupported detector states.
- Verified with `npm run typecheck`.

### US-027: Add Local Persistence Adapter

**Status:** [~]

As a user, I want settings and history to survive app restarts.

Acceptance criteria:

- Preferences persist.
- Onboarding state persists.
- App settings persist.
- Session history persists.
- Adapter is abstracted so storage can evolve.

Verification:

- Restart persistence test.

Implementation notes:

- `src/storage/asyncStorageAdapter.ts` provides the generic JSON/boolean AsyncStorage adapter.
- `src/storage/localRepository.ts` provides typed repository methods for onboarding, preferences, tracked apps, sessions, prompts, reminders, reel events, unlock events, and daily summaries.
- Existing onboarding completion storage now uses the shared repository.
- Remaining work: wire app settings, reminder timing, and session history writes through the repository and run restart persistence tests.

### US-028: Add Session State Machine

**Status:** [~]

As a developer, I want app sessions to be tracked without duplicates or lost state.

Acceptance criteria:

- Session starts when monitored app enters foreground.
- Session ends when app leaves foreground beyond tolerance, phone locks, or observed session ends.
- Brief overlays do not split sessions unnecessarily.
- Active state persists across process restarts when possible.
- Duplicate foreground events do not create duplicate sessions.

Verification:

- Unit tests for session transitions.

Implementation notes:

- `src/state/sessionStateMachine.ts` handles monitored-app foreground/background, duplicate foreground suppression, brief background grace periods, phone-lock endings, and observed session endings.
- Remaining work: add unit tests and connect the machine to debug/native monitoring events.

### US-029: Add Prompt State Machine

**Status:** [~]

As a user, I want prompts to appear at useful times without loops.

Acceptance criteria:

- Only one intervention active at a time.
- Priority is app-opening check-in, unlock check-in, session reminder.
- Unlock and app-opening prompts do not stack.
- STILL app itself never triggers a prompt.
- Android settings and permission screens do not trigger prompts.
- Cooldown/grace period is configurable.

Verification:

- Unit tests for prompt priority and cooldowns.

Implementation notes:

- `src/state/promptStateMachine.ts` handles active-prompt suppression, configurable cooldowns, ignored system/STILL packages, and priority ordering: app opening, unlock, session reminder, task follow-up.
- Remaining work: add unit tests and connect the machine to prompt preview/debug/native events.

### US-030: Add Daily Summary Calculations

**Status:** [ ]

As a user, I want dashboards to show accurate local summaries.

Acceptance criteria:

- Summaries aggregate by user's local calendar day.
- Sessions crossing midnight are handled.
- Intentional sessions, skipped prompts, casual opens, duration, reminders, extensions, and reel estimates are calculated.
- Incomplete data is marked rather than fabricated.

Verification:

- Unit tests for daily summaries, midnight, and missing data.

## Epic F: Prompt UI Flows

### US-031: Build Unlock Prompt UI

**Status:** [~]

As a user, I want a brief unlock check-in.

Acceptance criteria:

- Prompt matches unlock mockup.
- Shows `What brought you here?`.
- Options: Something specific, Just taking a break, Skip.
- Something specific supports optional intention entry or presets.
- Skip records skipped/unknown, not unplanned.

Verification:

- Manual interaction test.

Implementation notes:

- Static unlock prompt is available in the prompt preview route.
- Remaining work: optional intention entry/presets and real prompt response recording.

### US-032: Build App Opening Prompt UI

**Status:** [~]

As a user, I want to state why I am opening a selected app.

Acceptance criteria:

- Prompt matches app-opening mockup.
- Shows selected app name in copy.
- Options: Do something specific, Just scrolling, Skip.
- Specific path supports presets/custom optional text.
- Scrolling path asks duration: 5, 10, 15, No limit.
- Skip does not ask duration.

Verification:

- Manual flow test for all branches.

Implementation notes:

- Static app-opening prompt is available in the prompt preview route with duration choices.
- Remaining work: optional presets/custom text, branch-specific state, and real session updates.

### US-033: Build Scrolling Reminder Prompt UI

**Status:** [~]

As a user, I want a reminder when my chosen time is reached.

Acceptance criteria:

- Prompt matches reminder mockup.
- Shows elapsed time and planned duration.
- Shows estimated reels only when supported.
- Options: I'm done, 5 more min.
- No duplicate reminder prompts.

Verification:

- Manual/debug simulated session test.

Implementation notes:

- Static reminder prompt is available in the prompt preview route.
- Reel estimate is marked unavailable until detector support exists.
- Remaining work: native/debug triggering, duplicate suppression, and real reminder response handling.

### US-034: Build Intention Completion Prompt Variant

**Status:** [ ]

As a user, I want to reflect on whether I completed my intended task.

Acceptance criteria:

- Uses same prompt component as reminder.
- Asks `Did you do what you came for?`.
- Options: Yes, Not yet, I forgot.
- Saves self-reported completion feedback.
- Does not infer completion from app close.

Verification:

- Manual/debug simulated task session test.

## Epic G: Android Native Monitoring

### US-035: Set Up Expo Development Build For Native Work

**Status:** [~]

As a developer, I need a development build because Expo Go cannot support native Android monitoring.

Acceptance criteria:

- Dev build workflow is documented.
- Android native project is generated/committed only when intentionally needed.
- Build works on connected Android phone.

Verification:

- Physical Android build run.

Implementation notes:

- `expo-dev-client` is installed for Expo SDK 57 development builds.
- `docs/ANDROID_DEVELOPMENT_BUILD.md` documents the Android development-build workflow and clarifies that Expo Go is only for UI-only preview.
- Phase 3 native work intentionally generated `android/`; it is no longer ignored and should remain tracked as native source of truth.
- A local debug APK builds successfully; remaining work is installing and running it on a physical Android device.

### US-036: Inspect Android Permission State

**Status:** [x]

As a user, I want STILL to show real permission status.

Acceptance criteria:

- Native module reports Usage Access, overlay, notifications, and optional accessibility status.
- Status refreshes after returning from settings.
- Missing permissions disable dependent features.

Verification:

- Physical Android permission test.

Implementation notes:

- Added an autolinked local Expo Kotlin module that reports Usage Access, overlay, notification, and app-owned accessibility-service state without treating a Settings launch as a grant.
- Onboarding and Settings refresh permission state whenever the app becomes active; Expo Go and non-Android platforms report the native capability as unavailable.
- Tracking cannot be enabled in Settings until the development build reports Usage Access granted.
- Kotlin compilation and the full debug APK build pass. Usage Access grant and return-state refresh were verified on a physical Android phone on 2026-10-11.

### US-037: Open Android Permission Settings

**Status:** [~]

As a user, I want clear paths to grant permissions.

Acceptance criteria:

- App opens correct Android settings screens where supported.
- Each permission is requested separately.
- User can decline and continue with reduced functionality.

Verification:

- Physical Android settings navigation test.

Implementation notes:

- Onboarding now requests Usage Access, Display over other apps, and Notifications separately, skipping permissions already granted.
- Each step explains exactly what to select, refreshes native state after returning, and permits Skip for reduced functionality.
- Usage Access navigation and refresh are physically verified. Overlay navigation and the Android notification prompt still require physical-device verification.

### US-038: Detect Selected App Foreground Sessions

**Status:** [~]

As a user, I want STILL to know when selected apps are foreground-active.

Acceptance criteria:

- Kotlin uses supported Android usage mechanisms.
- Selected app session start/end events are delivered to React Native/local storage.
- Unselected apps do not trigger app-specific prompts.
- Rapid switching and same-app reopening are deduplicated.

Verification:

- Physical Android test with monitored and unmonitored apps.

Implementation notes:

- The Kotlin module queries Android `UsageStatsManager` activity-resumed/paused/stopped events for enabled app package IDs only, with a bounded 24-hour window and result limit.
- When STILL becomes active, a typed React Native monitor converts observed events into local `AppSession` records with `android-usage-events` provenance.
- Same-app activity transitions within two seconds are deduplicated, and existing session IDs are merged rather than appended repeatedly.
- This is retrospective app-resume capture, not yet a continuous background detector or immediate prompt trigger. Physical tests with selected and unselected apps remain required.

### US-039: Detect Qualifying Unlock Events

**Status:** [ ]

As a user, I want unlock check-ins when enabled and eligible.

Acceptance criteria:

- Kotlin observes supported unlock/screen-interactive events.
- Unlock prompt eligibility respects configured interval.
- Android restrictions are handled honestly with fallback behavior.
- Emergency/system UI is not obstructed.

Verification:

- Physical Android unlock test across repeated unlocks.

### US-040: Display Permitted Android Intervention Surface

**Status:** [ ]

As a user, I want prompts to appear in a permitted, reliable way.

Acceptance criteria:

- Chosen mechanism is documented: overlay, Activity, notification, or fallback.
- Display over other apps is used only when permissioned.
- Prompt does not imitate Android security dialogs.
- If prompt cannot be shown, event records `not shown` accurately.

Verification:

- Physical Android test with overlay/permission variations.

### US-041: Handle Android Lifecycle And Restarts

**Status:** [ ]

As a user, I want STILL to remain accurate through app kills, reboots, and permission changes.

Acceptance criteria:

- Process death does not corrupt active session state.
- Reboot handling is documented and implemented where supported.
- Permission revocation stops dependent monitoring.
- Clock/timezone changes do not corrupt summaries.

Verification:

- Physical Android lifecycle checklist.

## Epic H: Reminder And End-To-End Behavior

### US-042: Connect App Opening Prompt To Native Events

**Status:** [ ]

As a user, I want selected-app openings to trigger the app-opening check-in.

Acceptance criteria:

- Native selected-app event starts prompt flow when eligible.
- Prompt response starts or updates app session.
- Skip records unknown intent.
- No duplicate prompt for uninterrupted session.

Verification:

- Physical Android monitored app opening test.

### US-043: Connect Unlock Prompt To Native Events

**Status:** [ ]

As a user, I want unlock events to trigger unlock check-ins when eligible.

Acceptance criteria:

- Native unlock event starts prompt flow when eligible.
- Cooldown is respected.
- App-opening prompt supersedes unlock prompt during immediate monitored app launch.

Verification:

- Physical Android unlock plus immediate app launch test.

### US-044: Connect Reminder Prompt To Foreground Duration

**Status:** [ ]

As a user, I want reminders after actual foreground usage time.

Acceptance criteria:

- Reminder timer counts monitored foreground duration only.
- Timer pauses when monitored app is not foreground.
- No reminder for No limit sessions.
- Extension adds the configured extension duration.

Verification:

- Physical Android timed session test.

### US-045: Complete Primary Day-In-The-Life Flow

**Status:** [ ]

As a user, I want the whole STILL experience to work across a normal day.

Acceptance criteria:

- Unlock specific intention is recorded.
- Unmonitored app opens without prompt.
- Monitored app just-scrolling session records duration and reminder extension.
- `I'm done` records stop decision without falsely claiming app was killed.
- Specific-task session records completion feedback.
- Skip session is recorded as skipped/unknown.
- Dashboard shows real aggregate data at day end.

Verification:

- Physical Android end-to-end test using debug timestamps or real use.

## Epic I: Reel And Shorts Detection

### US-046: Write Reel/Shorts Feasibility Note

**Status:** [ ]

As a developer, I want an honest feasibility decision before building reel counting.

Acceptance criteria:

- Documents Android/API limitations.
- Documents Google Play AccessibilityService policy risk.
- Documents supported and unsupported apps.
- Recommends whether to prototype.

Verification:

- Feasibility note reviewed before implementation.

### US-047: Prototype Supported Short-Form Detector

**Status:** [!]

As a user, I want estimated short-form counts only if reliable and privacy-preserving.

Acceptance criteria:

- Detector is app-specific.
- Counts meaningful transitions, not generic swipes.
- Debounces duplicate events.
- Stores no content, screenshots, messages, or accessibility node text.
- Marks confidence/support status.

Verification:

- Physical Android app-specific validation.

### US-048: Show Reel Count Availability Honestly

**Status:** [ ]

As a user, I want unavailable data to be clearly labeled.

Acceptance criteria:

- Home and Insights show estimates only when detector is supported and enabled.
- Unsupported state says unavailable.
- No fabricated counts.

Verification:

- Dashboard test with supported, unsupported, and disabled states.

## Epic J: Dashboard And Insights Data

### US-049: Populate Home From Real Data

**Status:** [~]

As a user, I want Home metrics to represent actual observed events and responses.

Acceptance criteria:

- Intentional sessions count specific intentions and intentional breaks.
- Casual/unplanned opens use the agreed explicit category and never count Skip.
- Screen time uses selected-app foreground duration.
- Reel estimates show only supported estimates.
- Insight text is generated from local data.

Verification:

- Unit tests for metric selectors.
- Manual dashboard with seeded/debug data.

Implementation notes:

- Home now reads local app-session and reel-event records through `src/features/home/homeMetrics.ts`.
- Intentional sessions, selected-app screen time, supported reel estimates, and local insight copy update from stored events.
- Unplanned opens remain conservative because the current prompt model does not yet capture a distinct explicit unplanned category; Skip is not counted as unplanned.
- Remaining work: add unit tests and perform a manual dashboard pass with seeded/debug data.

### US-050: Populate Insights From Real Data

**Status:** [~]

As a user, I want weekly trends based on real history.

Acceptance criteria:

- Trends cover intentional sessions, casual opens, selected-app usage, skipped prompts, extensions, and intention drift.
- Charts distinguish zero from unavailable.
- No fake social comparison or clinical scoring.

Verification:

- Unit tests for weekly aggregation.

Implementation notes:

- Insights now reads local app sessions, prompt events, reminder events, and reel events through `src/features/insights/insightsMetrics.ts`.
- Weekly trend cards cover intentional sessions, scrolling check-ins, selected-app time, skipped prompts, extensions, intention drift, and supported reel estimates.
- Charts distinguish unavailable values from real zeroes and populated local data.
- Remaining work: add deterministic unit tests for weekly aggregation.

## Epic K: Settings, Privacy, And Control

### US-051: Implement Tracking Pause

**Status:** [ ]

As a user, I want to pause STILL monitoring.

Acceptance criteria:

- Tracking pause stops new interventions.
- Existing local history remains unless deleted.
- UI clearly shows paused state.
- Resume restores configured monitoring.

Verification:

- Manual and state test.

### US-052: Implement Delete Local History

**Status:** [ ]

As a user, I want to delete locally stored activity history.

Acceptance criteria:

- User receives confirmation prompt.
- Local sessions, prompts, summaries, and reel events are deleted.
- Preferences may remain unless user chooses full reset.
- Home/Insights show empty state after deletion.

Verification:

- Delete flow test and storage inspection.

### US-053: Implement Onboarding Reset

**Status:** [ ]

As a user, I want to restart onboarding if I need to reconfigure STILL.

Acceptance criteria:

- Settings exposes reset onboarding.
- Reset returns to onboarding flow.
- Existing history is not deleted unless explicitly chosen.

Verification:

- Reset and restart test.

### US-054: Implement Permission Diagnostics

**Status:** [ ]

As a user, I want to know why a feature is not working.

Acceptance criteria:

- Settings shows missing permission/capability per feature.
- User can open relevant settings screen.
- Feature rows show disabled/unavailable states.
- No misleading `working` state.

Verification:

- Permission revoked test.

## Epic L: Firebase Optional Sync

### US-055: Configure Local Firebase Environment

**Status:** [ ]

As a developer, I want Firebase config to be explicit and local so optional sync work can be tested without committing secrets or blocking app use.

Acceptance criteria:

- `.env.example` documents required Firebase web app variables.
- App startup works when Firebase config is missing.
- Firebase client only initializes when required config is present.
- Local `.env` remains ignored by git.
- No production deploy is required.

Verification:

- `npm run typecheck`
- Manual check with missing `.env` confirms local app behavior is not blocked.
- Optional check with local Firebase values confirms client initialization.

### US-056: Add Anonymous Auth Without Blocking First Use

**Status:** [ ]

As a user, I want optional cloud support without needing an account before using STILL.

Acceptance criteria:

- Anonymous auth starts when network is available.
- First use and core prompts work without auth.
- Auth failures do not block local app behavior.

Verification:

- Offline first-launch test.

### US-057: Add Opt-In Cloud Sync Settings

**Status:** [ ]

As a privacy-conscious user, I want cloud sync to be explicit.

Acceptance criteria:

- Sync is off by default.
- User can opt in and opt out.
- UI explains what is synced.
- Raw detailed events and free-text intentions are not synced by default.

Verification:

- Sync off prevents writes.

### US-058: Sync Settings And Aggregate Summaries

**Status:** [ ]

As a user who opts in, I want settings and summaries synced securely.

Acceptance criteria:

- Firestore stores user-scoped settings and daily aggregates.
- Ownership is enforced by rules.
- Cloud writes are low-frequency.
- No raw accessibility data is uploaded.

Verification:

- Firebase emulator tests.

### US-059: Add Cloud Deletion Support

**Status:** [ ]

As a user, I want synced cloud data deleted when requested.

Acceptance criteria:

- Cloud deletion request removes user-scoped synced data.
- Local delete and cloud delete are clearly distinguished.
- Cloud Function validates ownership.

Verification:

- Emulator test for deletion.

## Epic M: Testing And Quality

### US-060: Add Debug Simulation Tools

**Status:** [~]

As a developer, I want to simulate events without pretending they are production monitoring.

Acceptance criteria:

- Debug-only tools can simulate unlock, app open, reminder timeout, reminder response, reel event.
- Simulated data is marked or separated from production paths.
- Debug tools are excluded from release builds or hidden behind dev checks.

Verification:

- Debug simulation manual test.

Implementation notes:

- `src/services/debug/debugSimulator.ts` can create unlock, intentional app-session, reminder-response, and reel-estimate records.
- `src/features/debug/DebugSimulatorScreen.tsx` exposes development-only controls and a clear-debug-data action.
- Simulated records use `debug-simulated` provenance or debug ID prefixes so they can be separated from future Android-native events.
- Remaining work: manual Expo/device pass to confirm the debug screen updates Home metrics end to end.

### US-061: Add Unit Tests For State And Calculations

**Status:** [ ]

As a developer, I want state machines and calculations to be protected by tests.

Acceptance criteria:

- Tests cover prompt priority, cooldowns, session transitions, summaries, midnight, skipped prompts, and unavailable data.
- Tests are deterministic.
- Test command is documented.

Verification:

- Test suite passes.

### US-062: Add Firebase Emulator Tests

**Status:** [ ]

As a developer, I want Firebase behavior validated without production access.

Acceptance criteria:

- Functions build and run in emulator.
- Rules enforce user ownership.
- Sync/deletion tests use emulator.

Verification:

- Emulator test command passes.

### US-063: Add Physical Android Test Checklist

**Status:** [ ]

As a developer, I want platform-dependent behavior validated on a real phone.

Acceptance criteria:

- Checklist covers permissions, unlocks, app sessions, overlays, reminders, app switching, reboot, permission revocation.
- Results include device model, Android version, date, and known limitations.

Verification:

- At least one physical Android run documented before marking MVP complete.

## Epic N: Release Readiness

### US-064: Add Feature Support Matrix

**Status:** [ ]

As a user and developer, I want clear labels for working, experimental, and unsupported features.

Acceptance criteria:

- Matrix lists onboarding, tabs, app selection, app monitoring, unlock prompts, reminders, reel detection, Firebase sync.
- Each feature has status: Working, Experimental, Unsupported, or Planned.
- Platform limitations are documented.

Verification:

- Matrix reviewed before release.

### US-065: Add Privacy Documentation

**Status:** [ ]

As a user, I want to understand what STILL stores and syncs.

Acceptance criteria:

- Documents local-first data policy.
- Documents what is never collected.
- Documents optional sync.
- Documents delete local history and cloud deletion.

Verification:

- Privacy doc reviewed against implementation.

### US-066: Complete MVP Acceptance Checklist

**Status:** [ ]

As the product owner, I want a final gate before considering the app complete.

Acceptance criteria:

- Onboarding ends at real Home and does not repeat unnecessarily.
- Every toggle persists and changes behavior.
- All three popup flows respond correctly.
- Skip never creates a judgmental metric.
- Unlock and app prompts do not stack.
- Reminder times reflect observed foreground duration.
- Dashboard and Insights use real local data.
- Unsupported reel detection is labeled honestly.
- Core tracking works offline when Android permissions are present.
- Users can disable tracking and delete local history.
- Firebase sync is opt-in and access-controlled.
- UI matches the attached designs.
- Essential flows are tested on a real Android device.

Verification:

- Full checklist run and documented result.
