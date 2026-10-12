import { useRouter } from 'expo-router';
import { useEffect, useMemo, useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { AppButton, Card, SegmentedControl, SettingsRow, Toggle } from '@/components';
import { colors, radius, spacing, typography } from '@/config/theme';
import { useAndroidPermissionState } from '@/hooks/useAndroidPermissionState';
import type { ReminderDurationMinutes, TrackedApp, UserPreferences } from '@/models';
import {
  openOverlaySettings,
  openUsageAccessSettings,
  requestNotificationPermission,
  type AndroidPermissionState,
} from '@/services/permissions/androidPermissions';
import { localRepository, setOnboardingCompleted } from '@/storage';

type StepId = 'welcome' | 'apps' | 'rhythm' | 'permissions' | 'finish';

type OnboardingStep = {
  description: string;
  id: StepId;
  primaryLabel: string;
  secondaryLabel: string;
  title: string;
};

const steps: OnboardingStep[] = [
  {
    description: 'STILL helps you pause before you unlock, check in before you scroll, and notice your habits without guilt.',
    id: 'welcome',
    primaryLabel: 'Get started',
    secondaryLabel: 'I already know how it works',
    title: 'A gentler way to use your phone.',
  },
  {
    description: 'Pick the apps that pull you in most often. STILL will gently pause before opening them.',
    id: 'apps',
    primaryLabel: 'Continue',
    secondaryLabel: 'Skip for now',
    title: 'Choose where STILL checks in.',
  },
  {
    description: "Choose how often STILL checks in and when you'd like a gentle reminder to stop scrolling.",
    id: 'rhythm',
    primaryLabel: 'Continue',
    secondaryLabel: 'Use defaults',
    title: 'Set the rhythm that feels right.',
  },
  {
    description: 'To notice unlocks and selected apps, STILL needs a few Android permissions. Your activity always stays on your device.',
    id: 'permissions',
    primaryLabel: 'Allow permissions',
    secondaryLabel: 'Later',
    title: 'A few permissions, nothing more.',
  },
  {
    description: 'From here, STILL will help you pause, choose with intention, and notice your habits a little more clearly.',
    id: 'finish',
    primaryLabel: 'Enter STILL',
    secondaryLabel: 'Review settings',
    title: "You're ready.",
  },
];

const appChoices = [
  { icon: '◎', label: 'Instagram', value: 'com.instagram.android' },
  { icon: '▶', label: 'YouTube', value: 'com.google.android.youtube' },
  { icon: 'X', label: 'X', value: 'com.twitter.android' },
  { icon: 'R', label: 'Reddit', value: 'com.reddit.frontpage' },
];

const permissionRows = [
  {
    icon: '▥',
    permissionKey: 'usageAccessGranted' as const,
    subtitle: 'In Settings, select STILL and turn on Permit usage access.',
    title: 'Usage access',
  },
  {
    icon: '□',
    permissionKey: 'overlayGranted' as const,
    subtitle: 'Allows gentle reminders when needed.',
    title: 'Display over other apps',
  },
  {
    icon: '⌾',
    permissionKey: 'notificationsGranted' as const,
    subtitle: 'Sends thoughtful reminders and insights.',
    title: 'Notifications',
  },
];

export function OnboardingScreen() {
  const router = useRouter();
  const [stepIndex, setStepIndex] = useState(0);
  const [selectedApps, setSelectedApps] = useState(
    () => new Set(['com.instagram.android', 'com.google.android.youtube', 'com.reddit.frontpage']),
  );
  const [unlockCheckIn, setUnlockCheckIn] = useState(true);
  const [reminderTiming, setReminderTiming] = useState('10');
  const [reelCounting, setReelCounting] = useState(false);
  const [hasHydratedChoices, setHasHydratedChoices] = useState(false);
  const [isCompleting, setIsCompleting] = useState(false);
  const [isOpeningPermissions, setIsOpeningPermissions] = useState(false);
  const { isCheckingPermissions, permissionState, refreshPermissionState } = useAndroidPermissionState();

  const step = steps[stepIndex];
  const isFinalStep = stepIndex === steps.length - 1;

  const selectedAppsList = useMemo(() => Array.from(selectedApps), [selectedApps]);

  useEffect(() => {
    let isMounted = true;

    Promise.all([localRepository.getTrackedApps(), localRepository.getPreferences()])
      .then(([trackedApps, preferences]) => {
        if (!isMounted) {
          return;
        }

        if (trackedApps.length > 0) {
          setSelectedApps(new Set(trackedApps.filter((app) => app.enabled).map((app) => app.id)));
        }

        if (preferences) {
          setUnlockCheckIn(preferences.unlockCheckInEnabled);
          setReminderTiming(String(preferences.defaultReminderDuration));
          setReelCounting(preferences.reelCountingEnabled);
        }
      })
      .finally(() => {
        if (isMounted) {
          setHasHydratedChoices(true);
        }
      });

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    if (!hasHydratedChoices) {
      return;
    }

    void saveOnboardingChoices();
  }, [hasHydratedChoices, reminderTiming, reelCounting, selectedApps, unlockCheckIn]);

  const goNext = async () => {
    if (isFinalStep) {
      setIsCompleting(true);

      try {
        await saveOnboardingChoices();
        await setOnboardingCompleted(true);
        router.replace('/home');
      } catch (error) {
        Alert.alert(
          'Setup could not be saved',
          error instanceof Error ? error.message : 'Please try again before entering STILL.',
        );
      } finally {
        setIsCompleting(false);
      }

      return;
    }

    setStepIndex((current) => Math.min(current + 1, steps.length - 1));
  };

  const handlePrimary = async () => {
    if (step.id !== 'permissions') {
      await goNext();
      return;
    }

    setIsOpeningPermissions(true);

    try {
      await runPermissionSequence();
    } catch (error) {
      Alert.alert(
        'Could not open Usage Access',
        error instanceof Error ? error.message : 'Open Android Settings and grant Usage Access to STILL.',
      );
    } finally {
      setIsOpeningPermissions(false);
    }
  };

  const runPermissionSequence = async () => {
    let state = permissionState ?? (await refreshPermissionState());

    if (!state.nativeModuleAvailable) {
      Alert.alert('Development build required', 'Install and open the STILL development build to grant Android permissions.');
      return;
    }

    if (!state.usageAccessGranted && (await confirmUsageAccessInstructions())) {
      await openUsageAccessSettings();
      state = await refreshPermissionState();

      if (!state.usageAccessGranted) {
        Alert.alert('Usage Access is still off', 'Select STILL and turn on “Permit usage access.” You can try again or continue with reduced functionality.');
      }
    }

    if (!state.overlayGranted && (await confirmOverlayInstructions())) {
      await openOverlaySettings();
      state = await refreshPermissionState();

      if (!state.overlayGranted) {
        Alert.alert('Display permission is still off', 'Turn on “Allow display over other apps” for STILL, or continue without popup overlays.');
      }
    }

    if (!state.notificationsGranted && (await confirmNotificationInstructions())) {
      await requestNotificationPermission();
      state = await refreshPermissionState();

      if (!state.notificationsGranted) {
        Alert.alert('Notifications are off', 'You can continue without notifications and enable them later in Settings.');
      }
    }

    await goNext();
  };

  const saveOnboardingChoices = async () => {
    const now = new Date().toISOString();
    const defaultReminderDuration = toReminderDuration(reminderTiming);

    await Promise.all([
      localRepository.setTrackedApps(buildTrackedApps(selectedApps, defaultReminderDuration, reelCounting, now)),
      localRepository.setPreferences(buildPreferences(defaultReminderDuration, unlockCheckIn, reelCounting, now)),
    ]);
  };

  const handleSecondary = () => {
    if (step.id === 'welcome') {
      setStepIndex(1);
      return;
    }

    if (step.id === 'finish') {
      setStepIndex(2);
      return;
    }

    void goNext();
  };

  const toggleApp = (value: string) => {
    setSelectedApps((current) => {
      const next = new Set(current);

      if (next.has(value)) {
        next.delete(value);
      } else {
        next.add(value);
      }

      return next;
    });
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.wordmark}>S T I L L</Text>
          <Text style={styles.tagline}>Use your phone. On purpose.</Text>
        </View>

        <View style={styles.hero}>
          <Text style={styles.title}>{step.title}</Text>
          <Text style={styles.description}>{step.description}</Text>
        </View>

        <View style={styles.body}>{renderStepBody()}</View>

        <View style={styles.footer}>
          <AppButton
            disabled={isCompleting || isOpeningPermissions}
            iconAfter={<Text style={styles.buttonArrow}>→</Text>}
            label={isCompleting ? 'Saving...' : isOpeningPermissions ? 'Opening settings...' : step.primaryLabel}
            onPress={() => {
              void handlePrimary();
            }}
          />
          <Text onPress={handleSecondary} style={styles.secondaryAction}>
            {step.secondaryLabel}
          </Text>
          <ProgressDots activeIndex={stepIndex} count={steps.length} />
        </View>
      </ScrollView>
    </SafeAreaView>
  );

  function renderStepBody() {
    switch (step.id) {
      case 'welcome':
        return <WelcomeIllustration />;
      case 'apps':
        return (
          <Card style={styles.appSelectionCard} tone="surface">
            {appChoices.map((app) => (
              <SettingsRow
                accessory={<Toggle onChange={() => toggleApp(app.value)} value={selectedAppsList.includes(app.value)} />}
                icon={<Text style={styles.appIcon}>{app.icon}</Text>}
                key={app.value}
                style={styles.selectionRow}
                title={app.label}
              />
            ))}
          </Card>
        );
      case 'rhythm':
        return (
          <View style={styles.stack}>
            <SettingsRow
              accessory={<Toggle onChange={setUnlockCheckIn} value={unlockCheckIn} />}
              icon={<Text style={styles.rowIcon}>▢</Text>}
              subtitle="STILL reminds you to pause before you unlock."
              title="Unlock check-in"
            />
            <SettingsRow
              icon={<Text style={styles.rowIcon}>◷</Text>}
              subtitle="Get a gentle nudge after scrolling for a while."
              title="Reminder timing"
            />
            <SegmentedControl
              onChange={setReminderTiming}
              options={[
                { label: '5 min', value: '5' },
                { label: '10 min', value: '10' },
                { label: '15 min', value: '15' },
              ]}
              value={reminderTiming}
            />
            <SettingsRow
              accessory={<Toggle disabled onChange={setReelCounting} value={reelCounting} />}
              icon={<Text style={styles.rowIcon}>▥</Text>}
              subtitle="Track how many reels you watch in a session."
              title="Reel counting"
            />
          </View>
        );
      case 'permissions':
        return (
          <View style={styles.permissionsBody}>
            {permissionRows.map((permission) => (
              <SettingsRow
                accessory={
                  <Text style={styles.permissionStatus}>
                    {permissionStatusLabel(permissionState, permission.permissionKey, isCheckingPermissions)}
                  </Text>
                }
                icon={<Text style={styles.rowIcon}>{permission.icon}</Text>}
                key={permission.title}
                subtitle={permission.subtitle}
                title={permission.title}
              />
            ))}
          </View>
        );
      case 'finish':
        return (
          <View style={styles.finishBody}>
            <SettingsRow
              icon={<Text style={styles.rowIcon}>▢</Text>}
              style={styles.finishRow}
              subtitle="Your data stays on your device."
              title="Private by design"
            />
            <SettingsRow
              icon={<Text style={styles.rowIcon}>✓</Text>}
              style={styles.finishRow}
              subtitle="Progress, not perfection."
              title="Gentle, not judgmental"
            />
            <WelcomeIllustration compact />
          </View>
        );
      default:
        return null;
    }
  }
}

