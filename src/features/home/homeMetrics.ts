import type { AppSession, ReelTrackingEvent } from '@/models';
import { localRepository } from '@/storage';

export type HomeMetric = {
  meta: string;
  value: string;
};

export type HomeMetrics = {
  insightBody: string;
  insightTitle: string;
  intentionalSessions: HomeMetric;
  reelsEstimate: HomeMetric;
  screenTime: HomeMetric;
  unplannedOpens: HomeMetric;
};

type HomeMetricsInput = {
  now?: Date;
  reelEvents: ReelTrackingEvent[];
  sessions: AppSession[];
};

const emptyHomeMetrics: HomeMetrics = {
  insightBody: 'STILL will use local activity after setup and permissions.',
  insightTitle: 'Your first real insight will appear here.',
  intentionalSessions: {
    meta: 'No sessions yet',
    value: '-',
  },
  reelsEstimate: {
    meta: 'Detector not enabled',
    value: '-',
  },
  screenTime: {
    meta: 'Awaiting app data',
    value: '-',
  },
  unplannedOpens: {
    meta: 'Needs explicit choice',
    value: '-',
  },
};

export async function getLocalHomeMetrics(now = new Date()) {
  const [sessions, reelEvents] = await Promise.all([
    localRepository.getAppSessions(),
    localRepository.getReelTrackingEvents(),
  ]);

  return selectHomeMetrics({ now, reelEvents, sessions });
}

export function selectHomeMetrics({ now = new Date(), reelEvents, sessions }: HomeMetricsInput): HomeMetrics {
  const todaysSessions = sessions.filter((session) => isSameLocalDay(session.startedAt, now));
  const todaysReelEvents = reelEvents.filter((event) => isSameLocalDay(event.observedAt, now));

  if (todaysSessions.length === 0 && todaysReelEvents.length === 0) {
    return emptyHomeMetrics;
  }

  const intentionalCount = todaysSessions.filter((session) =>
    session.intention?.category === 'specific-task' || session.intention?.category === 'intentional-break',
  ).length;
  const screenTimeMs = todaysSessions.reduce((total, session) => total + getSessionDurationMs(session), 0);
  const supportedReels = todaysReelEvents.filter((event) => event.detectorSupport === 'supported');
  const reelCount = supportedReels.reduce((total, event) => total + (event.count ?? 0), 0);
  const unplannedCount = todaysSessions.filter((session) => session.intention?.category === 'unknown').length;

  return {
    insightBody: buildInsightBody(intentionalCount, todaysSessions.length, screenTimeMs),
    insightTitle: buildInsightTitle(intentionalCount, todaysSessions.length),
    intentionalSessions: {
      meta: 'From local sessions',
      value: formatCount(intentionalCount),
    },
    reelsEstimate: {
      meta: supportedReels.length > 0 ? 'Experimental local estimate' : 'Detector not enabled',
      value: supportedReels.length > 0 ? formatCount(reelCount) : '-',
    },
    screenTime: {
      meta: screenTimeMs > 0 ? 'Selected apps today' : 'Awaiting duration data',
      value: screenTimeMs > 0 ? formatDuration(screenTimeMs) : '-',
    },
    unplannedOpens: {
      meta: unplannedCount > 0 ? 'Explicit unknown intent' : 'Needs explicit choice',
      value: unplannedCount > 0 ? formatCount(unplannedCount) : '-',
    },
  };
}

function buildInsightTitle(intentionalCount: number, sessionCount: number) {
  if (intentionalCount > 0) {
    return `You logged ${formatCount(intentionalCount)} intentional session${intentionalCount === 1 ? '' : 's'} today.`;
  }

  if (sessionCount > 0) {
    return 'Local activity is starting to build a picture.';
  }

  return emptyHomeMetrics.insightTitle;
}

function buildInsightBody(intentionalCount: number, sessionCount: number, screenTimeMs: number) {
  if (intentionalCount > 0 && screenTimeMs > 0) {
    return `${formatDuration(screenTimeMs)} recorded on selected apps so far.`;
  }

  if (sessionCount > 0) {
    return 'STILL has local session data, but not enough detail for a stronger insight yet.';
  }

  return emptyHomeMetrics.insightBody;
}

function formatCount(value: number) {
  return new Intl.NumberFormat('en-US').format(value);
}

function formatDuration(durationMs: number) {
  const minutes = Math.max(1, Math.round(durationMs / 60000));

  if (minutes < 60) {
    return `${minutes} min`;
  }

  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;

  return remainingMinutes === 0 ? `${hours} hr` : `${hours} hr ${remainingMinutes} min`;
}

function getSessionDurationMs(session: AppSession) {
  if (typeof session.foregroundDurationMs === 'number') {
    return session.foregroundDurationMs;
  }

  if (!session.endedAt) {
    return 0;
  }

  return Math.max(0, new Date(session.endedAt).getTime() - new Date(session.startedAt).getTime());
}

function isSameLocalDay(value: string, day: Date) {
  const date = new Date(value);

  return (
    date.getFullYear() === day.getFullYear() &&
    date.getMonth() === day.getMonth() &&
    date.getDate() === day.getDate()
  );
}
