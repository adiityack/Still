import * as IntentLauncher from 'expo-intent-launcher';
import { requireOptionalNativeModule } from 'expo';
import { PermissionsAndroid, Platform } from 'react-native';

const STILL_ANDROID_PACKAGE = 'com.still.app';

export type AndroidPermissionState = {
  accessibilityEnabled: boolean;
  checkedAt: string;
  nativeModuleAvailable: boolean;
  notificationsGranted: boolean;
  overlayGranted: boolean;
  platformSupported: boolean;
  usageAccessGranted: boolean;
};

type NativePermissionState = Pick<
  AndroidPermissionState,
  'accessibilityEnabled' | 'notificationsGranted' | 'overlayGranted' | 'usageAccessGranted'
>;

type StillPermissionsNativeModule = {
  getPermissionState(): Promise<NativePermissionState>;
};

const nativeModule = requireOptionalNativeModule<StillPermissionsNativeModule>('StillPermissions');

export async function getAndroidPermissionState(): Promise<AndroidPermissionState> {
  const checkedAt = new Date().toISOString();

  if (Platform.OS !== 'android') {
    return unavailableState(checkedAt, false);
  }

  if (!nativeModule) {
    return unavailableState(checkedAt, true);
  }

  const state = await nativeModule.getPermissionState();

  return {
    ...state,
    checkedAt,
    nativeModuleAvailable: true,
    platformSupported: true,
  };
}

export async function openUsageAccessSettings(): Promise<void> {
  if (Platform.OS !== 'android') {
    throw new Error('Usage Access settings are only available on Android.');
  }

  await IntentLauncher.startActivityAsync(IntentLauncher.ActivityAction.USAGE_ACCESS_SETTINGS);
}

export async function openOverlaySettings(): Promise<void> {
  assertAndroid('Display over other apps settings');

  await IntentLauncher.startActivityAsync(IntentLauncher.ActivityAction.MANAGE_OVERLAY_PERMISSION, {
    data: `package:${STILL_ANDROID_PACKAGE}`,
  });
}

export async function openNotificationSettings(): Promise<void> {
  assertAndroid('Notification settings');

  await IntentLauncher.startActivityAsync(IntentLauncher.ActivityAction.APP_NOTIFICATION_SETTINGS, {
    extra: { 'android.provider.extra.APP_PACKAGE': STILL_ANDROID_PACKAGE },
  });
}

export async function requestNotificationPermission(): Promise<boolean> {
  assertAndroid('Notification permission');

  if (Number(Platform.Version) < 33) {
    return true;
  }

  const result = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS, {
    buttonNegative: 'Not now',
    buttonPositive: 'Allow',
    message: 'STILL uses notifications for gentle session reminders you choose.',
    title: 'Allow notifications',
  });

  return result === PermissionsAndroid.RESULTS.GRANTED;
}

function assertAndroid(capability: string) {
  if (Platform.OS !== 'android') {
    throw new Error(`${capability} is only available on Android.`);
  }
}

function unavailableState(checkedAt: string, platformSupported: boolean): AndroidPermissionState {
  return {
    accessibilityEnabled: false,
    checkedAt,
    nativeModuleAvailable: false,
    notificationsGranted: false,
    overlayGranted: false,
    platformSupported,
    usageAccessGranted: false,
  };
}
