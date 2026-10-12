import type { AppSession, ReminderEvent, UnlockEvent } from '@/models';
import { localRepository } from '@/storage';

const instagramId = 'com.instagram.android';

export async function simulateUnlockEvent() {
  const now = new Date().toISOString();
  const unlockEvents = await localRepository.getUnlockEvents();
  const event: UnlockEvent = {
    cooldownActive: false,
    id: `debug-unlock:${now}`,
    occurredAt: now,
    promptResult: 'not-shown',
    provenance: 'debug-simulated',
  };

  await localRepository.setUnlockEvents([...unlockEvents, event]);
}

export async function simulateIntentionalAppSession() {
  const now = Date.now();
  const startedAt = new Date(now - 7 * 60 * 1000).toISOString();
  const endedAt = new Date(now).toISOString();
  const sessions = await localRepository.getAppSessions();
  const session: AppSession = {
    appId: instagramId,
    endedAt,
    extensionCount: 0,
    foregroundDurationMs: 7 * 60 * 1000,
    id: `debug-session:intentional:${endedAt}`,
    intention: {
      category: 'specific-task',
      presetId: 'reply',
      provenance: 'debug-simulated',
    },
    plannedDuration: 10,
    provenance: 'debug-simulated',
    startedAt,
  };

  await localRepository.setAppSessions([...sessions, session]);
}

export async function simulateReminderAndReels() {
  const now = Date.now();
  const startedAt = new Date(now - 10 * 60 * 1000).toISOString();
  const endedAt = new Date(now).toISOString();
  const sessionId = `debug-session:scroll:${endedAt}`;
  const [sessions, reminders, reelEvents] = await Promise.all([
    localRepository.getAppSessions(),
    localRepository.getReminderEvents(),
    localRepository.getReelTrackingEvents(),
  ]);
  const session: AppSession = {
    appId: instagramId,
    endedAt,
    extensionCount: 1,
    foregroundDurationMs: 10 * 60 * 1000,
    id: sessionId,
    intention: {
      category: 'casual-scrolling',
      provenance: 'debug-simulated',
    },
    plannedDuration: 10,
    provenance: 'debug-simulated',
    startedAt,
  };
  const reminder: ReminderEvent = {
    appSessionId: sessionId,
    elapsedMs: 10 * 60 * 1000,
    id: `debug-reminder:${endedAt}`,
    plannedDuration: 10,
    response: 'extend-5-min',
    shownAt: endedAt,
  };

  await Promise.all([
    localRepository.setAppSessions([...sessions, session]),
    localRepository.setReminderEvents([...reminders, reminder]),
    localRepository.setReelTrackingEvents([
      ...reelEvents,
      {
        appSessionId: sessionId,
        confidence: 'medium',
        count: 24,
        detectorSupport: 'supported',
        id: `debug-reels:${endedAt}`,
        observedAt: endedAt,
        provenance: 'debug-simulated',
      },
    ]),
  ]);
}

export async function clearDebugSimulationData() {
  const [sessions, reminders, reelEvents, unlockEvents] = await Promise.all([
    localRepository.getAppSessions(),
    localRepository.getReminderEvents(),
    localRepository.getReelTrackingEvents(),
    localRepository.getUnlockEvents(),
  ]);

  await Promise.all([
    localRepository.setAppSessions(sessions.filter((event) => event.provenance !== 'debug-simulated')),
    localRepository.setReminderEvents(reminders.filter((event) => !event.id.startsWith('debug-'))),
    localRepository.setReelTrackingEvents(reelEvents.filter((event) => event.provenance !== 'debug-simulated')),
    localRepository.setUnlockEvents(unlockEvents.filter((event) => event.provenance !== 'debug-simulated')),
  ]);
}
