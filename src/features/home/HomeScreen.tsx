import { useCallback, useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { useFocusEffect } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';

import { BrandHeader, Card, Chevron, MetricCard, SettingsRow } from '@/components';
import { colors, spacing, typography } from '@/config/theme';
import { getLocalHomeMetrics, type HomeMetrics } from './homeMetrics';

export function HomeScreen() {
  const [metrics, setMetrics] = useState<HomeMetrics | null>(null);

  useFocusEffect(
    useCallback(() => {
      let isMounted = true;

      getLocalHomeMetrics().then((nextMetrics) => {
        if (isMounted) {
          setMetrics(nextMetrics);
        }
      });

      return () => {
        isMounted = false;
      };
    }, []),
  );

  const cards = buildMetricCards(metrics);

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <BrandHeader />

        <View style={styles.hero}>
          <Text style={styles.today}>Today</Text>
          <Text style={styles.heroSubtitle}>A calmer, more intentional you.</Text>
        </View>

        <View style={styles.metricGrid}>
          {cards.map((metric) => (
            <MetricCard
              key={metric.label}
              icon={<Text style={styles.metricIcon}>{metric.icon}</Text>}
              label={metric.label}
              meta={metric.meta}
              value={metric.value}
            />
          ))}
        </View>

        <Card style={styles.insightCard}>
          <View style={styles.insightEyebrowRow}>
            <Text style={styles.spark}>✦</Text>
            <Text style={styles.eyebrow}>TODAY'S INSIGHT</Text>
          </View>
          <View style={styles.insightContent}>
            <View style={styles.insightCopy}>
              <Text style={styles.insightTitle}>
                {metrics?.insightTitle ?? 'Your first real insight will appear here.'}
              </Text>
              <Text style={styles.insightBody}>
                {metrics?.insightBody ?? 'STILL will use local activity after setup and permissions.'}
              </Text>
            </View>
            <View style={styles.chartPlaceholder} accessibilityLabel="Empty insight chart placeholder">
              <View style={[styles.chartBar, styles.chartBarTall]} />
              <View style={[styles.chartBar, styles.chartBarMedium]} />
              <View style={[styles.chartBar, styles.chartBarShort]} />
              <View style={[styles.chartBar, styles.chartBarTiny]} />
            </View>
          </View>
        </Card>

        <SettingsRow
          accessory={<Chevron />}
          icon={<Text style={styles.breakIcon}>⏸</Text>}
          title="Take an intentional break"
        />
      </ScrollView>
    </SafeAreaView>
  );
}

function buildMetricCards(metrics: HomeMetrics | null) {
  return [
    {
      icon: '◎',
      label: 'Intentional\nsessions',
      meta: metrics?.intentionalSessions.meta ?? 'No sessions yet',
      value: metrics?.intentionalSessions.value ?? '-',
    },
    {
      icon: '!',
      label: 'Unplanned\nopens',
      meta: metrics?.unplannedOpens.meta ?? 'Needs explicit choice',
      value: metrics?.unplannedOpens.value ?? '-',
    },
    {
      icon: '▥',
      label: 'Screen time\n(on selected apps)',
      meta: metrics?.screenTime.meta ?? 'Awaiting app data',
      value: metrics?.screenTime.value ?? '-',
    },
    {
      icon: '◎',
      label: 'Estimated\nreels scrolled',
      meta: metrics?.reelsEstimate.meta ?? 'Detector not enabled',
      value: metrics?.reelsEstimate.value ?? '-',
    },
  ];
}

const styles = StyleSheet.create({
  chartBar: {
    backgroundColor: colors.surfaceStrong,
    borderRadius: 8,
    width: 12,
  },
  chartBarMedium: {
    height: 62,
  },
  chartBarShort: {
    height: 42,
  },
  chartBarTall: {
    height: 84,
  },
  chartBarTiny: {
    height: 28,
  },
  chartPlaceholder: {
    alignItems: 'flex-end',
    alignSelf: 'flex-end',
    flexDirection: 'row',
    gap: spacing.sm,
    minHeight: 96,
    minWidth: 92,
  },
  content: {
    gap: spacing.xl,
    paddingBottom: 132,
    paddingHorizontal: spacing.screen,
    paddingTop: spacing.xl,
  },
  eyebrow: {
    color: colors.primary,
    fontSize: typography.sizes.eyebrow,
    fontWeight: '700',
    letterSpacing: 4,
  },
  hero: {
    minHeight: 190,
    paddingTop: spacing.xl,
  },
  heroSubtitle: {
    color: colors.muted,
    fontSize: typography.sizes.title,
    lineHeight: 30,
    marginTop: spacing.sm,
  },
  insightBody: {
    color: colors.muted,
    fontSize: typography.sizes.body,
    lineHeight: 24,
    marginTop: spacing.sm,
  },
  insightCard: {
    padding: spacing.xl,
  },
  insightContent: {
    alignItems: 'flex-end',
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.lg,
    justifyContent: 'space-between',
    marginTop: spacing.xl,
  },
  insightCopy: {
    flex: 1,
    minWidth: 190,
  },
  insightEyebrowRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: spacing.md,
  },
  insightTitle: {
    color: colors.text,
    fontFamily: typography.displayFallback,
    fontSize: typography.sizes.heading,
    lineHeight: 36,
  },
  breakIcon: {
    color: colors.primaryDark,
    fontSize: 20,
    lineHeight: 24,
  },
  metricIcon: {
    color: colors.primaryDark,
    fontSize: 34,
    lineHeight: 38,
  },
  metricGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.lg,
  },
  safeArea: {
    backgroundColor: colors.background,
    flex: 1,
  },
  spark: {
    color: colors.primary,
    fontSize: 26,
    lineHeight: 28,
  },
  today: {
    color: colors.text,
    fontFamily: typography.displayFallback,
    fontSize: typography.sizes.display,
    lineHeight: 58,
    marginTop: spacing.xxl,
  },
});
