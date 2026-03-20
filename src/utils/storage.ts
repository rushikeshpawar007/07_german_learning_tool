import type { UserProgress } from '@/types';
import { STORAGE_KEYS } from './constants';

function createDefaultProgress(): UserProgress {
  return {
    version: 1,
    wordsProgress: {},
    sentencesProgress: {},
    vocabQuizLog: [],
    weakAreas: [],
    lastSessionDate: Date.now(),
    totalPracticeTime: 0,
  };
}

export function loadProgress(): UserProgress {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.PROGRESS);
    if (!raw) return createDefaultProgress();

    const parsed = JSON.parse(raw) as UserProgress;
    if (parsed.version !== 1) return createDefaultProgress();

    // Migrate: add vocabQuizLog if missing from older data
    if (!parsed.vocabQuizLog) parsed.vocabQuizLog = [];

    return parsed;
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
