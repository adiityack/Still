import type { ReactNode } from 'react';
import { StyleSheet, Text, View, type StyleProp, type ViewStyle } from 'react-native';

import { colors, radius, shadows, spacing, typography } from '@/config/theme';

type CardProps = {
  children: ReactNode;
  padded?: boolean;
  style?: StyleProp<ViewStyle>;
  tone?: 'surface' | 'muted' | 'strong';
};

type MetricCardProps = {
  icon?: ReactNode;
  label: string;
  meta?: string;
  value: string;
};

export function Card({ children, padded = true, style, tone = 'muted' }: CardProps) {
  return <View style={[styles.card, styles[tone], padded && styles.padded, style]}>{children}</View>;
}

export function IconDisc({ children }: { children?: ReactNode }) {
  return <View style={styles.iconDisc}>{children ?? <View style={styles.iconDot} />}</View>;
}

export function MetricCard({ icon, label, meta, value }: MetricCardProps) {
  return (
    <Card style={styles.metricCard}>
      <IconDisc>{icon}</IconDisc>
      <Text style={styles.metricLabel}>{label}</Text>
      <Text style={styles.metricValue}>{value}</Text>
      {meta ? <Text style={styles.metricMeta}>{meta}</Text> : null}
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    ...shadows.card,
    borderColor: colors.border,
    borderRadius: radius.lg,
    borderWidth: StyleSheet.hairlineWidth,
  },
  iconDisc: {
    alignItems: 'center',
    backgroundColor: colors.surfaceStrong,
    borderRadius: radius.pill,
    height: 56,
    justifyContent: 'center',
    width: 56,
  },
  iconDot: {
    borderColor: colors.primaryDark,
    borderRadius: radius.pill,
    borderWidth: 2,
    height: 20,
    width: 20,
  },
  metricCard: {
    flexBasis: '47%',
    flexGrow: 1,
    minHeight: 150,
  },
  metricLabel: {
    color: colors.text,
    fontSize: typography.sizes.body,
    fontWeight: '700',
    lineHeight: 22,
    marginTop: spacing.lg,
  },
  metricMeta: {
    color: colors.primary,
    fontSize: typography.sizes.caption,
    fontWeight: '600',
    lineHeight: 19,
    marginTop: spacing.xs,
  },
  metricValue: {
    color: colors.primaryDark,
    fontFamily: typography.displayFallback,
    fontSize: typography.sizes.heading,
    lineHeight: 36,
    marginTop: spacing.sm,
  },
  muted: {
    backgroundColor: colors.surfaceMuted,
  },
  padded: {
    padding: spacing.lg,
  },
  strong: {
    backgroundColor: colors.surfaceStrong,
  },
  surface: {
    backgroundColor: colors.surface,
  },
});
