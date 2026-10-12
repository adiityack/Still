import type { AppSession, PromptEvent, ReelTrackingEvent, ReminderEvent } from '@/models';
import { localRepository } from '@/storage';

export type WeeklyTrendMetric = {
  chart: 'line' | 'bars';
  dayValues: Array<number | null>;
  icon: string;
  label: string;
  meta: string;
  status: 'available' | 'empty' | 'unavailable';
  value: string;
};

export type WeeklyInsights = {
  hasAnyLocalActivity: boolean;
  insightBody: string;
  insightCalendarLabel: string;
  insightCalendarValue: string;
  insightTitle: string;
  metrics: WeeklyTrendMetric[];
};

type WeeklyInsightsInput = {
  now?: Date;
  promptEvents: PromptEvent[];
  reelEvents: ReelTrackingEvent[];
  reminderEvents: ReminderEvent[];
  sessions: AppSession[];
};

const dayLabels = ['M', 'T', 'W', 'T', 'F', 'S', 'S'] as const;
const emptyValues: Array<number | null> = [null, null, null, null, null, null, null];
const zeroValues: number[] = [0, 0, 0, 0, 0, 0, 0];

export async function getLocalWeeklyInsights(now = new Date()) {
  const [sessions, promptEvents, reminderEvents, reelEvents] = await Promise.all([
    localRepository.getAppSessions(),
    localRepository.getPromptEvents(),
    localRepository.getReminderEvents(),
    localRepository.getReelTrackingEvents(),
  ]);

  return selectWeeklyInsights({ now, promptEvents, reelEvents, reminderEvents, sessions });
}

export function selectWeeklyInsights({
  now = new Date(),
  promptEvents,
  reelEvents,
  reminderEvents,
  sessions,
}: WeeklyInsightsInput): WeeklyInsights {
  const days = getWeekDays(now);
  const weeklySessions = sessions.filter((session) => isInWeek(session.startedAt, days));
  const weeklyPromptEvents = promptEvents.filter((event) => isInWeek(event.shownAt, days));
  const weeklyReminderEvents = reminderEvents.filter((event) => isInWeek(event.shownAt, days));
  const weeklyReelEvents = reelEvents.filter((event) => isInWeek(event.observedAt, days));
  const hasAnyLocalActivity =
    weeklySessions.length > 0 ||
    weeklyPromptEvents.length > 0 ||
    weeklyReminderEvents.length > 0 ||
    weeklyReelEvents.length > 0;

  const intentional = days.map((day) =>
    weeklySessions.filter(
      (session) =>
        isSameLocalDay(session.startedAt, day) &&
        (session.intention?.category === 'specific-task' || session.intention?.category === 'intentional-break'),
    ).length,
  );
  const scrolling = days.map((day) =>
    weeklySessions.filter(
      (session) =>
        isSameLocalDay(session.startedAt, day) &&
        (session.intention?.category === 'casual-scrolling' || session.intention?.category === 'planned-scrolling'),
    ).length,
  );
  const screenTime = days.map((day) =>
    weeklySessions
      .filter((session) => isSameLocalDay(session.startedAt, day))
      .reduce((total, session) => total + getSessionDurationMs(session), 0),
  );
  const skippedPrompts = days.map((day) =>
    weeklyPromptEvents.filter((event) => isSameLocalDay(event.shownAt, day) && event.result === 'skipped').length,
  );
  const extensions = days.map((day) =>
    weeklyReminderEvents.filter((event) => isSameLocalDay(event.shownAt, day) && event.response === 'extend-5-min').length,
  );
  const drift = days.map((day) =>
    weeklySessions.filter((session) => isSameLocalDay(session.startedAt, day) && session.taskOutcome === 'forgot').length,
  );
  const supportedReelEvents = weeklyReelEvents.filter((event) => event.detectorSupport === 'supported');
  const reels = supportedReelEvents.length > 0
    ? days.map((day) =>
        supportedReelEvents
          .filter((event) => isSameLocalDay(event.observedAt, day))
          .reduce((total, event) => total + (event.count ?? 0), 0),
      )
    : emptyValues;

  const strongestDay = getStrongestDay(intentional);

  return {
    hasAnyLocalActivity,
    insightBody:
      strongestDay.value > 0
        ? `You had ${strongestDay.value} intentional session${strongestDay.value === 1 ? '' : 's'} that day.`
        : hasAnyLocalActivity
          ? 'STILL has local activity, but not enough intentional sessions for a weekly pattern yet.'
          : 'STILL needs a few days of local activity before it can show a real trend.',
    insightCalendarLabel: strongestDay.value > 0 ? dayLabels[strongestDay.index] : 'WEEK',
    insightCalendarValue: strongestDay.value > 0 ? String(strongestDay.value) : '-',
    insightTitle: strongestDay.value > 0
      ? `Your strongest day was ${formatWeekday(days[strongestDay.index])}.`
      : hasAnyLocalActivity
        ? 'Your weekly pattern is just beginning.'
        : 'Your weekly insight will appear here.',
    metrics: [
      buildCountMetric('◎', 'Intentional sessions', intentional, 'line', hasAnyLocalActivity),
      buildCountMetric('◷', 'Scrolling check-ins', scrolling, 'bars', hasAnyLocalActivity),
      buildDurationMetric(screenTime, hasAnyLocalActivity),
      buildCountMetric('!', 'Skipped prompts', skippedPrompts, 'bars', hasAnyLocalActivity),
      buildCountMetric('+5', 'Extensions', extensions, 'bars', hasAnyLocalActivity),
      buildCountMetric('?', 'Intention drift', drift, 'bars', hasAnyLocalActivity),
      {
        chart: 'bars',
        dayValues: reels,
        icon: '◎',
        label: 'Estimated reels scrolled',
        meta: supportedReelEvents.length > 0 ? 'Experimental local estimate' : 'Detector unavailable',
        status: supportedReelEvents.length > 0 ? valueStatus(reels) : 'unavailable',
        value: supportedReelEvents.length > 0 ? formatCount(sumValues(reels)) : '-',
      },
    ],
  };
}