function confirmUsageAccessInstructions(): Promise<boolean> {
  return new Promise((resolve) => {
    Alert.alert(
      'Allow Usage Access',
      'On the next screen:\n\n1. Find and select STILL.\n2. Turn on “Permit usage access.”\n3. Return to STILL.\n\nAndroid may use slightly different wording on your phone.',
      [
        { onPress: () => resolve(false), style: 'cancel', text: 'Not now' },
        { onPress: () => resolve(true), text: 'Open Settings' },
      ],
      { cancelable: true, onDismiss: () => resolve(false) },
    );
  });
}

function confirmOverlayInstructions(): Promise<boolean> {
  return confirmPermissionInstructions(
    'Allow display over other apps',
    'On the next screen, turn on “Allow display over other apps” for STILL, then return. This lets STILL show a gentle check-in while another selected app is open.',
    'Open Settings',
  );
}

function confirmNotificationInstructions(): Promise<boolean> {
  return confirmPermissionInstructions(
    'Allow notifications',
    'Android will ask whether STILL may send notifications. Choose Allow for reminders you request. You can change this later in Settings.',
    'Continue',
  );
}

function confirmPermissionInstructions(title: string, message: string, positiveLabel: string): Promise<boolean> {
  return new Promise((resolve) => {
    Alert.alert(
      title,
      message,
      [
        { onPress: () => resolve(false), style: 'cancel', text: 'Skip' },
        { onPress: () => resolve(true), text: positiveLabel },
      ],
      { cancelable: true, onDismiss: () => resolve(false) },
    );
  });
}

