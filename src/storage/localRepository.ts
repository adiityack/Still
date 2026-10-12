import type {
  AppSession,
  DailySummary,
  ISODateString,
  PromptEvent,
  ReelTrackingEvent,
  ReminderEvent,
  TrackedApp,
  UnlockEvent,
  UserPreferences,
} from '@/models';

import { asyncStorageAdapter, type JsonStorageAdapter } from './asyncStorageAdapter';

const keys = {
  appSessions: 'still:v1:appSessions',
  dailySummaries: 'still:v1:dailySummaries',
  onboardingCompleted: 'still:onboardingCompleted',
  preferences: 'still:v1:preferences',
  promptEvents: 'still:v1:promptEvents',
  reelEvents: 'still:v1:reelEvents',
  reminderEvents: 'still:v1:reminderEvents',
  trackedApps: 'still:v1:trackedApps',
  unlockEvents: 'still:v1:unlockEvents',
} as const;

export type LocalRepository = ReturnType<typeof createLocalRepository>;

export function createLocalRepository(storage: JsonStorageAdapter = asyncStorageAdapter) {
  return {
    clearAll() {
      return Promise.all(Object.values(keys).map((key) => storage.remove(key))).then(() => undefined);
    },
    getAppSessions() {
      return storage.getJson<AppSession[]>(keys.appSessions, []);
    },
    getDailySummaries() {
      return storage.getJson<Record<ISODateString, DailySummary>>(keys.dailySummaries, {});
    },
    getOnboardingCompleted() {
      return storage.getBoolean(keys.onboardingCompleted).then((value) => value ?? false);
    },
    getPreferences() {
      return storage.getJson<UserPreferences | null>(keys.preferences, null);
    },
    getPromptEvents() {
      return storage.getJson<PromptEvent[]>(keys.promptEvents, []);
    },
    getReelTrackingEvents() {
      return storage.getJson<ReelTrackingEvent[]>(keys.reelEvents, []);
    },
    getReminderEvents() {
      return storage.getJson<ReminderEvent[]>(keys.reminderEvents, []);
    },
    getTrackedApps() {
      return storage.getJson<TrackedApp[]>(keys.trackedApps, []);
    },
    getUnlockEvents() {
      return storage.getJson<UnlockEvent[]>(keys.unlockEvents, []);
    },
    setAppSessions(sessions: AppSession[]) {
      return storage.setJson(keys.appSessions, sessions);
    },
    setDailySummaries(summaries: Record<ISODateString, DailySummary>) {
      return storage.setJson(keys.dailySummaries, summaries);
    },
    setOnboardingCompleted(completed: boolean) {
      if (!completed) {
        return storage.remove(keys.onboardingCompleted);
      }

      return storage.setBoolean(keys.onboardingCompleted, true);
    },
    setPreferences(preferences: UserPreferences | null) {
      if (!preferences) {
        return storage.remove(keys.preferences);
      }

      return storage.setJson(keys.preferences, preferences);
    },
    setPromptEvents(events: PromptEvent[]) {
      return storage.setJson(keys.promptEvents, events);
    },
    setReelTrackingEvents(events: ReelTrackingEvent[]) {
      return storage.setJson(keys.reelEvents, events);
    },
    setReminderEvents(events: ReminderEvent[]) {
      return storage.setJson(keys.reminderEvents, events);
    },
    setTrackedApps(apps: TrackedApp[]) {
      return storage.setJson(keys.trackedApps, apps);
    },
    setUnlockEvents(events: UnlockEvent[]) {
      return storage.setJson(keys.unlockEvents, events);
    },
  };
}

export const localRepository = createLocalRepository();
