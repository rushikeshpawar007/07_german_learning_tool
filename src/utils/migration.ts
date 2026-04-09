import type { UserProgress, WordProgress } from '@/types';

/** Migrates progress data from any version to version 2 */
export function migrateProgress(data: UserProgress): UserProgress {
  if (data.version === 2) return data;

  // Version 1 → 2: add SRS fields, streak, dailyGoals
  const migratedWords: Record<string, WordProgress> = {};

  for (const [id, wp] of Object.entries(data.wordsProgress)) {
    const accuracy = wp.practiceCount > 0 ? wp.correctCount / wp.practiceCount : 0;
    const easeBonus = Math.min(0.5, accuracy * 0.5);

    migratedWords[id] = {
      ...wp,
      easeFactor: wp.easeFactor ?? (2.5 + easeBonus),
      interval: wp.interval ?? 0,
      nextReviewDate: wp.nextReviewDate ?? (wp.seen ? Date.now() : undefined),
      reviewCount: wp.reviewCount ?? 0,
      lastQuality: wp.lastQuality ?? undefined,
    };
  }

  return {
    ...data,
    version: 2,
    wordsProgress: migratedWords,
    vocabQuizLog: data.vocabQuizLog ?? [],
    streak: data.streak ?? {
      currentStreak: 0,
      longestStreak: 0,
      lastActiveDate: '',
      streakFreezes: 0,
    },
    dailyGoals: data.dailyGoals ?? {},
  };
}
