---
name: still-workforce
description: Auto-route STILL project requests in /Users/adityachand/repos/Still, especially "continue", "resume", design, React Native, Android native, Firebase, debug, review, test, or cleanup tasks, to the relevant repo workflow agent and roadmap.
---

# STILL Workforce Orchestrator

Use this skill when the user is working on the STILL app in `/Users/adityachand/repos/Still`, or when the user says to continue/resume STILL work.

This skill is the dispatcher. It does not replace the repo-local agents; it loads the correct one for the task.

## Start Here

1. Work from `/Users/adityachand/repos/Still`.
2. Read `AGENTS.md`.
3. Read `docs/ROADMAP.md`.
4. Identify the user's requested task.
5. If the request is "continue", "resume", or similarly vague, select the next unchecked roadmap item.
6. Load only the relevant repo agent from `agents/skills/<agent>/SKILL.md`.

## Routing

- Architecture, milestones, or cross-feature decisions: `agents/skills/still-architecture/SKILL.md`
- UI, visual polish, design-system work, or mockup matching: `agents/skills/still-design-fidelity/SKILL.md`
- React Native screens, components, Expo Router, state, or TypeScript features: `agents/skills/still-react-native-feature/SKILL.md`
- Kotlin, Android permissions, usage monitoring, overlays, native lifecycle: `agents/skills/still-android-native/SKILL.md`
- Firebase Auth, Firestore, Functions, rules, emulators, sync: `agents/skills/still-firebase/SKILL.md`
- Build/runtime failures or broken behavior: `agents/skills/still-debug/SKILL.md`
- Code review: `agents/skills/still-review/SKILL.md`
- Tests or verification strategy: `agents/skills/still-test/SKILL.md`
- Refactors and structure cleanup: `agents/skills/still-clean-code/SKILL.md`

For UI implementation, use both `still-design-fidelity` and `still-react-native-feature`: design fidelity sets the visual constraints; React Native feature owns the implementation workflow.

## Operating Loop

1. Inspect the smallest relevant files.
2. Implement one coherent roadmap slice.
3. Run focused checks, usually `npm run typecheck` and any feature-specific checks.
4. Update `docs/ROADMAP.md` only for completed and verified items.
5. Add a short session note when meaningful progress is made.
6. Report changed files, verification, and the next recommended roadmap item.

## Guardrails

- Do not load all agents by default.
- Do not fabricate completed work or mark unchecked items without verification.
- Do not claim Expo Go supports native Android monitoring.
- Do not deploy Firebase or modify production infrastructure without explicit approval.
- Do not replace the product spec, design system, or roadmap unless the user asks.
