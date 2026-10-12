import { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';

import { BrandHeader, Chevron, SegmentedControl, SettingsRow, Toggle } from '@/components';
import { colors, spacing, typography } from '@/config/theme';
import type { ReminderDurationMinutes, UserPreferences } from '@/models';
import { useAndroidPermissionState } from '@/hooks/useAndroidPermissionState';
import { localRepository } from '@/storage';
import type { AndroidPermissionState } from '@/services/permissions/androidPermissions';

export function SettingsScreen() {
  const router = useRouter();
  const [unlockCheckIn, setUnlockCheckIn] = useState(true);
  const [reelCounting, setReelCounting] = useState(false);
  const [reminderTiming, setReminderTiming] = useState('10');
  const [trackingEnabled, setTrackingEnabled] = useState(false);
  const { isCheckingPermissions, permissionState } = useAndroidPermissionState();
  const canEnableTracking = permissionState?.nativeModuleAvailable === true && permissionState.usageAccessGranted;

  useEffect(() => {
    let isMounted = true;

    localRepository.getPreferences().then((preferences) => {
      if (!isMounted || !preferences) {
        return;
      }

      setUnlockCheckIn(preferences.unlockCheckInEnabled);
      setReelCounting(preferences.reelCountingEnabled);
      setReminderTiming(String(preferences.defaultReminderDuration));
      setTrackingEnabled(preferences.trackingEnabled);
    });

    return () => {
      isMounted = false;
    };
  }, []);

  const savePreferences = async (updates: Partial<UserPreferences>) => {
    const current = await localRepository.getPreferences();
    const now = new Date().toISOString();
    const next: UserPreferences = {
      cloudSyncEnabled: current?.cloudSyncEnabled ?? false,
      defaultReminderDuration: current?.defaultReminderDuration ?? 10,
      notificationsEnabled: current?.notificationsEnabled ?? false,
      promptCooldownMs: current?.promptCooldownMs ?? 15 * 60 * 1000,
      reelCountingEnabled: current?.reelCountingEnabled ?? false,
      trackingEnabled: current?.trackingEnabled ?? false,
      unlockCheckInEnabled: current?.unlockCheckInEnabled ?? true,
      unlockCooldownMs: current?.unlockCooldownMs ?? 15 * 60 * 1000,
      updatedAt: now,
      ...updates,
    };

    await localRepository.setPreferences(next);
  };

  const handleUnlockCheckInChange = (value: boolean) => {
    setUnlockCheckIn(value);
    void savePreferences({ unlockCheckInEnabled: value });
  };

  const handleReminderTimingChange = (value: string) => {
    const duration = toReminderDuration(value);

    setReminderTiming(String(duration));
    void savePreferences({ defaultReminderDuration: duration });
    void updateTrackedAppReminderDuration(duration);
  };

  const handleTrackingEnabledChange = (value: boolean) => {
    setTrackingEnabled(value);
    void savePreferences({ trackingEnabled: value });
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <BrandHeader />

        <View style={styles.hero}>
          <Text style={styles.title}>Settings</Text>
          <Text style={styles.subtitle}>Make STILL work your way.</Text>
        </View>

        <View style={styles.stack}>
          <SettingsRow
            accessory={<Toggle onChange={handleUnlockCheckInChange} value={unlockCheckIn} />}
            icon={<Text style={styles.rowIcon}>◎</Text>}
            subtitle="A quick pause before opening selected apps."
            title="Unlock check-in"
          />
          <SettingsRow
            accessory={<Chevron />}
            icon={<Text style={styles.rowIcon}>▦</Text>}
            subtitle="Choose which apps prompt a check-in."
            title="Selected apps"
          />
          <SettingsRow
            icon={<Text style={styles.rowIcon}>⏱</Text>}
            subtitle={`${reminderTiming} min before a gentle reminder.`}
            title="Reminder timing"
          />
          <SegmentedControl
            onChange={handleReminderTimingChange}
            options={[
              { label: '5 min', value: '5' },
              { label: '10 min', value: '10' },
              { label: '15 min', value: '15' },
            ]}
            value={reminderTiming}
          />
          <SettingsRow
            accessory={<Toggle disabled onChange={setReelCounting} value={reelCounting} />}
            icon={<Text style={styles.rowIcon}>◎</Text>}
            subtitle="Unavailable until detector support is enabled."
            title="Reel counting"
          />
          <SettingsRow
            accessory={<Chevron />}
            icon={<Text style={styles.rowIcon}>◇</Text>}
            subtitle="Your data stays private and on your device."
            title="Privacy"
          />
          <SettingsRow
            accessory={<Text style={styles.permissionStatus}>{settingsPermissionLabel(permissionState, isCheckingPermissions)}</Text>}
            icon={<Text style={styles.rowIcon}>✓</Text>}
            subtitle="Usage access, overlays, and notifications. Status refreshes after Settings."
            title="Android permissions"
          />
          <SettingsRow
            accessory={
              <Toggle
                disabled={!canEnableTracking}
                onChange={handleTrackingEnabledChange}
                value={trackingEnabled && canEnableTracking}
              />
            }
            icon={<Text style={styles.rowIcon}>◷</Text>}
            subtitle={
              canEnableTracking
                ? 'Usage access is ready for native monitoring.'
                : 'Grant Usage Access in a development build before enabling tracking.'
            }
            title="Tracking"
          />
          <SettingsRow
            icon={<Text style={styles.rowIcon}>!</Text>}
            subtitle="No local history exists yet."
            title="Delete local history"
          />
          {__DEV__ ? (
            <SettingsRow
              accessory={<Chevron />}
              icon={<Text style={styles.rowIcon}>◇</Text>}
              onPress={() => router.push('/debug-simulator')}
              subtitle="Create local test events for Home and Insights."
              title="Debug simulator"
            />
          ) : null}
        </View>

        <View style={styles.privacyNote}>
          <Text style={styles.noteIcon}>✓</Text>
          <View style={styles.noteDivider} />
          <Text style={styles.noteText}>All activity stays on your device.</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function settingsPermissionLabel(state: AndroidPermissionState | null, isChecking: boolean) {
  if (isChecking && !state) {
    return 'Checking';
  }

  if (!state?.platformSupported) {
    return 'Android only';
  }

  if (!state.nativeModuleAvailable) {
    return 'Dev build needed';
  }

  const grantedCount = [state.usageAccessGranted, state.overlayGranted, state.notificationsGranted].filter(Boolean).length;
  return `${grantedCount}/3 allowed`;
}

function toReminderDuration(value: string): ReminderDurationMinutes {
  if (value === '5' || value === '10' || value === '15') {
    return Number(value) as ReminderDurationMinutes;
  }

  return 10;
}

async function updateTrackedAppReminderDuration(duration: ReminderDurationMinutes) {
  const now = new Date().toISOString();
  const apps = await localRepository.getTrackedApps();

  if (apps.length === 0) {
    return;
  }

  await localRepository.setTrackedApps(
    apps.map((app) => ({
      ...app,
      defaultReminderDuration: duration,
      updatedAt: now,
    })),
  );
}

const styles = StyleSheet.create({
  content: {
    gap: spacing.lg,
    paddingBottom: 132,
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.lg,
  },
  hero: {
    paddingTop: spacing.lg,
  },
  noteDivider: {
    backgroundColor: colors.border,
    height: 28,
    width: 1,
  },
  noteIcon: {
    color: colors.primaryDark,
    fontSize: 20,
    fontWeight: '700',
    lineHeight: 24,
  },
  noteText: {
    color: colors.muted,
    flex: 1,
    fontSize: 15,
    lineHeight: 22,
  },
  permissionStatus: {
    color: colors.primaryDark,
    fontSize: 13,
    fontWeight: '700',
    lineHeight: 18,
    maxWidth: 82,
    textAlign: 'right',
  },
  privacyNote: {
    alignItems: 'center',
    backgroundColor: colors.surfaceMuted,
    borderColor: colors.border,
    borderRadius: 24,
    borderWidth: 1,
    flexDirection: 'row',
    gap: spacing.md,
    minHeight: 62,
    paddingHorizontal: spacing.lg,
  },
  rowIcon: {
    color: colors.primaryDark,
    fontSize: 20,
    fontWeight: '700',
    lineHeight: 24,
  },
  safeArea: {
    backgroundColor: colors.background,
    flex: 1,
  },
  stack: {
    gap: spacing.md,
    marginTop: spacing.md,
  },
  subtitle: {
    color: colors.muted,
    fontSize: 17,
    lineHeight: 26,
    marginTop: spacing.xs,
  },
  title: {
    color: colors.text,
    fontFamily: typography.displayFallback,
    fontSize: 36,
    lineHeight: 42,
    marginTop: spacing.xl,
  },
});
