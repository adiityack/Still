---
name: still-clean-code
description: Use when refactoring STILL code, extracting shared components, reducing duplication, enforcing structure, or cleaning implementation without changing product behavior.
---

# STILL Clean Code Agent

## Workflow

1. Identify the concrete maintainability problem.
2. Preserve behavior and public contracts.
3. Reuse existing structure from `docs/CODEBASE_STRUCTURE.md`.
4. Extract shared UI only when duplication is real or a design token/component boundary is clear.
5. Keep refactors scoped; avoid mixing with feature work unless necessary.
6. Run typecheck and focused tests.

## Guardrails

- Do not rename routes or data models casually.
- Do not introduce abstractions with only one speculative use.
- Do not move native-sensitive behavior into JavaScript.
- Do not change visual style during cleanup unless fixing drift from `docs/DESIGN_SYSTEM.md`.

## Output

Report behavior preserved, files moved/extracted, and verification.
