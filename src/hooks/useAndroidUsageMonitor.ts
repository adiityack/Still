import { useEffect } from 'react';
import { AppState } from 'react-native';

import { syncRecentAndroidAppSessions } from '@/services/monitoring/androidUsageMonitor';

export function useAndroidUsageMonitor() {
  useEffect(() => {
    void syncRecentAndroidAppSessions().catch(() => undefined);

    const subscription = AppState.addEventListener('change', (state) => {
      if (state === 'active') {
        void syncRecentAndroidAppSessions().catch(() => undefined);
      }
    });

    return () => subscription.remove();
  }, []);
}
