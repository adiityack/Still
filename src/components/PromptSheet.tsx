import type { ReactNode } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { colors, radius, shadows, spacing, typography } from '@/config/theme';

type PromptSheetProps = {
  children: ReactNode;
  subtitle?: string;
  title: string;
};

export function PromptSheet({ children, subtitle, title }: PromptSheetProps) {
  return (
    <View style={styles.sheet}>
      <Text style={styles.wordmark}>S T I L L</Text>
      <Text style={styles.title}>{title}</Text>
      {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
      <View style={styles.content}>{children}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  content: {
    gap: spacing.md,
    marginTop: spacing.xl,
  },
  sheet: {
    ...shadows.card,
    backgroundColor: colors.surface,
    borderRadius: radius.xl,
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.xxl,
    width: '100%',
  },
  subtitle: {
    color: colors.muted,
    fontSize: typography.sizes.body,
    lineHeight: 24,
    marginTop: spacing.md,
    textAlign: 'center',
  },
  title: {
    color: colors.text,
    fontFamily: typography.displayFallback,
    fontSize: typography.sizes.heading,
    lineHeight: 38,
    marginTop: spacing.xl,
    textAlign: 'center',
  },
  wordmark: {
    color: colors.primary,
    fontSize: typography.sizes.body,
    letterSpacing: 8,
    lineHeight: 24,
    textAlign: 'center',
  },
});
