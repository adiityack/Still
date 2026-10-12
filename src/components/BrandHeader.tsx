import type { ReactNode } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { colors, radius, spacing, typography } from '@/config/theme';

type BrandHeaderProps = {
  action?: ReactNode;
  tagline?: string;
};

export function BrandHeader({ action, tagline = 'Use your phone. On purpose.' }: BrandHeaderProps) {
  return (
    <View style={styles.row}>
      <View style={styles.copy}>
        <Text style={styles.wordmark}>S T I L L</Text>
        {tagline ? <Text style={styles.tagline}>{tagline}</Text> : null}
      </View>
      {action ? <View style={styles.action}>{action}</View> : <DefaultProfile />}
    </View>
  );
}

function DefaultProfile() {
  return (
    <View accessibilityLabel="Profile" style={styles.profileButton}>
      <Text style={styles.profileGlyph}>O</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  action: {
    marginLeft: spacing.lg,
  },
  copy: {
    flex: 1,
  },
  profileButton: {
    alignItems: 'center',
    backgroundColor: colors.surfaceStrong,
    borderRadius: radius.pill,
    height: 56,
    justifyContent: 'center',
    width: 56,
  },
  profileGlyph: {
    color: colors.primaryDark,
    fontSize: 22,
    fontWeight: '700',
  },
  row: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  tagline: {
    color: colors.muted,
    fontSize: typography.sizes.body,
    lineHeight: 24,
    marginTop: spacing.xs,
  },
  wordmark: {
    color: colors.primaryDark,
    fontSize: typography.sizes.heading,
    letterSpacing: 8,
    lineHeight: 36,
  },
});
