import { Tabs } from 'expo-router';
import { StyleSheet, Text, type ColorValue } from 'react-native';

import { colors, radius, spacing, typography } from '@/config/theme';

type TabIconProps = {
  color: ColorValue;
  focused: boolean;
  glyph: string;
};

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.primaryDark,
        tabBarInactiveTintColor: colors.muted,
        tabBarLabelStyle: styles.label,
        tabBarStyle: styles.tabBar,
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, focused }) => <TabIcon color={color} focused={focused} glyph="⌂" />,
        }}
      />
      <Tabs.Screen
        name="my-apps"
        options={{
          title: 'My Apps',
          tabBarIcon: ({ color, focused }) => <TabIcon color={color} focused={focused} glyph="▦" />,
        }}
      />
      <Tabs.Screen
        name="insights"
        options={{
          title: 'Insights',
          tabBarIcon: ({ color, focused }) => <TabIcon color={color} focused={focused} glyph="▥" />,
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: 'Settings',
          tabBarIcon: ({ color, focused }) => <TabIcon color={color} focused={focused} glyph="⚙" />,
        }}
      />
    </Tabs>
  );
}

function TabIcon({ color, focused, glyph }: TabIconProps) {
  return <Text style={[styles.icon, { color }, focused && styles.iconFocused]}>{glyph}</Text>;
}

const styles = StyleSheet.create({
  icon: {
    fontSize: 28,
    lineHeight: 30,
  },
  iconFocused: {
    fontWeight: '800',
  },
  label: {
    fontSize: typography.sizes.caption,
    lineHeight: 18,
    paddingBottom: spacing.xs,
  },
  tabBar: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderTopLeftRadius: radius.xl,
    borderTopRightRadius: radius.xl,
    borderWidth: StyleSheet.hairlineWidth,
    height: 92,
    paddingBottom: spacing.md,
    paddingTop: spacing.md,
    position: 'absolute',
  },
});