function permissionStatusLabel(
  state: AndroidPermissionState | null,
  key: 'notificationsGranted' | 'overlayGranted' | 'usageAccessGranted',
  isChecking: boolean,
) {
  if (isChecking && !state) {
    return 'Checking';
  }

  if (!state?.platformSupported) {
    return 'Android only';
  }

  if (!state.nativeModuleAvailable) {
    return 'Dev build needed';
  }

  return state[key] ? 'Allowed' : 'Needs access';
}

function toReminderDuration(value: string): ReminderDurationMinutes {
  if (value === '5' || value === '10' || value === '15') {
    return Number(value) as ReminderDurationMinutes;
  }

  return 10;
}

function buildTrackedApps(
  selectedApps: Set<string>,
  defaultReminderDuration: ReminderDurationMinutes,
  reelCountingEnabled: boolean,
  updatedAt: string,
): TrackedApp[] {
  return appChoices.map((app) => ({
    defaultReminderDuration,
    detectorSupport: app.value === 'com.instagram.android' ? 'unknown' : 'unsupported',
    enabled: selectedApps.has(app.value),
    id: app.value,
    name: app.label,
    promptOnOpen: selectedApps.has(app.value),
    reelCountingEnabled: selectedApps.has(app.value) && reelCountingEnabled,
    reminderEnabled: selectedApps.has(app.value),
    updatedAt,
  }));
}

