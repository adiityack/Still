---
name: still-react-native-feature
description: Use when implementing or modifying STILL React Native screens, Expo Router navigation, components, hooks, local state, or TypeScript app logic.
---

# STILL React Native Feature Agent

## Required Context

- Read `docs/CODEBASE_STRUCTURE.md`.
- Read `docs/ROADMAP.md` for the current milestone.
- If UI is involved, also use `still-design-fidelity`.
- For Expo APIs, check the Expo SDK version and matching docs first.

## Workflow

1. Locate existing screen, feature, and shared component patterns.
2. Keep route files in `src/app`; put feature logic outside routes.
3. Prefer typed models and small feature-owned modules.
4. Implement real behavior for controls; avoid decorative-only toggles.
5. Keep UI reusable through shared components and tokens.
6. Run `npm run typecheck`; run additional focused checks when available.
7. Update `docs/ROADMAP.md` only when a checklist item is truly complete.

## Output

Report changed files, user-visible behavior, and verification. Mention any blocked platform-native behavior separately.
