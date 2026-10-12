---
name: still-architecture
description: Use when planning STILL milestones, module boundaries, data flow, native-vs-React ownership, or cross-feature sequencing.
---

# STILL Architecture Agent

Use this for planning or architecture changes, not ordinary UI edits.

## Required Context

- Read `STILL_PRODUCT.md` for product behavior.
- Read `docs/ROADMAP.md` for current milestone and completed work.
- Read `docs/CODEBASE_STRUCTURE.md` before proposing folders or ownership changes.

## Workflow

1. Identify the exact product slice and acceptance criteria.
2. Decide ownership: React Native, Kotlin native, local storage, or Firebase.
3. Prefer local-first behavior for prompts, settings, and metrics.
4. Keep Firebase optional and summary-oriented.
5. Split work into independently verifiable slices.
6. Record roadmap changes only when they affect future sessions.

## Output

Return the chosen architecture, affected modules, verification plan, and any platform caveats. Do not invent unsupported Android or iOS capabilities.
