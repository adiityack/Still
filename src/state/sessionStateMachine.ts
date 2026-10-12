import type { AppSession, ISODateTimeString, Milliseconds, PackageName, ReminderDurationMinutes } from '@/models';

export type SessionState = {
  activeSession: AppSession | null;
  suspendedAt: ISODateTimeString | null;
};

export type SessionEvent =
  | {
      appId: PackageName;
      at: ISODateTimeString;
      defaultReminderDuration: ReminderDurationMinutes;
      type: 'monitored-app-foreground';
    }
  | {
      appId: PackageName;
      at: ISODateTimeString;
      type: 'monitored-app-background';
    }
  | {
      at: ISODateTimeString;
      type: 'phone-locked' | 'observed-session-ended';
    };

export const emptySessionState: SessionState = {
  activeSession: null,
  suspendedAt: null,
};

export function applySessionEvent(
  state: SessionState,
  event: SessionEvent,
  gracePeriodMs: Milliseconds,
): SessionState {
  switch (event.type) {
    case 'monitored-app-foreground':
      return handleForeground(state, event, gracePeriodMs);
    case 'monitored-app-background':
      return handleBackground(state, event);
    case 'observed-session-ended':
    case 'phone-locked':
      return endActiveSession(state, event.at);
  }
}

function handleForeground(
  state: SessionState,
  event: Extract<SessionEvent, { type: 'monitored-app-foreground' }>,
  gracePeriodMs: Milliseconds,
): SessionState {
  if (state.activeSession?.appId === event.appId) {
    const shouldResume = !state.suspendedAt || msBetween(state.suspendedAt, event.at) <= gracePeriodMs;

    if (shouldResume) {
      return { activeSession: state.activeSession, suspendedAt: null };
    }

    return {
      activeSession: createSession(event),
      suspendedAt: null,
    };
  }

  if (state.activeSession) {
    return {
      activeSession: createSession(event),
      suspendedAt: null,
    };
  }

  return {
    activeSession: createSession(event),
    suspendedAt: null,
  };
}

function handleBackground(state: SessionState, event: Extract<SessionEvent, { type: 'monitored-app-background' }>) {
  if (state.activeSession?.appId !== event.appId) {
    return state;
  }

  return {
    ...state,
    suspendedAt: event.at,
  };
}

function endActiveSession(state: SessionState, endedAt: ISODateTimeString): SessionState {
  if (!state.activeSession) {
    return state;
  }

  return {
    activeSession: {
      ...state.activeSession,
      endedAt,
      foregroundDurationMs: Math.max(0, msBetween(state.activeSession.startedAt, endedAt)),
    },
    suspendedAt: null,
  };
}

function createSession(event: Extract<SessionEvent, { type: 'monitored-app-foreground' }>): AppSession {
  return {
    appId: event.appId,
    extensionCount: 0,
    id: `session:${event.appId}:${event.at}`,
    plannedDuration: event.defaultReminderDuration,
    provenance: 'android-usage-events',
    startedAt: event.at,
  };
}

function msBetween(start: ISODateTimeString, end: ISODateTimeString) {
  return new Date(end).getTime() - new Date(start).getTime();
}
