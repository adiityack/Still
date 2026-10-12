import type { ISODateTimeString, Milliseconds, PackageName, PromptEvent, PromptSurface } from '@/models';

export type PromptRequest = {
  appId?: PackageName;
  appSessionId?: string;
  at: ISODateTimeString;
  surface: PromptSurface;
};

export type PromptState = {
  activePrompt: PromptEvent | null;
  lastPromptAt: ISODateTimeString | null;
};

export type PromptDecision =
  | {
      prompt: PromptEvent;
      reason: 'show';
      state: PromptState;
      type: 'show';
    }
  | {
      reason: 'active-prompt' | 'cooldown' | 'ignored-app' | 'no-request';
      state: PromptState;
      type: 'suppress';
    };

const ignoredPackageIds = new Set([
  'android',
  'com.android.settings',
  'com.android.systemui',
  'com.android.dialer',
  'com.google.android.dialer',
  'com.still',
]);

const promptPriority: Record<PromptSurface, number> = {
  'app-opening': 0,
  unlock: 1,
  'session-reminder': 2,
  'task-follow-up': 3,
};

export const emptyPromptState: PromptState = {
  activePrompt: null,
  lastPromptAt: null,
};

export function requestPrompt(
  state: PromptState,
  requests: PromptRequest[],
  cooldownMs: Milliseconds,
): PromptDecision {
  if (state.activePrompt) {
    return { reason: 'active-prompt', state, type: 'suppress' };
  }

  const request = choosePromptRequest(requests);

  if (!request) {
    return { reason: 'no-request', state, type: 'suppress' };
  }

  if (request.appId && ignoredPackageIds.has(request.appId)) {
    return { reason: 'ignored-app', state, type: 'suppress' };
  }

  if (state.lastPromptAt && msBetween(state.lastPromptAt, request.at) < cooldownMs) {
    return { reason: 'cooldown', state, type: 'suppress' };
  }

  const prompt = createPromptEvent(request);
  const nextState = {
    activePrompt: prompt,
    lastPromptAt: request.at,
  };

  return {
    prompt,
    reason: 'show',
    state: nextState,
    type: 'show',
  };
}

export function resolveActivePrompt(state: PromptState): PromptState {
  return {
    ...state,
    activePrompt: null,
  };
}

function choosePromptRequest(requests: PromptRequest[]) {
  return [...requests].sort((left, right) => promptPriority[left.surface] - promptPriority[right.surface])[0] ?? null;
}

function createPromptEvent(request: PromptRequest): PromptEvent {
  return {
    appSessionId: request.appSessionId,
    id: `prompt:${request.surface}:${request.at}`,
    result: 'not-shown',
    shownAt: request.at,
    surface: request.surface,
  };
}

function msBetween(start: ISODateTimeString, end: ISODateTimeString) {
  return new Date(end).getTime() - new Date(start).getTime();
}
