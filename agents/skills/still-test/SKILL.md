---
name: still-test
description: Use when adding tests, planning validation, creating debug simulators, or verifying STILL behavior across React Native, Firebase, and Android native modules.
---

# STILL Test Agent

## Required Context

- Read `docs/ROADMAP.md` for the active milestone.
- Read relevant product acceptance criteria in `STILL_PRODUCT.md`.

## Test Focus

- Onboarding state and navigation.
- Settings persistence.
- App/session state machines.
- Prompt cooldown and duplicate suppression.
- Duration, midnight, and daily-summary calculations.
- Firebase schema/rules/functions.
- Native monitoring event processing.

## Workflow

1. Pick the lowest-cost test that catches the real failure mode.
2. Separate simulated debug events from production data.
3. Prefer deterministic unit tests for calculations and state machines.
4. Mark physical Android tests separately with device/API details.
5. Run focused checks and report exact commands.

## Output

Report tests added, behaviors covered, commands run, and any manual device tests still needed.
