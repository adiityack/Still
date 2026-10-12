# STILL — Product Definition and Behaviour Specification

**Tagline:** Use your phone. On purpose.  
**Platform:** Android-first  
**Proposed stack:** React Native + TypeScript, Kotlin native Android modules, local database, optional Firebase Authentication / Firestore / Cloud Functions  
**Status:** Product specification; proposed behaviour, not a claim that features are implemented.

## 1. Purpose

STILL helps people notice when they are using their phones automatically instead of intentionally. It introduces a short, respectful check-in after a phone unlock or before a selected distracting app opens, and a second check-in when planned scrolling time expires.

STILL is **not** a phone ban, parental-control system, medical addiction treatment, or another endless engagement app. The aim is to support conscious choice, not to shame users for entertainment or maximise time spent in STILL.

**Core promise:** *Unlock → Pause → Choose → Continue.*  
**For distracting apps:** *Open → State intention → Use → Reflect.*

## 2. Problems being addressed

- People unlock their phones reflexively and forget why.
- A specific task (replying to a message) turns into unplanned social-media browsing.
- Infinite short-video feeds offer no natural stopping point.
- Screen-time totals do not explain whether use was purposeful, leisure, or unplanned.
- Restrictive blockers can feel punitive and are frequently dismissed or disabled.

These are product hypotheses to validate with users, not diagnoses or proven effects of this particular application.

## 3. Design principles

1. **Agency:** Always allow Skip and intentional leisure.
2. **Small interruption:** One short question, minimal taps, no mandatory typing.
3. **No guilt:** Neutral language; never label the user “addicted” or calculate fake dopamine scores.
4. **No interruption loops:** Use cooldowns, session state, and suppression rules.
5. **Local first:** Essential interventions and private event history operate offline.
6. **Honest measurement:** Separate observed activity, user-reported intentions, and experimental estimates.
7. **Accessibility and trust:** Clear explanations and granular permission requests.
8. **Less is more:** Calm sage/cream UI matching the attached image references.

## 4. First-time journey — 5 onboarding screens

| Step | Screen | Purpose | User action |
|---|---|---|---|
| 1 | Welcome | Explain the philosophy and benefit | Get started |
| 2 | Choose apps | Choose apps for check-ins, e.g., Instagram / YouTube | Turn monitoring on/off per app |
| 3 | Set the rhythm | Configure unlock check-ins and scroll reminders | Select frequency, duration, experimental features |
| 4 | Permissions | Explain Android permissions one by one | Grant supported permissions or continue with reduced functionality |
| 5 | You're ready | Confirm configuration and privacy | Enter STILL or review settings |

Do not imply permissions were granted if denied. “Skip for now” should preserve the ability to complete setup later. Onboarding appears once unless reset.

## 5. Main application — 4 screens

### 5.1 Home

A calm overview of today, with four compact metrics:

- **Intentional sessions:** explicit specific-task or intentional-break selections.
- **Unplanned opens:** sessions where the user explicitly chooses an unplanned mode; do not count Skip as unplanned.
- **Selected-app screen time:** foreground duration from available Android usage data.
- **Estimated Reels/Shorts scrolled:** only if detection is supported and enabled; otherwise show “Unavailable” or omit.

Show one grounded insight, such as “You chose ‘just scrolling’ eight times today,” with yesterday’s comparison when data exists. Include a genuine empty state on the first day.

### 5.2 My Apps

List monitored apps with icon, name, monitoring toggle, and per-app configuration. Allow users to add installed supported apps. Per-app settings: ask on open, default duration, reminder interval, optional experimental Reel detection. Changes take effect in the actual Android monitor and persist after restart.

### 5.3 Insights

Simple daily/weekly trends: check-in choices, app openings, selected-app time, skipped prompts, session extensions, and user-reported intention drift. Explain what each metric means. Avoid clinical ratings or speculative “brain health” claims.

### 5.4 Settings

Configure unlock check-in frequency, app list, reminder timing, prompt cooldowns, notification preferences, permissions, tracking pause, privacy controls, optional cloud sync, and data deletion.

Bottom navigation: **Home | My Apps | Insights | Settings**.

## 6. Three popup experiences

### 6.1 Popup A — Phone unlock

**When:** The phone is unlocked and the feature is enabled, permission/capability requirements are met, and cooldown rules allow it.  
**Question:** **“What brought you here?”**

- **Something specific:** Optionally record a short intention; proceed.
- **Just taking a break:** Record intentional leisure; proceed.
- **Skip:** Proceed immediately and record “skipped/unknown,” not “unplanned.”

Recommended default: offer a check-in only after the phone has been away for about 15 minutes, rather than on every unlock. Configurable choices: every eligible unlock, 15-minute cooldown, custom. Never block emergency functions or secure system UI.

