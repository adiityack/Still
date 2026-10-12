import { Pressable, StyleSheet, View } from 'react-native';

import { colors, radius } from '@/config/theme';

type ToggleProps = {
  disabled?: boolean;
  onChange?: (value: boolean) => void;
  value: boolean;
};

export function Toggle({ disabled = false, onChange, value }: ToggleProps) {
  return (
    <Pressable
      accessibilityRole="switch"
      accessibilityState={{ checked: value, disabled }}
      disabled={disabled}
      onPress={() => onChange?.(!value)}
      style={[styles.track, value ? styles.trackOn : styles.trackOff, disabled && styles.disabled]}
    >
      <View style={[styles.thumb, value ? styles.thumbOn : styles.thumbOff]} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  disabled: {
    opacity: 0.55,
  },
  thumb: {
    backgroundColor: colors.surface,
    borderRadius: radius.pill,
    height: 30,
    width: 30,
  },
  thumbOff: {
    transform: [{ translateX: 3 }],
  },
  thumbOn: {
    transform: [{ translateX: 31 }],
  },
  track: {
    borderRadius: radius.pill,
    height: 36,
    justifyContent: 'center',
    width: 64,
  },
  trackOff: {
    backgroundColor: colors.border,
  },
  trackOn: {
    backgroundColor: colors.primary,
  },
});
