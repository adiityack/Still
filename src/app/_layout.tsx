import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

import { colors } from '@/config/theme';
import { useAndroidUsageMonitor } from '@/hooks/useAndroidUsageMonitor';

export default function RootLayout() {
  useAndroidUsageMonitor();

  return (
    <>
      <Stack
        screenOptions={{
          headerShown: false,
          headerStyle: {
            backgroundColor: colors.background,
          },
          headerShadowVisible: false,
          headerTintColor: colors.text,
          headerTitleStyle: {
            fontWeight: '700',
          },
          contentStyle: {
            backgroundColor: colors.background,
          },
        }}
      />
      <StatusBar style="dark" />
    </>
  );
}
