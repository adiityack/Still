import type { ReactNode } from 'react';
import { Pressable, StyleSheet, Text, View, type PressableProps, type StyleProp, type ViewStyle } from 'react-native';

import { colors, radius, spacing, typography } from '@/config/theme';

type AppButtonProps = PressableProps & {
  iconAfter?: ReactNode;
  iconBefore?: ReactNode;
  label: string;
  size?: 'default' | 'compact';
  variant?: 'primary' | 'secondary' | 'outline';
};

export function AppButton({
  disabled,
  iconAfter,
  iconBefore,
  label,
  size = 'default',
  style,
  variant = 'primary',
  ...props
}: AppButtonProps) {
  return (
    <Pressable
      accessibilityRole="button"
      disabled={disabled}
      style={(state) => [
        styles.button,
        styles[variant],
        size === 'compact' && styles.compact,
        disabled && styles.disabled,
        state.pressed && styles.pressed,
        typeof style === 'function' ? style(state) : (style as StyleProp<ViewStyle>),
      ]}
      {...props}
    >
      {iconBefore ? <View style={styles.iconBefore}>{iconBefore}</View> : null}
      <Text style={[styles.label, variant !== 'primary' && styles.labelOnLight]}>{label}</Text>
      {iconAfter ? <View style={styles.iconAfter}>{iconAfter}</View> : null}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    alignItems: 'center',
    borderRadius: radius.md,
    borderWidth: 1,
    flexDirection: 'row',
    gap: spacing.sm,
    justifyContent: 'center',
    minHeight: 50,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
  },
  compact: {
    borderRadius: radius.md,
    minHeight: 44,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
  },
  disabled: {
    opacity: 0.5,
  },
  iconAfter: {
    marginLeft: spacing.sm,
  },
  iconBefore: {
    marginRight: spacing.xs,
  },
  label: {
    color: colors.onPrimary,
    fontSize: 15,
    fontWeight: '700',
    lineHeight: 20,
  },
  labelOnLight: {
    color: colors.primaryDark,
  },
  outline: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
  },
  primary: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  pressed: {
    opacity: 0.78,
  },
  secondary: {
    backgroundColor: colors.surfaceMuted,
    borderColor: colors.surfaceMuted,
  },
});
