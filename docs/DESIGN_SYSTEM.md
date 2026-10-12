# STILL Design System

## Visual Source Of Truth

Use the 12 mockups in `design/` as the primary visual target. Every UI task must start by finding the relevant row below and inspecting that exact image. If a task changes shared UI used by multiple screens, inspect each affected screen image before editing.

## Screen To Mockup Map

| Product area | Screen or state | Required design reference |
| --- | --- | --- |
| Onboarding | Welcome | `design/ChatGPT Image Oct 10, 2026 at 04_04_20 PM-1.png` |
| Onboarding | App selection | `design/ChatGPT Image Oct 10, 2026 at 04_04_24 PM-5.png` |
| Onboarding | Rhythm/settings | `design/ChatGPT Image Oct 10, 2026 at 04_04_21 PM-3.png` |
| Onboarding | Permissions | `design/ChatGPT Image Oct 10, 2026 at 04_04_23 PM-4.png` |
| Onboarding | Finish | `design/ChatGPT Image Oct 10, 2026 at 04_04_21 PM-2.png` |
| Main app | Home | `design/ChatGPT Image Oct 10, 2026 at 04_04_06 PM-1.png` |
| Main app | My Apps | `design/ChatGPT Image Oct 10, 2026 at 04_04_08 PM-4.png` |
| Main app | Insights | `design/ChatGPT Image Oct 10, 2026 at 04_04_07 PM-3.png` |
| Main app | Settings | `design/ChatGPT Image Oct 10, 2026 at 04_04_07 PM-2.png` |
| Prompt | Unlock prompt | `design/ChatGPT Image Oct 10, 2026 at 04_03_56 PM-1.png` |
| Prompt | App-opening prompt | `design/ChatGPT Image Oct 10, 2026 at 04_03_57 PM-2.png` |
| Prompt | Scrolling reminder prompt | `design/ChatGPT Image Oct 10, 2026 at 04_03_58 PM-3.png` |

## Mockup Usage Rules

- Treat `design/` as canonical for layout, visual hierarchy, spacing, tone, and screen composition.
- Use `design-md/` only for broad quality calibration after the Still mockup has been inspected.
- Do not mark a UI roadmap item complete unless the implementation has been compared against its mapped mockup.
- Do not invent alternate screen designs unless the mapped mockup is missing or conflicts with product behavior.

## Premium Reference Style

Use STILL's own mockups first. For quality calibration only, prefer:

- `design-md/apple/DESIGN.md`: restraint, spacing, polished system typography.
- `design-md/superhuman/DESIGN.md`: editorial calm and premium quietness.
- `design-md/linear.app/DESIGN.md`: disciplined component consistency.

Do not import those brands' colors or visual identity into STILL.

## Tokens

Target tokens:

```ts
colors = {
  background: '#FAFAF6',
  surface: '#F1F4EC',
  surfaceStrong: '#E3E9DC',
  primary: '#38594B',
  primaryDark: '#102820',
  text: '#102820',
  textMuted: '#737B7A',
  border: '#E1E5DC',
  white: '#FFFFFF',
};

radii = {
  sm: 12,
  md: 18,
  lg: 24,
  xl: 30,
  pill: 999,
};

spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32,
  screen: 28,
};
```

Typography:

- Brand wordmark: spaced uppercase sans.
- Display headings: `Cormorant Garamond` via `@expo-google-fonts/cormorant-garamond` for an elegant, soft serif voice.
- Body/UI: `Inter` via `@expo-google-fonts/inter` for calm readable controls and dense app surfaces.
- Legal basis: both families are Google Fonts distributed under the SIL Open Font License.
- Loading plan: install with `npx expo install expo-font @expo-google-fonts/cormorant-garamond @expo-google-fonts/inter`, then centralize `fontFamily` names in `src/config/theme.ts`. Prefer Expo's `expo-font` config plugin/native embedding for Android and iOS dev builds; use runtime loading only if needed for Expo preview/web.
- Fallbacks: display text falls back to `serif`; body/UI falls back to the platform sans/system font.
- Do not use random system defaults per component.

## Components To Standardize

- `ScreenShell`
- `BrandHeader`
- `AppButton`
- `TextButton`
- `IconButton`
- `Card`
- `MetricCard`
- `SettingsRow`
- `AppRow`
- `Toggle`
- `SegmentedControl`
- `BottomTabs`
- `OnboardingPager`
- `PromptSheet`
- Botanical/leaf decorations are disabled for now after device review feedback.

## Rules

- Components must use central tokens.
- No one-off hex colors inside screens unless added to the theme first.
- Minimum touch target: 44x44.
- Text must fit on narrow Android phones and with larger font settings.
- Charts should be simple and calm, never fake or overly complex.
- Do not add leaf or botanical decorations to screens for now. Keep layouts clean, compact, and app-like; revisit decorative assets only after explicit approval.
