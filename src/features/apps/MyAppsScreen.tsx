import { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { BrandHeader, Chevron, SettingsRow, Toggle } from '@/components';
import { colors, spacing, typography } from '@/config/theme';
import type { TrackedApp } from '@/models';
import { localRepository } from '@/storage';

type ManagedApp = {
  defaultEnabled: boolean;
  icon: string;
  id: string;
  name: string;
  summary: string;
};

const managedApps: ManagedApp[] = [
  {
    defaultEnabled: true,
    icon: '◎',
    id: 'com.instagram.android',
    name: 'Instagram',
    summary: 'Ask before opening · Reel reminders on',
  },
  {
    defaultEnabled: true,
    icon: '▶',
    id: 'com.google.android.youtube',
    name: 'YouTube',
    summary: 'Ask before opening · Time check 10 min',
  },
  {
    defaultEnabled: false,
    icon: 'X',
    id: 'com.twitter.android',
    name: 'X',
    summary: 'Ask before opening · Time check 10 min',
  },
  {
    defaultEnabled: true,
    icon: 'R',
    id: 'com.reddit.frontpage',
    name: 'Reddit',
    summary: 'Ask before opening · Gentle reminders',
  },
];

export function MyAppsScreen() {
  const [trackedApps, setTrackedApps] = useState(() => buildDefaultTrackedApps());

  useEffect(() => {
    let isMounted = true;

    localRepository.getTrackedApps().then((savedApps) => {
      if (!isMounted || savedApps.length === 0) {
        return;
      }

      setTrackedApps(mergeTrackedApps(savedApps));
    });

    return () => {
      isMounted = false;
    };
  }, []);

  const setAppEnabled = (id: string, enabled: boolean) => {
    setTrackedApps((current) => {
      const now = new Date().toISOString();
      const next = current.map((app) => {
        if (app.id !== id) {
          return app;
        }

        return {
          ...app,
          enabled,
          promptOnOpen: enabled,
          reminderEnabled: enabled,
          updatedAt: now,
        };
      });

      void localRepository.setTrackedApps(next);
      return next;
    });
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <BrandHeader />

        <View style={styles.hero}>
          <Text style={styles.title}>My Apps</Text>
          <Text style={styles.subtitle}>Choose where STILL checks in.</Text>
        </View>

        <View style={styles.list}>
          {managedApps.map((app) => (
            <SettingsRow
              accessory={
                <View style={styles.rowActions}>
                  <Toggle onChange={(value) => setAppEnabled(app.id, value)} value={isAppEnabled(trackedApps, app.id)} />
                  <Chevron />
                </View>
              }
              icon={<Text style={styles.appIcon}>{app.icon}</Text>}
              key={app.id}
              subtitle={app.summary}
              title={app.name}
            />
          ))}

          <SettingsRow
            accessory={<Chevron />}
            icon={<Text style={styles.addIcon}>+</Text>}
            subtitle="Choose from your installed apps"
            title="Add more apps"
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function buildDefaultTrackedApps(): TrackedApp[] {
  const now = new Date().toISOString();

  return managedApps.map((app) => ({
    defaultReminderDuration: 10,
    detectorSupport: app.id === 'com.instagram.android' ? 'unknown' : 'unsupported',
    enabled: app.defaultEnabled,
    id: app.id,
    name: app.name,
    promptOnOpen: app.defaultEnabled,
    reelCountingEnabled: false,
    reminderEnabled: app.defaultEnabled,
    updatedAt: now,
  }));
}

function mergeTrackedApps(savedApps: TrackedApp[]) {
  const savedById = new Map(savedApps.map((app) => [app.id, app]));

  return buildDefaultTrackedApps().map((fallbackApp) => savedById.get(fallbackApp.id) ?? fallbackApp);
}

function isAppEnabled(apps: TrackedApp[], id: string) {
  return apps.find((app) => app.id === id)?.enabled ?? false;
}

const styles = StyleSheet.create({
  addIcon: {
    color: colors.primaryDark,
    fontSize: 28,
    lineHeight: 32,
  },
  appIcon: {
    color: colors.primaryDark,
    fontSize: typography.sizes.body,
    fontWeight: '700',
    lineHeight: 22,
  },
  content: {
    gap: spacing.lg,
    paddingBottom: 132,
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.lg,
  },
  hero: {
    paddingTop: spacing.lg,
  },
  list: {
    gap: spacing.md,
    marginTop: spacing.md,
  },
  rowActions: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: spacing.sm,
  },
  safeArea: {
    backgroundColor: colors.background,
    flex: 1,
  },
  subtitle: {
    color: colors.muted,
    fontSize: 17,
    lineHeight: 26,
    marginTop: spacing.xs,
  },
  title: {
    color: colors.text,
    fontFamily: typography.displayFallback,
    fontSize: 36,
    lineHeight: 42,
    marginTop: spacing.xl,
  },
});
