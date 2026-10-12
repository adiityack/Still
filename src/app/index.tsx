import { Redirect } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';

import { colors } from '@/config/theme';
import { OnboardingScreen } from '@/features/onboarding/OnboardingScreen';
import { getOnboardingCompleted } from '@/storage/onboardingStorage';

export default function IndexRoute() {
  const [hasCompletedOnboarding, setHasCompletedOnboarding] = useState<boolean | null>(null);

  useEffect(() => {
    let isMounted = true;

    getOnboardingCompleted()
      .then((completed) => {
        if (isMounted) {
          setHasCompletedOnboarding(completed);
        }
      })
      .catch(() => {
        if (isMounted) {
          setHasCompletedOnboarding(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, []);

  if (hasCompletedOnboarding === null) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator color={colors.primary} />
      </View>
    );
  }

  return hasCompletedOnboarding ? <Redirect href="/home" /> : <OnboardingScreen />;
}

const styles = StyleSheet.create({
  loading: {
    alignItems: 'center',
    backgroundColor: colors.background,
    flex: 1,
    justifyContent: 'center',
  },
});