function buildCountMetric(
  icon: string,
  label: string,
  values: number[],
  chart: WeeklyTrendMetric['chart'],
  hasAnyLocalActivity: boolean,
): WeeklyTrendMetric {
  const status = hasAnyLocalActivity ? valueStatus(values) : 'unavailable';

  return {
    chart,
    dayValues: hasAnyLocalActivity ? values : emptyValues,
    icon,
    label,
    meta: status === 'unavailable' ? 'Awaiting local data' : status === 'empty' ? '0 this week' : 'From local data',
    status,
    value: status === 'unavailable' ? '-' : formatCount(sumValues(values)),
  };
}

function buildDurationMetric(values: number[], hasAnyLocalActivity: boolean): WeeklyTrendMetric {
  const status = hasAnyLocalActivity ? valueStatus(values) : 'unavailable';

  return {
    chart: 'bars',
    dayValues: hasAnyLocalActivity ? values : emptyValues,
    icon: '▥',
    label: 'Selected-app time',
    meta: status === 'unavailable' ? 'Awaiting duration data' : status === 'empty' ? '0 min this week' : 'Foreground duration',
    status,
    value: status === 'unavailable' ? '-' : formatDuration(sumValues(values)),
  };
}

function valueStatus(values: Array<number | null>): WeeklyTrendMetric['status'] {
  if (values.every((value) => value === null)) {
    return 'unavailable';
  }

  return sumValues(values) > 0 ? 'available' : 'empty';
}

function getStrongestDay(values: number[]) {
  return values.reduce(
    (strongest, value, index) => (value > strongest.value ? { index, value } : strongest),
    { index: 0, value: 0 },
  );
}

function getWeekDays(now: Date) {
  const start = new Date(now);
  const offset = (start.getDay() + 6) % 7;
  start.setHours(0, 0, 0, 0);
  start.setDate(start.getDate() - offset);

  return zeroValues.map((_, index) => {
    const day = new Date(start);
    day.setDate(start.getDate() + index);
    return day;
  });
}

function formatCount(value: number) {
  return new Intl.NumberFormat('en-US').format(value);
}

function formatDuration(durationMs: number) {
  const minutes = Math.round(durationMs / 60000);

  if (minutes < 60) {
    return `${minutes} min`;
  }

  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;

  return remainingMinutes === 0 ? `${hours} hr` : `${hours} hr ${remainingMinutes} min`;
}

function formatWeekday(date: Date) {
  return new Intl.DateTimeFormat('en-US', { weekday: 'long' }).format(date);
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

function isInWeek(value: string, days: Date[]) {
  return days.some((day) => isSameLocalDay(value, day));
}

function isSameLocalDay(value: string, day: Date) {
  const date = new Date(value);

  return (
    date.getFullYear() === day.getFullYear() &&
    date.getMonth() === day.getMonth() &&
    date.getDate() === day.getDate()
  );
}

function sumValues(values: Array<number | null>) {
  return values.reduce<number>((total, value) => total + (value ?? 0), 0);
}
