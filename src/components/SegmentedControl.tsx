import { Pressable, StyleSheet, Text, View } from 'react-native';

import { colors, radius, spacing } from '@/config/theme';

type Segment = {
  label: string;
  value: string;
};

type SegmentedControlProps = {
  onChange?: (value: string) => void;
  options: Segment[];
  value: string;
};

export function SegmentedControl({ onChange, options, value }: SegmentedControlProps) {
  return (
    <View style={styles.container}>
      {options.map((option) => {
        const selected = option.value === value;

        return (
          <Pressable
            accessibilityRole="button"
            accessibilityState={{ selected }}
            key={option.value}
            onPress={() => onChange?.(option.value)}
            style={[styles.segment, selected && styles.segmentSelected]}
          >
            <Text style={[styles.label, selected && styles.labelSelected]}>{option.label}</Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  label: {
    color: colors.text,
    fontSize: 15,
    lineHeight: 20,
    textAlign: 'center',
  },
  labelSelected: {
    color: colors.onPrimary,
    fontWeight: '700',
  },
  segment: {
    alignItems: 'center',
    backgroundColor: colors.surfaceStrong,
    borderRadius: radius.pill,
    flex: 1,
    justifyContent: 'center',
    minHeight: 40,
    paddingHorizontal: spacing.md,
  },
  segmentSelected: {
    backgroundColor: colors.primary,
  },
});
