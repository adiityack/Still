import { requireOptionalNativeModule } from 'expo';
import { Platform } from 'react-native';

import type { AppSession, TrackedApp } from '@/models';
import { localRepository } from '@/storage';

type NativeUsageEvent = {
  packageName: string;
  timestampMs: number;
  type: 'background' | 'foreground';
};

type StillPermissionsNativeModule = {
  getRecentForegroundEvents(packageNames: string[], sinceMs: number): Promise<NativeUsageEvent[]>;
};

const nativeModule = requireOptionalNativeModule<StillPermissionsNativeModule>('StillPermissions');
const DEFAULT_LOOKBACK_MS = 15 * 60 * 1000;
const ACTIVITY_SWITCH_GRACE_MS = 2_000;

export async function syncRecentAndroidAppSessions(nowMs = Date.now()): Promise<number> {
  if (Platform.OS !== 'android' || !nativeModule) {
    return 0;
  }

  const [preferences, trackedApps, existingSessions] = await Promise.all([
    localRepository.getPreferences(),
    localRepository.getTrackedApps(),
    localRepository.getAppSessions(),
  ]);

  if (!preferences?.trackingEnabled) {
    return 0;
  }

  const enabledApps = trackedApps.filter((app) => app.enabled);
  if (enabledApps.length === 0) {
    return 0;
  }

  const sinceMs = getQueryStartMs(existingSessions, nowMs);
  const nativeEvents = await nativeModule.getRecentForegroundEvents(
    enabledApps.map((app) => app.id),
    sinceMs,
  );
  const observedSessions = buildSessions(nativeEvents, enabledApps);
  const mergedSessions = mergeSessions(existingSessions, observedSessions);

  if (observedSessions.length > 0) {
    await localRepository.setAppSessions(mergedSessions);
  }

  return observedSessions.length;
}

function buildSessions(events: NativeUsageEvent[], apps: TrackedApp[]): AppSession[] {
  const appsById = new Map(apps.map((app) => [app.id, app]));
  const sessions: AppSession[] = [];
  let active: AppSession | null = null;
  let pendingEndMs: number | null = null;

  for (const event of [...events].sort((a, b) => a.timestampMs - b.timestampMs)) {
    const app = appsById.get(event.packageName);
    if (!app) {
      continue;
    }

    if (event.type === 'foreground') {
      if (active !== null && active.appId === event.packageName && pendingEndMs !== null) {
        if (event.timestampMs - pendingEndMs <= ACTIVITY_SWITCH_GRACE_MS) {
          pendingEndMs = null;
          continue;
        }

        sessions.push(closeSession(active, pendingEndMs));
        active = null;
      }

      if (active === null || active.appId !== event.packageName) {
        if (active) {
          sessions.push(closeSession(active, pendingEndMs ?? event.timestampMs));
        }
        active = createObservedSession(app, event.timestampMs);
      }

      pendingEndMs = null;
      continue;
    }

    if (active !== null && active.appId === event.packageName) {
      pendingEndMs = event.timestampMs;
    }
  }

  if (active) {
    sessions.push(pendingEndMs === null ? active : closeSession(active, pendingEndMs));
  }

  return sessions;
}

function createObservedSession(app: TrackedApp, timestampMs: number): AppSession {
  const startedAt = new Date(timestampMs).toISOString();
  return {
    appId: app.id,
    extensionCount: 0,
    id: `session:${app.id}:${startedAt}`,
    plannedDuration: app.defaultReminderDuration,
    provenance: 'android-usage-events',
    startedAt,
  };
}

function closeSession(session: AppSession, endedAtMs: number): AppSession {
  const startedAtMs = new Date(session.startedAt).getTime();
  return {
    ...session,
    endedAt: new Date(endedAtMs).toISOString(),
    foregroundDurationMs: Math.max(0, endedAtMs - startedAtMs),
  };
}

function getQueryStartMs(sessions: AppSession[], nowMs: number) {
  const latestStartMs = sessions
    .filter((session) => session.provenance === 'android-usage-events')
    .reduce((latest, session) => Math.max(latest, new Date(session.startedAt).getTime()), 0);
  return latestStartMs || nowMs - DEFAULT_LOOKBACK_MS;
}

function mergeSessions(existing: AppSession[], observed: AppSession[]) {
  const byId = new Map(existing.map((session) => [session.id, session]));
  for (const session of observed) {
    byId.set(session.id, { ...byId.get(session.id), ...session });
  }
  return [...byId.values()].sort((a, b) => a.startedAt.localeCompare(b.startedAt));
}
