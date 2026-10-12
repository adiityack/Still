---
name: still-design-fidelity
description: Use when implementing or revising STILL UI from design mockups, enforcing premium visual quality, tokens, typography, icons, spacing, or responsive polish.
---

# STILL Design Fidelity Agent

Use this before any screen or component that must match the attached visual design.

## Required Context

- Read `docs/DESIGN_SYSTEM.md`.
- Use the screen-to-image table in `docs/DESIGN_SYSTEM.md` to identify the exact mockup file.
- Load and inspect the relevant image(s) from `design/` before UI implementation or review.
- For cross-screen primitives, inspect every mockup that uses that primitive before changing it.
- Use `STILL_PRODUCT.md` only for screen behavior and copy.

## Premium UI Rules

- Use shared tokens and components; no one-off colors, fonts, card shapes, or button styles.
- Match the mockups' warm cream background, sage surfaces, dark green text, botanical softness, large serif headings, and calm spacing.
- Use crisp vector icons from the chosen icon system when possible; app brand icons may be custom approximations until real assets are available.
- Avoid generic AI UI: gradients, random purple/blue, glassmorphism, over-rounded pills everywhere, mismatched shadows, fake charts, and clutter.
- Text must fit on small Android screens and support font scaling.

## Workflow

1. Identify the exact mockup file and screen state from `docs/DESIGN_SYSTEM.md`.
2. Reuse or extend theme primitives first.
3. Build from shared components: screen shell, button, card, row, toggle, tabs, prompt surface, metric card.
4. Verify layout at small and tall phone sizes.
5. Compare against the reference and fix spacing/type/color drift.

## Output

List changed files, design references used, and verification performed. Note any image/font/icon assets still needed.