function buildPreferences(
  defaultReminderDuration: ReminderDurationMinutes,
  unlockCheckInEnabled: boolean,
  reelCountingEnabled: boolean,
  updatedAt: string,
): UserPreferences {
  return {
    cloudSyncEnabled: false,
    defaultReminderDuration,
    notificationsEnabled: false,
    promptCooldownMs: 15 * 60 * 1000,
    reelCountingEnabled,
    trackingEnabled: false,
    unlockCheckInEnabled,
    unlockCooldownMs: 15 * 60 * 1000,
    updatedAt,
  };
}

function WelcomeIllustration({ compact = false }: { compact?: boolean }) {
  return (
    <View style={[styles.illustration, compact && styles.illustrationCompact]}>
      <View style={styles.phoneShadow} />
      <View style={styles.phone}>
        <View style={styles.phoneScreen}>
          {compact ? <Text style={styles.checkMark}>✓</Text> : <Text style={styles.phoneMark}>pause</Text>}
        </View>
      </View>
    </View>
  );
}

function ProgressDots({ activeIndex, count }: { activeIndex: number; count: number }) {
  return (
    <View style={styles.dots}>
      {Array.from({ length: count }).map((_, index) => (
        <View key={index} style={[styles.dot, index === activeIndex && styles.dotActive]} />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  appIcon: {
    color: colors.primaryDark,
    fontSize: typography.sizes.body,
    fontWeight: '700',
    lineHeight: 22,
  },
  appSelectionCard: {
    gap: spacing.sm,
    padding: spacing.md,
  },
  body: {
    flexGrow: 1,
    justifyContent: 'center',
    minHeight: 220,
  },
  buttonArrow: {
    color: colors.onPrimary,
    fontSize: 22,
    lineHeight: 24,
  },
  checkMark: {
    color: colors.onPrimary,
    fontSize: 34,
    lineHeight: 38,
  },
  content: {
    flexGrow: 1,
    paddingBottom: spacing.xl,
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.lg,
  },
  description: {
    color: colors.muted,
    fontSize: 17,
    lineHeight: 26,
    marginTop: spacing.md,
  },
  dot: {
    backgroundColor: colors.border,
    borderRadius: radius.pill,
    height: 10,
    width: 10,
  },
  dotActive: {
    backgroundColor: colors.primary,
  },
  dots: {
    flexDirection: 'row',
    gap: spacing.md,
    justifyContent: 'center',
    marginTop: spacing.xl,
  },
  finishBody: {
    gap: spacing.md,
  },
  finishRow: {
    backgroundColor: 'transparent',
    borderWidth: 0,
    elevation: 0,
    minHeight: 74,
    shadowOpacity: 0,
  },
  footer: {
    gap: spacing.md,
    marginTop: spacing.lg,
  },
  header: {
    marginBottom: spacing.xl,
  },
  hero: {
    minHeight: 150,
  },
  illustration: {
    height: 260,
    justifyContent: 'flex-end',
    marginHorizontal: -spacing.xl,
    overflow: 'hidden',
  },
  illustrationCompact: {
    height: 210,
    marginTop: -spacing.md,
  },
  permissionsBody: {
    gap: spacing.md,
    minHeight: 320,
  },
  permissionStatus: {
    color: colors.primaryDark,
    fontSize: typography.sizes.caption,
    fontWeight: '700',
    lineHeight: 18,
    maxWidth: 76,
    textAlign: 'right',
  },
  phone: {
    alignSelf: 'center',
    backgroundColor: colors.primary,
    borderRadius: 28,
    height: 170,
    justifyContent: 'center',
    marginBottom: spacing.lg,
    padding: spacing.sm,
    transform: [{ rotate: '10deg' }],
    width: 96,
  },
  phoneMark: {
    color: colors.primary,
    fontSize: typography.sizes.caption,
    fontWeight: '700',
    letterSpacing: 1,
    lineHeight: 18,
    textTransform: 'uppercase',
  },
  phoneScreen: {
    alignItems: 'center',
    backgroundColor: colors.background,
    borderRadius: 24,
    flex: 1,
    justifyContent: 'center',
  },
  phoneShadow: {
    alignSelf: 'center',
    backgroundColor: colors.surfaceStrong,
    borderRadius: radius.pill,
    bottom: 14,
    height: 44,
    opacity: 0.7,
    position: 'absolute',
    width: 170,
  },
  rowIcon: {
    color: colors.primaryDark,
    fontSize: 20,
    lineHeight: 24,
  },
  safeArea: {
    backgroundColor: colors.background,
    flex: 1,
  },
  secondaryAction: {
    color: colors.primary,
    fontSize: typography.sizes.body,
    fontWeight: '600',
    lineHeight: 24,
    textAlign: 'center',
  },
  selectionRow: {
    minHeight: 64,
    shadowOpacity: 0,
  },
  stack: {
    gap: spacing.md,
  },
  tagline: {
    color: colors.muted,
    fontSize: typography.sizes.body,
    lineHeight: 24,
    marginTop: spacing.xs,
  },
  title: {
    color: colors.text,
    fontFamily: typography.displayFallback,
    fontSize: 36,
    lineHeight: 42,
  },
  wordmark: {
    color: colors.primary,
    fontSize: typography.sizes.title,
    letterSpacing: 7,
    lineHeight: 30,
  },
});
