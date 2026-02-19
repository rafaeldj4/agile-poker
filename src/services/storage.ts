import type { AppStorage } from '../types';

const STORAGE_KEY = 'agilepoker_data';

const defaultStorage: AppStorage = {
  sessions: [],
  participants: [],
  stories: [],
  votes: [],
  activeSessionId: null,
  activeStoryId: null,
};

export const storageService = {
  load(): AppStorage {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return { ...defaultStorage };
      return { ...defaultStorage, ...JSON.parse(raw) };
    } catch {
      return { ...defaultStorage };
    }
  },

  save(data: AppStorage): void {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch (e) {
      console.error('Failed to persist data:', e);
    }
  },

  clear(): void {
    localStorage.removeItem(STORAGE_KEY);
  },
};
