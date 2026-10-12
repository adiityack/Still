import { useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { AppButton, PromptSheet, SegmentedControl, SettingsRow } from '@/components';
import { colors, spacing, typography } from '@/config/theme';

type PromptMode = 'unlock' | 'app' | 'reminder';

export function PromptPreviewScreen() {
  const [mode, setMode] = useState<PromptMode>('unlock');
  const [duration, setDuration] = useState('10');

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.previewBackground}>
        <View style={styles.fakeStatus}>
          <Text style={styles.fakeDate}>Mon, Apr 28</Text>
          <Text style={styles.fakeWeather}>64°F</Text>
        </View>
        <View style={styles.fakeDock}>
          <View style={styles.fakeApp} />
          <View style={styles.fakeApp} />
          <View style={styles.fakeApp} />
          <View style={styles.fakeApp} />
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <SegmentedControl
          onChange={(value) => setMode(value as PromptMode)}
          options={[
            { label: 'Unlock', value: 'unlock' },
            { label: 'App', value: 'app' },
            { label: 'Reminder', value: 'reminder' },
          ]}
          value={mode}
        />

        {mode === 'unlock' ? <UnlockPrompt /> : null}
        {mode === 'app' ? <AppOpeningPrompt duration={duration} setDuration={setDuration} /> : null}
        {mode === 'reminder' ? <ReminderPrompt /> : null}
      </ScrollView>
    </SafeAreaView>
  );
}

function UnlockPrompt() {
  return (
    <PromptSheet subtitle="A quick pause before you continue." title="What brought you here?">
      <PromptOption icon="◎" label="Something specific" />
      <PromptOption icon="⏸" label="Just taking a break" />
      <AppButton label="Skip" variant="outline" />
      <Text style={styles.helper}>You can change this in Settings.</Text>
    </PromptSheet>
  );
}

function AppOpeningPrompt({
  duration,
  setDuration,
}: {
  duration: string;
  setDuration: (value: string) => void;
}) {
  return (
    <PromptSheet subtitle="A quick check before you open Instagram." title="What are you here for?">
      <PromptOption icon="◎" label="Do something specific" />
      <PromptOption icon="◷" label="Just scrolling" />
      <AppButton label="Skip" variant="outline" />
      <View style={styles.divider} />
      <Text style={styles.durationTitle}>How long feels enough?</Text>
      <SegmentedControl
        onChange={setDuration}
        options={[
          { label: '5 min', value: '5' },
          { label: '10 min', value: '10' },
          { label: '15 min', value: '15' },
          { label: 'No limit', value: 'none' },
        ]}
        value={duration}
      />
      <AppButton label="Open Instagram" />
    </PromptSheet>
  );
}

function ReminderPrompt() {
  return (
    <PromptSheet subtitle="You've been on Instagram for 10 min." title="Still enjoying this?">
      <View style={styles.reminderStats}>
        <View style={styles.statCard}>
          <Text style={styles.statIcon}>▥</Text>
          <View>
            <Text style={styles.statLabel}>Estimated reels:</Text>
            <Text style={styles.statValue}>Unavailable</Text>
          </View>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statIcon}>◷</Text>
          <View>
            <Text style={styles.statLabel}>Planned time:</Text>
            <Text style={styles.statValue}>10 min</Text>
          </View>
        </View>
      </View>
      <Text style={styles.centerCopy}>Take a moment before you continue.</Text>
      <AppButton iconBefore={<Text style={styles.buttonIcon}>✓</Text>} label="I'm done" />
      <AppButton iconBefore={<Text style={styles.outlineIcon}>◷</Text>} label="5 more min" variant="outline" />
      <Text style={styles.helper}>You can change reminders in Settings.</Text>
    </PromptSheet>
  );
}

function PromptOption({ icon, label }: { icon: string; label: string }) {
  return (
    <SettingsRow
      accessory={<Text style={styles.promptChevron}>›</Text>}
      icon={<Text style={styles.optionIcon}>{icon}</Text>}
      style={styles.optionRow}
      title={label}
    />
  );
}

const styles = StyleSheet.create({
  buttonIcon: {
    color: colors.onPrimary,
    fontSize: 18,
    fontWeight: '700',
    lineHeight: 20,
  },
  centerCopy: {
    color: colors.muted,
    fontSize: 16,
    lineHeight: 24,
    textAlign: 'center',
  },
  content: {
    gap: spacing.xl,
    justifyContent: 'center',
    minHeight: '100%',
    padding: spacing.xl,
  },
  divider: {
    backgroundColor: colors.border,
    height: 1,
    marginVertical: spacing.sm,
  },
  durationTitle: {
    color: colors.text,
    fontFamily: typography.displayFallback,
    fontSize: 24,
    lineHeight: 30,
  },
  fakeApp: {
    backgroundColor: colors.surface,
    borderRadius: 20,
    height: 56,
    opacity: 0.55,
    width: 56,
  },
  fakeDate: {
    color: colors.onPrimary,
    fontSize: 18,
    fontWeight: '700',
    opacity: 0.6,
  },
  fakeDock: {
    bottom: 72,
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.xl,
    justifyContent: 'center',
    maxWidth: 320,
    position: 'absolute',
  },
  fakeStatus: {
    left: spacing.xl,
    position: 'absolute',
    top: spacing.xxl,
  },
  fakeWeather: {
    color: colors.onPrimary,
    fontSize: 16,
    marginTop: spacing.sm,
    opacity: 0.55,
  },
  helper: {
    color: colors.muted,
    fontSize: 14,
    lineHeight: 20,
    textAlign: 'center',
  },
  optionIcon: {
    color: colors.primaryDark,
    fontSize: 20,
    fontWeight: '700',
    lineHeight: 24,
  },
  optionRow: {
    minHeight: 64,
    shadowOpacity: 0,
  },
  outlineIcon: {
    color: colors.primaryDark,
    fontSize: 18,
    fontWeight: '700',
    lineHeight: 20,
  },
  previewBackground: {
    ...StyleSheet.absoluteFill,
    alignItems: 'center',
    backgroundColor: colors.primaryDark,
    justifyContent: 'center',
    opacity: 0.92,
  },
  promptChevron: {
    color: colors.muted,
    fontSize: 28,
    lineHeight: 28,
  },
  reminderStats: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.md,
  },
  safeArea: {
    backgroundColor: colors.primaryDark,
    flex: 1,
  },
  statCard: {
    alignItems: 'center',
    backgroundColor: colors.surfaceMuted,
    borderColor: colors.border,
    borderRadius: 16,
    borderWidth: 1,
    flex: 1,
    flexDirection: 'row',
    gap: spacing.md,
    minWidth: 150,
    minHeight: 74,
    padding: spacing.md,
  },
  statIcon: {
    color: colors.primaryDark,
    fontSize: 22,
    lineHeight: 26,
  },
  statLabel: {
    color: colors.text,
    fontSize: 13,
    lineHeight: 18,
  },
  statValue: {
    color: colors.primaryDark,
    fontSize: 16,
    fontWeight: '700',
    lineHeight: 22,
  },
});
