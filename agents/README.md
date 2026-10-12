# STILL Agent Workforce

This folder contains reusable repo-local workflow agents. They are written as Codex-style skills so future sessions can load only the workflow needed for the current task.

Repo-local auto-router installed:

- `.codex/skills/still-workforce/SKILL.md`

That repo-local skill should trigger for STILL project work inside this repository and route broad prompts like "continue" or "resume" to this folder's relevant agent.

Use them by name when a task matches the trigger:

| Agent | Trigger |
|---|---|
| `still-architecture` | Planning milestones, module boundaries, data flow, or cross-feature decisions |
| `still-design-fidelity` | Implementing UI from `design/` mockups or refining visual quality |
| `still-react-native-feature` | Screens, components, Expo Router, local state, or TypeScript app features |
| `still-android-native` | Kotlin, Android permissions, app usage monitoring, overlays, or device lifecycle |
| `still-firebase` | Firebase Auth, Firestore, Functions, rules, emulators, or sync |
| `still-debug` | Build failures, runtime errors, broken behavior, or dependency issues |
| `still-review` | Code review for bugs, privacy risks, regressions, and missing tests |
| `still-test` | Test strategy, unit tests, integration checks, or physical device validation |
| `still-clean-code` | Refactors, component extraction, duplication removal, or structure cleanup |

Operating loop for long-running sessions:

1. Read `docs/ROADMAP.md` and the specific task section.
2. Load the matching agent skill only.
3. Inspect the smallest relevant code/design files.
4. Implement one coherent slice.
5. Run focused verification.
6. Mark completed checklist items in `docs/ROADMAP.md`.
7. Add a short session note in `docs/ROADMAP.md`.

Do not load all skills for ordinary tasks. Do not create extra agents unless a repeated workflow is clearly missing.
