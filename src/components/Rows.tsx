import type { ReactNode } from 'react';
import { Pressable, StyleSheet, Text, View, type PressableProps, type StyleProp, type ViewStyle } from 'react-native';

import { colors, radius, shadows, spacing } from '@/config/theme';

type RowProps = PressableProps & {
  accessory?: ReactNode;
  icon?: ReactNode;
  style?: StyleProp<ViewStyle>;
  subtitle?: string;
  title: string;
};

export function SettingsRow({ accessory, icon, onPress, style, subtitle, title, ...props }: RowProps) {
  const content = (
    <>
      {icon ? <View style={styles.iconDisc}>{icon}</View> : null}
      <View style={styles.copy}>
        <Text style={styles.title}>{title}</Text>
        {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
      </View>
      {accessory ? <View style={styles.accessory}>{accessory}</View> : null}
    </>
  );

  if (onPress) {
    return (
      <Pressable
        accessibilityRole="button"
        onPress={onPress}
        style={(state) => [styles.row, state.pressed && styles.pressed, style]}
        {...props}
      >
        {content}
      </Pressable>
    );
  }

  return <View style={[styles.row, style]}>{content}</View>;
}

export const AppRow = SettingsRow;

export function Chevron() {
  return <Text style={styles.chevron}>›</Text>;
}

const styles = StyleSheet.create({
  accessory: {
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: spacing.md,
  },
  chevron: {
    color: colors.muted,
    fontSize: 28,
    lineHeight: 28,
  },
  copy: {
    flex: 1,
    gap: spacing.xs,
    marginLeft: spacing.md,
    minWidth: 0,
  },
  iconDisc: {
    alignItems: 'center',
    backgroundColor: colors.surfaceStrong,
    borderRadius: radius.pill,
    height: 44,
    justifyContent: 'center',
    width: 44,
  },
  pressed: {
    opacity: 0.78,
  },
  row: {
    ...shadows.card,
    alignItems: 'center',
    backgroundColor: colors.surfaceMuted,
    borderColor: colors.border,
    borderRadius: radius.lg,
    borderWidth: StyleSheet.hairlineWidth,
    flexDirection: 'row',
    minHeight: 72,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
  },
  subtitle: {
    color: colors.muted,
    flexShrink: 1,
    fontSize: 14,
    lineHeight: 20,
  },
  title: {
    color: colors.text,
    flexShrink: 1,
    fontSize: 17,
    fontWeight: '600',
    lineHeight: 22,
  },
});
