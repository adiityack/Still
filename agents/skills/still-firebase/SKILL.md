---
name: still-firebase
description: Use when editing Firebase Auth, Firestore, Cloud Functions, security rules, emulator setup, or optional sync for STILL.
---

# STILL Firebase Agent

## Required Context

- Read `STILL_PRODUCT.md` Firebase and privacy sections.
- Inspect `firebase.json`, `functions/`, environment examples, and any rules files.

## Rules

- Firebase is optional support; core prompts and local dashboard must work offline.
- Use anonymous auth initially and do not block first use on auth.
- Sync only opt-in summaries/settings unless product requirements explicitly change.
- Never upload raw app histories, typed intentions, accessibility data, or detailed event streams by default.
- Never deploy or modify production infrastructure without explicit approval.

## Workflow

1. Confirm schema, auth state, and ownership rules.
2. Prefer emulator-based local testing.
3. Keep Cloud Functions low-frequency: validation, deletion, optional remote config, or summaries.
4. Validate TypeScript with `npm run functions:build`.
5. Check security rules before enabling sync.

## Output

Report schema changes, functions/rules touched, emulator/build checks, and any manual Firebase console steps.
