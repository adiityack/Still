This is **Still**, an Android-first Expo/React Native app for intentional phone use.

## Canonical References

- Product behavior: `STILL_PRODUCT.md`
- Numbered implementation backlog: `story.md`
- Build roadmap and progress: `docs/ROADMAP.md`
- Visual system and mockup map: `docs/DESIGN_SYSTEM.md`
- Code ownership and folder rules: `docs/CODEBASE_STRUCTURE.md`
- Reusable workflow agents: `agents/README.md`

Read only the reference needed for the current task. Do not copy large sections into chat.

## Expo / React Native Rules

Expo changes frequently. Before touching Expo, EAS, or React Native APIs:

1. Read the Expo major version from `package.json`.
2. Check the matching docs: `https://docs.expo.dev/versions/v<major>.0.0/`
3. For routing, use Expo Router docs.

Use `npx expo install <package>` for Expo-compatible packages. If native code is required, use an Expo development build; Expo Go is not enough for Android monitoring.

## Architecture Boundaries

- React Native owns UI, navigation, local app state, settings, prompt components, and dashboards.
- Kotlin owns Android unlock/app monitoring, lifecycle-sensitive background behavior, permissions, overlays, and native event capture.
- Local storage is authoritative for core offline functionality.
- Firebase is optional sync/backend support, never required for real-time prompts.
- Do not fabricate metrics or ship mock monitoring as production behavior.
- Respect Android permission, privacy, and platform restrictions.

## Design Rules

The `design/` folder is the visual source of truth for every user-facing screen and prompt. Before implementing or changing UI, open `docs/DESIGN_SYSTEM.md`, find the exact screen-to-image mapping, and inspect the matching image file from `design/`. Do not rely on memory, generic mobile patterns, or `design-md/` inspiration before checking the Still mockup.

Match the calm sage/cream mockups closely. Use central tokens and shared components for buttons, cards, typography, icons, lists, tabs, toggles, and prompt surfaces.

Avoid generic AI UI: no random gradients, novelty colors, mismatched fonts, decorative clutter, fake analytics, or one-off component styling.

## Commands

```bash
npm run typecheck
npm run functions:build
npx expo-doctor
```

Run focused checks after every implementation task. At minimum, run `npm run typecheck` under the repo Node version. Also run the task-relevant build/check, such as `npm run functions:build` for Firebase Functions changes. Run `npx expo-doctor` when Expo/tooling changes or when doing broader health checks; if it needs network or hangs, report that rather than pretending it passed. In every final report, list which checks passed, failed, or were skipped as not relevant.

## Working Style

For each task, inspect relevant files first, implement the smallest coherent slice from `story.md`, verify it, update `story.md` and `docs/ROADMAP.md` when a story or roadmap step is completed, and report concise results.

Never deploy Firebase, modify production infrastructure, or perform destructive git operations without explicit approval.
