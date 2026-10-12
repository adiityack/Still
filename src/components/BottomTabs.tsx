import type { ReactNode } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { colors, radius, spacing, typography } from '@/config/theme';

type BottomTabItem = {
  icon?: ReactNode;
  key: string;
  label: string;
};

type BottomTabsProps = {
  activeKey: string;
  items: BottomTabItem[];
  onChange?: (key: string) => void;
};

export function BottomTabs({ activeKey, items, onChange }: BottomTabsProps) {
  return (
    <View style={styles.container}>
      {items.map((item) => {
        const selected = item.key === activeKey;

        return (
          <Pressable
            accessibilityRole="tab"
            accessibilityState={{ selected }}
            key={item.key}
            onPress={() => onChange?.(item.key)}
            style={styles.tab}
          >
            <View style={styles.iconSlot}>{item.icon}</View>
            <Text style={[styles.label, selected && styles.labelSelected]}>{item.label}</Text>
            <View style={[styles.dot, selected && styles.dotSelected]} />
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: radius.xl,
    borderWidth: StyleSheet.hairlineWidth,
    flexDirection: 'row',
    justifyContent: 'space-around',
    minHeight: 92,
    paddingHorizontal: spacing.sm,
    paddingTop: spacing.md,
  },
  dot: {
    backgroundColor: 'transparent',
    borderRadius: radius.pill,
    height: 8,
    marginTop: spacing.sm,
    width: 8,
  },
  dotSelected: {
    backgroundColor: colors.primary,
  },
  iconSlot: {
    alignItems: 'center',
    height: 28,
    justifyContent: 'center',
    width: 36,
  },
  label: {
    color: colors.muted,
    fontSize: typography.sizes.caption,
    lineHeight: 18,
    textAlign: 'center',
  },
  labelSelected: {
    color: colors.text,
    fontWeight: '700',
  },
  tab: {
    alignItems: 'center',
    flex: 1,
    minHeight: 68,
  },
});