**Platform caveat:** Android does not allow ordinary apps to replace the lock screen, and background activity/overlay behaviour varies by OS version and manufacturer. Build an Android feasibility prototype before promising a guaranteed after-unlock popup.

### 6.2 Popup B — Selected app opening

**When:** A newly foregrounded monitored app is detected outside an active grace period.  
**Question:** **“What are you here for?”**

- **Do something specific:** Optional presets (reply, check, post, other) or custom text. Start a task-oriented session.
- **Just scrolling:** Ask **“How long feels enough?”** with **5 / 10 / 15 min / No limit**. Default 10 min. Start a planned leisure session.
- **Skip:** Open app with unknown intent; no follow-up setup question.

Opening Instagram immediately after unlock should normally show only **one** check-in, not two consecutive prompts. Never re-prompt repeatedly while the same app session remains active.

### 6.3 Popup C — Time-limit reflection

**When:** A monitored session reaches its chosen duration and Android permits the reminder mechanism.  
**Question for scrolling:** **“Still enjoying this?”**

Show actual elapsed time and planned duration. Show Reel estimate only when supported. Choices:

- **I'm done:** Record the decision and return to a safe destination if supported; do not claim to kill another app.
- **5 more min:** Extend that session and schedule the next reminder.

**Question for task-oriented sessions:** **“Did you do what you came for?”** Choices: **Yes / Not yet / I forgot.** Record these as *user-reported* outcomes. The intent-drift metric is based on responses, not surveillance of task completion.

## 7. End-to-end examples

### Example A — Planned use

1. User unlocks and selects “Something specific.”
2. They open Instagram; the app-opening check-in is suppressed if it would duplicate the just-completed check-in, or asks for an app-specific intention when appropriate.
3. They select “Reply to a friend.”
4. After the configured check-in interval, STILL asks whether they accomplished the task.
5. Their response is saved locally and reflected in Insights.

### Example B — Intentional scrolling

1. User opens YouTube.
2. STILL asks the reason; user chooses “Just scrolling.”
3. User selects 10 minutes.
4. After 10 observed minutes in the selected app, STILL displays a gentle reflection if allowed by Android.
5. User chooses “5 more min” or “I'm done.”
6. Dashboard records observed app duration, selected intent, and extension decisions.

### Example C — Skip

1. User opens a monitored app and taps Skip.
2. The app opens immediately.
3. STILL records “prompt skipped,” never falsely classifying the session as purposeless.

## 8. Tracking and metric definitions

| Metric | Source | Interpretation |
|---|---|---|
| Unlock events | Supported Android screen/unlock events | Observed or best-effort count; reliability may differ by device |
| Monitored app openings | Android usage / foreground events | Count of separate app sessions with deduplication |
| Monitored app duration | Android usage events | Foreground time, **not** proof of active scrolling |
| Intentional task or break | User popup choice | Explicitly declared intention |
| Unplanned use | Explicit user selection, if offered | Self-reported; not inferred from Skip |
| Skipped prompts | Popup choice | Intent unknown |
| Planned duration | User setting/choice | Intended duration |
| Extra time | User chooses extension | User-reported conscious continuation |
| Intention drift | “I forgot” / other follow-up response | Self-reported loss of original purpose |
| Reels/Shorts estimate | Experimental app-specific permitted signals | Approximation only; can be unsupported or inaccurate |

**Important product decision:** The popup design says “Just taking a break” and “Just scrolling,” which are not inherently unplanned. Accordingly, don't populate “Unplanned opens” merely from those selections. For a defensible unplanned metric, optionally distinguish **“Opened without a plan”** from intentional leisure in later testing, or label the Home metric **“Scrolling check-ins”** until that distinction is captured.

## 9. Android operation and constraints

React Native supplies the UI, navigation and settings. Kotlin handles the native Android observation and background state machine. Use supported usage-statistics APIs for app duration; Android overlays and/or appropriately disclosed services only when permitted. Background execution is restricted; test across Android versions and manufacturers. Monitor permissions and degrade gracefully if unavailable.

**Reel counts:** Android has no universal third-party API for exact Instagram Reels/YouTube Shorts views. Accessibility events (if used) are not equivalent to verified video views; Google Play has strict policies for AccessibilityService. Implement only following review of permitted use, informed consent and real-world accuracy tests. Do not inspect messages, credentials or unrelated UI content. Show “Unavailable” if unsupported, never fabricate counts.

**iOS:** Not part of the initial MVP; an equivalent system-wide experience is not assumed possible.

## 10. Architecture and data handling

