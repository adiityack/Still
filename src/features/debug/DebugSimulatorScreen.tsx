import { useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { AppButton, BrandHeader, Card } from '@/components';
import { colors, spacing, typography } from '@/config/theme';
import {
  clearDebugSimulationData,
  simulateIntentionalAppSession,
  simulateReminderAndReels,
  simulateUnlockEvent,
} from '@/services/debug/debugSimulator';

type Status = {
  message: string;
  tone: 'success' | 'warning';
};

export function DebugSimulatorScreen() {
  const [status, setStatus] = useState<Status | null>(null);

  if (!__DEV__) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.lockedContent}>
          <Text style={styles.title}>Debug simulator</Text>
          <Text style={styles.subtitle}>This screen is only available in development builds.</Text>
        </View>
      </SafeAreaView>
    );
  }

  const runAction = async (message: string, action: () => Promise<void>) => {
    await action();
    setStatus({ message, tone: 'success' });
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <BrandHeader />

        <View style={styles.hero}>
          <Text style={styles.title}>Debug simulator</Text>
          <Text style={styles.subtitle}>Create local development events without Android monitoring.</Text>
        </View>

        <Card style={styles.card}>
          <Text style={styles.cardTitle}>Local events</Text>
          <Text style={styles.cardText}>
            Simulated records are saved with debug provenance so they can be cleared before real device testing.
          </Text>
          <View style={styles.buttonStack}>
            <AppButton
              label="Simulate unlock"
              onPress={() => runAction('Added one unlock event.', simulateUnlockEvent)}
              variant="secondary"
            />
            <AppButton
              label="Simulate intentional session"
              onPress={() => runAction('Added one intentional Instagram session.', simulateIntentionalAppSession)}
              variant="secondary"
            />
            <AppButton
              label="Simulate reminder + reels"
              onPress={() => runAction('Added one scrolling session, reminder, and reel estimate.', simulateReminderAndReels)}
              variant="secondary"
            />
            <AppButton
              label="Clear debug data"
              onPress={() => runAction('Cleared simulated debug records.', clearDebugSimulationData)}
              variant="outline"
            />
          </View>
        </Card>

        {status ? (
          <View style={[styles.status, status.tone === 'warning' && styles.statusWarning]}>
            <Text style={styles.statusText}>{status.message}</Text>
          </View>
        ) : null}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  buttonStack: {
    gap: spacing.md,
    marginTop: spacing.lg,
  },
  card: {
    padding: spacing.xl,
  },
  cardText: {
    color: colors.muted,
    fontSize: 15,
    lineHeight: 22,
    marginTop: spacing.sm,
  },
  cardTitle: {
    color: colors.text,
    fontSize: 20,
    fontWeight: '700',
    lineHeight: 26,
  },
  content: {
    gap: spacing.lg,
    paddingBottom: 72,
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.lg,
  },
  hero: {
    paddingTop: spacing.lg,
  },
  lockedContent: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: spacing.xl,
  },
  safeArea: {
    backgroundColor: colors.background,
    flex: 1,
  },
  status: {
    backgroundColor: colors.surfaceStrong,
    borderColor: colors.border,
    borderRadius: 18,
    borderWidth: 1,
    padding: spacing.lg,
  },
  statusText: {
    color: colors.primaryDark,
    fontSize: 15,
    fontWeight: '600',
    lineHeight: 22,
  },
  statusWarning: {
    backgroundColor: colors.surfaceMuted,
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
