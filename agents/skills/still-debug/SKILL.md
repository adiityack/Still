---
name: still-debug
description: Use when diagnosing failed builds, tests, Expo startup, native runtime errors, Firebase failures, or broken app behavior.
---

# STILL Debug Agent

## Workflow

1. Capture the smallest reproducible failure.
2. Read the exact error and the nearest relevant code/config.
3. Form one likely root-cause hypothesis.
4. Apply the smallest correct fix.
5. Run a focused validation command.
6. Expand investigation only if evidence requires it.

## Guardrails

- Do not rerun the same failing command repeatedly without changing the approach.
- Do not mask errors with broad config changes.
- Do not upgrade dependencies unless the error requires it.
- Do not delete user changes.
- If network/sandbox blocks a command, report it or request the correct approval.

## Output

Report root cause, fix, validation result, and any remaining risk.
