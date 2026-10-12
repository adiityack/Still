export type ISODateString = string;
export type ISODateTimeString = string;
export type Milliseconds = number;
export type PackageName = string;

export type DataProvenance =
  | 'android-usage-events'
  | 'android-unlock-event'
  | 'user-reported'
  | 'local-setting'
  | 'derived-summary'
  | 'debug-simulated'
  | 'experimental-detector'
  | 'unsupported'
  | 'unknown';

export type DetectorSupport = 'supported' | 'unsupported' | 'unknown' | 'disabled';

export type MonitoringPermissionState = 'unknown' | 'granted' | 'denied' | 'unavailable';

export type ReminderDurationMinutes = 5 | 10 | 15 | 'no-limit';

export type PromptSurface = 'unlock' | 'app-opening' | 'session-reminder' | 'task-follow-up';

export type PromptResult = 'answered' | 'skipped' | 'dismissed' | 'not-shown';

export type IntentionCategory =
  | 'specific-task'
  | 'intentional-break'
  | 'planned-scrolling'
  | 'casual-scrolling'
  | 'skipped'
  | 'unknown';

export type TaskOutcome = 'completed' | 'not-yet' | 'forgot' | 'unknown';

export type ReminderResponse = 'done' | 'extend-5-min' | 'dismissed' | 'unknown';

export type TrackedApp = {
  defaultReminderDuration: ReminderDurationMinutes;
  detectorSupport: DetectorSupport;
  enabled: boolean;
  id: PackageName;
  name: string;
  promptOnOpen: boolean;
  reminderEnabled: boolean;
  reelCountingEnabled: boolean;
  updatedAt: ISODateTimeString;
};

export type UserPreferences = {
  cloudSyncEnabled: boolean;
  defaultReminderDuration: ReminderDurationMinutes;
  notificationsEnabled: boolean;
  promptCooldownMs: Milliseconds;
  reelCountingEnabled: boolean;
  trackingEnabled: boolean;
  unlockCheckInEnabled: boolean;
  unlockCooldownMs: Milliseconds;
  updatedAt: ISODateTimeString;
};

export type PromptChoice = {
  category: IntentionCategory;
  customText?: string;
  presetId?: string;
  provenance: DataProvenance;
};

export type UnlockEvent = {
  cooldownActive: boolean;
  id: string;
  occurredAt: ISODateTimeString;
  promptEventId?: string;
  promptResult: PromptResult;
  provenance: DataProvenance;
};

export type PromptEvent = {
  appSessionId?: string;
  choice?: PromptChoice;
  id: string;
  result: PromptResult;
  shownAt: ISODateTimeString;
  surface: PromptSurface;
};

export type AppSession = {
  appId: PackageName;
  endedAt?: ISODateTimeString;
  extensionCount: number;
  foregroundDurationMs?: Milliseconds;
  id: string;
  intention?: PromptChoice;
  plannedDuration: ReminderDurationMinutes;
  provenance: DataProvenance;
  startedAt: ISODateTimeString;
  taskOutcome?: TaskOutcome;
};

export type ReminderEvent = {
  appSessionId: string;
  elapsedMs: Milliseconds;
  id: string;
  plannedDuration: ReminderDurationMinutes;
  response: ReminderResponse;
  shownAt: ISODateTimeString;
};

export type ReelTrackingEvent = {
  appSessionId: string;
  confidence?: 'low' | 'medium' | 'high';
  count?: number;
  detectorSupport: DetectorSupport;
  id: string;
  observedAt: ISODateTimeString;
  provenance: DataProvenance;
};

export type SummaryMetric = {
  incomplete: boolean;
  provenance: DataProvenance[];
  value: number | null;
};

export type DailySummary = {
  date: ISODateString;
  estimatedReels: SummaryMetric;
  extensions: SummaryMetric;
  intentionalSessions: SummaryMetric;
  monitoredAppDurationMs: SummaryMetric;
  promptSkips: SummaryMetric;
  selectedAppOpens: SummaryMetric;
  unplannedOpens: SummaryMetric;
};

export type WeeklySummary = {
  dailySummaries: DailySummary[];
  endsOn: ISODateString;
  startsOn: ISODateString;
};
