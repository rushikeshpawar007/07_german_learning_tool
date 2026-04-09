import type { UserProgress } from '@/types';
import { STORAGE_KEYS } from './constants';
import { migrateProgress } from './migration';

function createDefaultProgress(): UserProgress {
  return {
    version: 2,
    wordsProgress: {},
    sentencesProgress: {},
    vocabQuizLog: [],
    weakAreas: [],
    lastSessionDate: Date.now(),
    totalPracticeTime: 0,
    streak: {
      currentStreak: 0,
      longestStreak: 0,
      lastActiveDate: '',
      streakFreezes: 0,
    },
    dailyGoals: {},
  };
}

export function loadProgress(): UserProgress {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.PROGRESS);
    if (!raw) return createDefaultProgress();

    const parsed = JSON.parse(raw) as UserProgress;
    return migrateProgress(parsed);
  } catch {
    return createDefaultProgress();
  }
}

export function saveProgress(progress: UserProgress): void {
  try {
    localStorage.setItem(STORAGE_KEYS.PROGRESS, JSON.stringify(progress));
  } catch {
    console.warn('Failed to save progress to localStorage');
  }
}

export function resetProgress(): void {
  localStorage.removeItem(STORAGE_KEYS.PROGRESS);
}
