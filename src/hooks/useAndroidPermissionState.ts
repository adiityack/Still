import { useCallback, useEffect, useState } from 'react';
import { AppState } from 'react-native';

import {
  getAndroidPermissionState,
  type AndroidPermissionState,
} from '@/services/permissions/androidPermissions';

export function useAndroidPermissionState() {
  const [permissionState, setPermissionState] = useState<AndroidPermissionState | null>(null);
  const [isCheckingPermissions, setIsCheckingPermissions] = useState(false);

  const refreshPermissionState = useCallback(async () => {
    setIsCheckingPermissions(true);

    try {
      const nextState = await getAndroidPermissionState();
      setPermissionState(nextState);
      return nextState;
    } finally {
      setIsCheckingPermissions(false);
    }
  }, []);

  useEffect(() => {
    void refreshPermissionState();

    const subscription = AppState.addEventListener('change', (state) => {
      if (state === 'active') {
        void refreshPermissionState();
      }
    });

    return () => subscription.remove();
  }, [refreshPermissionState]);

  return { isCheckingPermissions, permissionState, refreshPermissionState };
}
