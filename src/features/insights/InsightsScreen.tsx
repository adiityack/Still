import { useCallback, useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { useFocusEffect } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';

import { BrandHeader, Card, IconDisc } from '@/components';
import { colors, spacing, typography } from '@/config/theme';
import { getLocalWeeklyInsights, type WeeklyInsights, type WeeklyTrendMetric } from './insightsMetrics';

const dayLabels = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];

export function InsightsScreen() {
  const [insights, setInsights] = useState<WeeklyInsights | null>(null);

  useFocusEffect(
    useCallback(() => {
      let isMounted = true;

      getLocalWeeklyInsights().then((nextInsights) => {
        if (isMounted) {
          setInsights(nextInsights);
        }
      });

      return () => {
        isMounted = false;
      };
    }, []),
  );

  const metrics = insights?.metrics ?? getEmptyMetrics();

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <BrandHeader />

        <View style={styles.hero}>
          <Text style={styles.title}>Insights</Text>
          <Text style={styles.subtitle}>Small changes, visible progress.</Text>
        </View>

        <View style={styles.stack}>
          {insights?.hasAnyLocalActivity === false ? (
            <Card style={styles.emptyCard}>
              <Text style={styles.emptyTitle}>No weekly activity yet.</Text>
              <Text style={styles.emptyBody}>
                Choose apps and use the debug simulator or Android monitoring later to populate local trends.
              </Text>
            </Card>
          ) : null}

          {metrics.map((metric) => (
            <InsightMetricCard key={metric.label} metric={metric} />
          ))}

          <Card style={styles.weeklyCard}>
            <View style={styles.eyebrowRow}>
              <Text style={styles.spark}>✦</Text>
              <Text style={styles.eyebrow}>THIS WEEK'S INSIGHT</Text>
            </View>
            <View style={styles.weeklyContent}>
              <View style={styles.weeklyCopy}>
                <Text style={styles.weeklyTitle}>{insights?.insightTitle ?? 'Your weekly insight will appear here.'}</Text>
                <Text style={styles.weeklyBody}>
                  {insights?.insightBody ?? 'STILL needs a few days of local activity before it can show a real trend.'}
                </Text>
              </View>
              <View style={styles.calendar}>
                <Text style={styles.calendarLabel}>{insights?.insightCalendarLabel ?? 'WEEK'}</Text>
                <Text style={styles.calendarValue}>{insights?.insightCalendarValue ?? '-'}</Text>
              </View>
            </View>
          </Card>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function InsightMetricCard({ metric }: { metric: WeeklyTrendMetric }) {
  return (
    <Card style={styles.metricCard}>
      <View style={styles.metricCopy}>
        <IconDisc>
          <Text style={styles.metricIcon}>{metric.icon}</Text>
        </IconDisc>
        <View style={styles.metricText}>
          <Text style={styles.metricLabel}>{metric.label}</Text>
          <Text style={styles.metricPeriod}>This week</Text>
          <Text style={styles.metricValue}>{metric.value}</Text>
          <Text style={styles.metricMeta}>{metric.meta}</Text>
        </View>
      </View>
      <View style={styles.chartArea}>
        <TrendChart metric={metric} />
        <View style={styles.dayLabels}>
          {dayLabels.map((day, index) => (
            <Text key={`${day}-${index}`} style={styles.dayLabel}>
              {day}
            </Text>
          ))}
        </View>
      </View>
    </Card>
  );
}

function TrendChart({ metric }: { metric: WeeklyTrendMetric }) {
  const maxValue = Math.max(...metric.dayValues.map((value) => value ?? 0), 1);

  return (
    <View style={metric.chart === 'line' ? styles.lineChart : styles.barChart}>
      {metric.dayValues.map((value, index) => (
        <View
          key={index}
          style={[
            metric.chart === 'line' ? styles.lineBar : styles.bar,
            value === null && styles.unavailableBar,
            value === 0 && styles.zeroBar,
            value !== null && { height: value === 0 ? 6 : Math.max(12, Math.round((value / maxValue) * 64)) },
          ]}
        />
      ))}
    </View>
  );
}

function getEmptyMetrics(): WeeklyTrendMetric[] {
  return [
    {
      chart: 'line',
      dayValues: [null, null, null, null, null, null, null],
      icon: '◎',
      label: 'Intentional sessions',
      meta: 'Awaiting local data',
      status: 'unavailable',
      value: '-',
    },
    {
      chart: 'bars',
      dayValues: [null, null, null, null, null, null, null],
      icon: '◷',
      label: 'Scrolling check-ins',
      meta: 'Awaiting local data',
      status: 'unavailable',
      value: '-',
    },
    {
      chart: 'bars',
      dayValues: [null, null, null, null, null, null, null],
      icon: '▥',
      label: 'Selected-app time',
      meta: 'Awaiting duration data',
      status: 'unavailable',
      value: '-',
    },
    {
      chart: 'bars',
      dayValues: [null, null, null, null, null, null, null],
      icon: '!',
      label: 'Skipped prompts',
      meta: 'Awaiting local data',
      status: 'unavailable',
      value: '-',
    },
    {
      chart: 'bars',
      dayValues: [null, null, null, null, null, null, null],
      icon: '+5',
      label: 'Extensions',
      meta: 'Awaiting local data',
      status: 'unavailable',
      value: '-',
    },
    {
      chart: 'bars',
      dayValues: [null, null, null, null, null, null, null],
      icon: '?',
      label: 'Intention drift',
      meta: 'Awaiting local data',
      status: 'unavailable',
      value: '-',
    },
    {
      chart: 'bars',
      dayValues: [null, null, null, null, null, null, null],
      icon: '◎',
      label: 'Estimated reels scrolled',
      meta: 'Detector unavailable',
      status: 'unavailable',
      value: '-',
    },
  ];
}

const styles = StyleSheet.create({
  bar: {
    backgroundColor: colors.surfaceStrong,
    borderRadius: 6,
    width: 10,
  },
  barChart: {
    alignItems: 'flex-end',
    flexDirection: 'row',
    gap: spacing.sm,
    height: 66,
  },
  calendar: {
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: 16,
    borderWidth: 1,
    minWidth: 76,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  calendarLabel: {
    color: colors.muted,
    fontSize: typography.sizes.caption,
    fontWeight: '700',
    letterSpacing: 1,
    lineHeight: 18,
  },
  calendarValue: {
    color: colors.primaryDark,
    fontFamily: typography.displayFallback,
    fontSize: 34,
    lineHeight: 38,
  },
  chartArea: {
    flex: 1,
    gap: spacing.sm,
    justifyContent: 'flex-end',
    minWidth: 148,
  },
  content: {
    gap: spacing.lg,
    paddingBottom: 132,
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.lg,
  },
  dayLabel: {
    color: colors.muted,
    flex: 1,
    fontSize: typography.sizes.caption,
    lineHeight: 18,
    textAlign: 'center',
  },
  dayLabels: {
    flexDirection: 'row',
  },
  eyebrow: {
    color: colors.primary,
    fontSize: typography.sizes.eyebrow,
    fontWeight: '700',
    letterSpacing: 3,
    lineHeight: 18,
  },
  eyebrowRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: spacing.sm,
  },
  emptyBody: {
    color: colors.muted,
    fontSize: 15,
    lineHeight: 22,
    marginTop: spacing.xs,
  },
  emptyCard: {
    padding: spacing.lg,
  },
  emptyTitle: {
    color: colors.text,
    fontSize: 18,
    fontWeight: '700',
    lineHeight: 24,
  },
  hero: {
    paddingTop: spacing.lg,
  },
  lineChart: {
    alignItems: 'flex-end',
    flexDirection: 'row',
    gap: spacing.sm,
    height: 66,
    justifyContent: 'center',
  },
  lineBar: {
    backgroundColor: colors.primary,
    borderRadius: 6,
    width: 10,
  },
  metricCard: {
    alignItems: 'center',
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.lg,
    minHeight: 142,
  },
  metricCopy: {
    alignItems: 'flex-start',
    flexDirection: 'row',
    flex: 1,
    gap: spacing.md,
    minWidth: 180,
  },
  metricIcon: {
    color: colors.primaryDark,
    fontSize: 22,
    fontWeight: '700',
    lineHeight: 26,
  },
  metricLabel: {
    color: colors.text,
    fontSize: 17,
    fontWeight: '600',
    lineHeight: 22,
  },
  metricMeta: {
    color: colors.primary,
    fontSize: typography.sizes.caption,
    fontWeight: '600',
    lineHeight: 18,
    marginTop: spacing.xs,
  },
  metricPeriod: {
    color: colors.muted,
    fontSize: 14,
    lineHeight: 20,
  },
  metricText: {
    flex: 1,
    minWidth: 0,
  },
  metricValue: {
    color: colors.primaryDark,
    fontFamily: typography.displayFallback,
    fontSize: 34,
    lineHeight: 38,
    marginTop: spacing.sm,
  },
  safeArea: {
    backgroundColor: colors.background,
    flex: 1,
  },
  spark: {
    color: colors.primary,
    fontSize: 22,
    lineHeight: 24,
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
  weeklyBody: {
    color: colors.muted,
    fontSize: 15,
    lineHeight: 22,
    marginTop: spacing.sm,
  },
  weeklyCard: {
    padding: spacing.lg,
  },
  weeklyContent: {
    alignItems: 'center',
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.lg,
    marginTop: spacing.lg,
  },
  weeklyCopy: {
    flex: 1,
    minWidth: 190,
  },
  weeklyTitle: {
    color: colors.text,
    fontFamily: typography.displayFallback,
    fontSize: 28,
    lineHeight: 32,
  },
  unavailableBar: {
    backgroundColor: colors.border,
    height: 2,
    opacity: 0.85,
  },
  zeroBar: {
    backgroundColor: colors.surfaceStrong,
    opacity: 0.72,
  },
});
