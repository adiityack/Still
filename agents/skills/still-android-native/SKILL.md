---
name: still-android-native
description: Use when editing or designing Kotlin native Android monitoring, permissions, overlays, background services, app usage tracking, or native bridges.
---

# STILL Android Native Agent

Use this for Android system behavior. Do not use it for ordinary React Native UI.

## Required Context

- Read `STILL_PRODUCT.md` sections on Android operation, popups, privacy, and MVP boundaries.
- Read `docs/CODEBASE_STRUCTURE.md`.
- Inspect existing Android/native implementation before proposing new modules.

## Constraints

- Essential monitoring belongs in Kotlin, not long-running JavaScript timers.
- Expo Go cannot support native monitoring; use development builds when native modules are added.
- Respect Android background execution, overlay, UsageStats, notification, and AccessibilityService policies.
- Never claim lock-screen replacement, exact reel counts, or forced third-party app closing unless verified on device and policy-compliant.

## Workflow

1. Identify required permissions and OS/API constraints.
2. Design native event flow and bridge payloads.
3. Handle lifecycle, reboot, process death, permission revocation, duplicate events, and cooldowns.
4. Keep private data local by default.
5. Validate with emulator/build checks where possible.
6. Mark physical-device verification requirements explicitly.

## Output

Report implemented native behavior, permission requirements, tested device/API level, and known unsupported cases.
