import AsyncStorage from '@react-native-async-storage/async-storage';

export type JsonStorageAdapter = {
  getBoolean(key: string): Promise<boolean | null>;
  getJson<T>(key: string, fallback: T): Promise<T>;
  remove(key: string): Promise<void>;
  setBoolean(key: string, value: boolean): Promise<void>;
  setJson<T>(key: string, value: T): Promise<void>;
};

export const asyncStorageAdapter: JsonStorageAdapter = {
  async getBoolean(key) {
    const value = await AsyncStorage.getItem(key);

    if (value === null) {
      return null;
    }

    return value === 'true';
  },
  async getJson<T>(key: string, fallback: T) {
    const value = await AsyncStorage.getItem(key);

    if (value === null) {
      return fallback;
    }

    return JSON.parse(value) as T;
  },
  remove(key) {
    return AsyncStorage.removeItem(key);
  },
  setBoolean(key, value) {
    return AsyncStorage.setItem(key, value ? 'true' : 'false');
  },
  setJson<T>(key: string, value: T) {
    return AsyncStorage.setItem(key, JSON.stringify(value));
  },
};