**React Native / TypeScript:** onboarding, four tabs, popup components, settings, analytics presentation.  
**Kotlin:** unlock observation, monitored app foreground session detection, lifecycle-aware timers, Android permission state, permitted interruption mechanism, and possible experimental Reel detection.  
**Local database:** raw activity sessions, prompt responses, aggregated daily data, local settings.  
**Firebase:** optional anonymous account, opt-in settings or aggregate sync, secure user-scoped Firestore rules, limited Cloud Functions for server validation or deletion; **never** a requirement for real-time check-ins.

### Suggested records

- `TrackedApp`: package ID, enabled, prompt mode, reminder duration, detector support.
- `UnlockEvent`: timestamp, prompt result, cooldown state.
- `AppSession`: app, start/end, foreground duration, chosen intention, planned time, extension count.
- `ReminderEvent`: session, shown time, response.
- `DailySummary`: counts with explicit metric definitions and provenance.

Keep data on the device by default. Never sync free-text intentions, detailed accessibility information or raw interaction logs without a separate, clearly informed choice. Provide a delete-history action and disable-monitoring action.

## 11. Anti-annoyance and privacy safeguards

- Do not display two popups back-to-back at unlock + app launch.
- Apply a cooldown and only prompt once per uninterrupted monitored-app session.
- Allow immediate Skip and settings adjustments.
- Ignore STILL's own UI, system permission windows, dialer/emergency contexts, and relevant critical system components.
- Automatically handle permission revocation, reboots, process death and interrupted sessions without duplicate counts.
- Do not secretly collect other apps' contents, text inputs, messages or media.
- Show accurate permission status, with no promises of functionality when access is denied.

## 12. Visual contract

Use the **attached 12 reference designs** as the visual target. Maintain warm cream backgrounds, dark forest/sage green text and buttons, elegant serif headings, readable sans-serif body text, large rounded cards, subtle botanical illustrations, generous spacing, and a consistently light, quiet interface. The main app must remain visually simpler than a typical analytics app. Do not create new major screens unless essential for a real settings workflow.

## 13. MVP boundaries

### Must work in initial Android MVP

- Five-step onboarding and persistent configuration.
- Four navigable main screens.
- Three usable popup **UI flows** and proper state handling.
- Per-app selection and reminder duration settings.
- Real local app-usage tracking where Android permissions allow it.
- Local session history and accurate dashboard metrics.
- Offline behaviour, permission diagnostics and clear empty states.

### Depends on Android feasibility testing

- Prompt appearing immediately on *every* unlock.
- Prompt appearing reliably over every selected app on every Android model.
- Accurate in-app Reels/Shorts scroll counting.
- Automatically leaving a third-party app after tapping “I'm done.”

### Not in MVP

- Social leaderboards, community features, AI coaching, clinical “brain rot” tests, subscriptions, parental surveillance, or full iOS parity.

## 14. Success criteria

Measure outcomes without inventing clinical claims:

- Percentage of shown check-ins answered vs skipped.
- Number of user decisions to leave rather than continue at a reminder.
- Share of sessions with a stated intention.
- Trends in personally selected app usage over time.
- Number of duplicate or annoying prompts (should be very low).
- Permission opt-in rates and monitoring reliability across devices.
- User-reported sense of control and satisfaction from interviews/opt-in surveys.

A change of mind at a popup is a useful product signal, but not proof of an addiction treatment or lasting behaviour change.

## 15. Recommended build sequence

1. Pixel-close interface from the attached mockups; offline navigation, forms and settings.
2. Kotlin app-session monitoring proof of concept, tested on a real Android phone.
3. App-opening popup and grace-period state machine.
4. Local daily summaries and Home/Insights with real data.
5. Unlock detection and possible intervention strategy.
6. Reminder and extension flows.
7. Optional Firebase and privacy controls.
8. Experimental platform-specific Reel detector **only if** technically and policy feasible.

## 16. Product acceptance checklist

- [ ] Onboarding ends at the real Home dashboard and doesn't repeat unnecessarily.
- [ ] Every toggle persists and changes behaviour rather than only appearance.
- [ ] All three popup designs respond correctly to every choice.
- [ ] Skip never creates an “unplanned” or “addicted” judgment.
- [ ] Unlock and app-launch prompts do not stack.
- [ ] Reminder times reflect observed session duration and explicit choices.
- [ ] Dashboard shows no fabricated counts or insights.
- [ ] Unsupported Reel detection is labelled accordingly.
- [ ] Tracking works without internet when required Android permissions are present.
- [ ] The app respects denied/revoked permissions.
- [ ] No emergency or critical system UI is obstructed.
- [ ] Users can disable tracking and delete local history.
- [ ] Firebase sync, when implemented, is opt-in and access-controlled.
- [ ] Physical-device tests document differences across Android versions.

---

**One-sentence product summary:** STILL is an Android-first, privacy-conscious app that inserts brief, optional moments of reflection at phone unlock, social-app opening and scrolling-duration milestones, then shows users what their choices and usage patterns look like—without shame or fabricated metrics.
