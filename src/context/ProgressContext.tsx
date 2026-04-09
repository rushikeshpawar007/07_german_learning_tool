import { createContext, useContext, useState, useCallback, useEffect, useRef } from 'react';
import type { ReactNode } from 'react';
import type { UserProgress, WordProgress, SentenceProgress, VocabQuizResult, DailyGoal } from '@/types';
import { loadProgress, saveProgress } from '@/utils/storage';
import { calculateSRS, getTodayString } from '@/utils/srs';

const DEFAULT_DAILY_TARGET = { targetWords: 10, targetSentences: 3, targetCloze: 3 };

interface ProgressContextValue {
  progress: UserProgress;
  markWordSeen: (vocabId: string) => void;
  recordWordPractice: (vocabId: string, correct: boolean, quality?: number, mistake?: string) => void;
  recordSentenceAttempt: (sentenceId: string, correct: boolean, userAnswer: string, correctAnswer: string) => void;
  logVocabQuiz: (result: Omit<VocabQuizResult, 'timestamp'>) => void;
  getWordProgress: (vocabId: string) => WordProgress | undefined;
  getSentenceProgress: (sentenceId: string) => SentenceProgress | undefined;
  resetAllProgress: () => void;
  updateStreak: () => void;
  recordDailyGoalProgress: (type: 'word' | 'sentence' | 'cloze') => void;
  getDailyGoal: () => DailyGoal;
}

const ProgressContext = createContext<ProgressContextValue | null>(null);

function computeStreak(
  prev: UserProgress,
  today: string,
): UserProgress['streak'] {
  const streak = prev.streak ?? {
    currentStreak: 0,
    longestStreak: 0,
    lastActiveDate: '',
    streakFreezes: 0,
  };

  if (streak.lastActiveDate === today) return streak;

  const lastDate = streak.lastActiveDate ? new Date(streak.lastActiveDate) : null;
  const todayDate = new Date(today);
  const diffDays = lastDate
    ? Math.round((todayDate.getTime() - lastDate.getTime()) / 86_400_000)
    : 0;

  let newStreak = streak.currentStreak;
  let freezes = streak.streakFreezes;

  if (!lastDate || diffDays <= 0) {
    // First ever activity
    newStreak = 1;
  } else if (diffDays === 1) {
    // Consecutive day
    newStreak += 1;
  } else if (diffDays === 2 && freezes > 0) {
    // Missed one day, use a freeze
    freezes -= 1;
    newStreak += 1;
  } else {
    // Streak broken
    newStreak = 1;
  }

  // Award freezes at milestones
  if (newStreak === 7 || newStreak === 14 || newStreak === 30 || newStreak === 60) {
    freezes += 1;
  }

  const longestStreak = Math.max(streak.longestStreak, newStreak);

  return {
    currentStreak: newStreak,
    longestStreak,
    lastActiveDate: today,
    streakFreezes: freezes,
  };
}

export function ProgressProvider({ children }: { children: ReactNode }) {
  const [progress, setProgress] = useState<UserProgress>(loadProgress);
  const saveTimeout = useRef<ReturnType<typeof setTimeout>>(undefined);

  useEffect(() => {
    clearTimeout(saveTimeout.current);
    saveTimeout.current = setTimeout(() => {
      saveProgress(progress);
    }, 500);
    return () => clearTimeout(saveTimeout.current);
  }, [progress]);

  const updateStreak = useCallback(() => {
    const today = getTodayString();
    setProgress((prev) => ({
      ...prev,
      streak: computeStreak(prev, today),
    }));
  }, []);

  const recordDailyGoalProgress = useCallback((type: 'word' | 'sentence' | 'cloze') => {
    const today = getTodayString();
    setProgress((prev) => {
      const goals = prev.dailyGoals ?? {};
      const existing = goals[today] ?? {
        date: today,
        wordsReviewed: 0,
        sentencesBuilt: 0,
        clozeCompleted: 0,
        ...DEFAULT_DAILY_TARGET,
      };

      const updated = { ...existing };
      if (type === 'word') updated.wordsReviewed += 1;
      else if (type === 'sentence') updated.sentencesBuilt += 1;
      else if (type === 'cloze') updated.clozeCompleted += 1;

      return {
        ...prev,
        dailyGoals: { ...goals, [today]: updated },
      };
    });
  }, []);

  const getDailyGoal = useCallback((): DailyGoal => {
    const today = getTodayString();
    const goals = progress.dailyGoals ?? {};
    return goals[today] ?? {
      date: today,
      wordsReviewed: 0,
      sentencesBuilt: 0,
      clozeCompleted: 0,
      ...DEFAULT_DAILY_TARGET,
    };
  }, [progress.dailyGoals]);

  const markWordSeen = useCallback((vocabId: string) => {
    setProgress((prev) => ({
      ...prev,
      wordsProgress: {
        ...prev.wordsProgress,
        [vocabId]: {
          ...prev.wordsProgress[vocabId],
          vocabId,
          seen: true,
          practiceCount: prev.wordsProgress[vocabId]?.practiceCount ?? 0,
          correctCount: prev.wordsProgress[vocabId]?.correctCount ?? 0,
          mistakes: prev.wordsProgress[vocabId]?.mistakes ?? [],
        },
      },
    }));
  }, []);

  const recordWordPractice = useCallback(
    (vocabId: string, correct: boolean, quality?: number, mistake?: string) => {
      const effectiveQuality = quality ?? (correct ? 4 : 1);

      setProgress((prev) => {
        const existing = prev.wordsProgress[vocabId];
        const srsUpdate = calculateSRS(existing ?? { vocabId, seen: false, practiceCount: 0, correctCount: 0, mistakes: [] }, effectiveQuality);

        const updated: WordProgress = {
          vocabId,
          seen: true,
          practiceCount: (existing?.practiceCount ?? 0) + 1,
          correctCount: (existing?.correctCount ?? 0) + (correct ? 1 : 0),
          lastPracticed: Date.now(),
          mistakes: mistake
            ? [...(existing?.mistakes ?? []), mistake]
            : existing?.mistakes ?? [],
          easeFactor: srsUpdate.easeFactor,
          interval: srsUpdate.interval,
          nextReviewDate: srsUpdate.nextReviewDate,
          reviewCount: srsUpdate.reviewCount,
          lastQuality: srsUpdate.lastQuality,
        };

        return {
          ...prev,
          wordsProgress: { ...prev.wordsProgress, [vocabId]: updated },
          streak: computeStreak(prev, getTodayString()),
        };
      });
    },
    [],
  );

  const recordSentenceAttempt = useCallback(
    (sentenceId: string, correct: boolean, userAnswer: string, correctAnswer: string) => {
      setProgress((prev) => {
        const existing = prev.sentencesProgress[sentenceId];
        const newAttempt = {
          timestamp: Date.now(),
          userAnswer,
          correct,
          correctAnswer,
        };
        return {
          ...prev,
          sentencesProgress: {
            ...prev.sentencesProgress,
            [sentenceId]: {
              sentenceId,
              attempted: true,
              completedCorrectly: correct || (existing?.completedCorrectly ?? false),
              attempts: (existing?.attempts ?? 0) + 1,
              lastAttempted: Date.now(),
              mistakes: existing?.mistakes ?? [],
              attemptHistory: [...(existing?.attemptHistory ?? []), newAttempt],
            },
          },
          streak: computeStreak(prev, getTodayString()),
        };
      });
    },
    [],
  );

  const getWordProgress = useCallback(
    (vocabId: string) => progress.wordsProgress[vocabId],
    [progress],
  );

  const getSentenceProgress = useCallback(
    (sentenceId: string) => progress.sentencesProgress[sentenceId],
    [progress],
  );

  const logVocabQuiz = useCallback(
    (result: Omit<VocabQuizResult, 'timestamp'>) => {
      setProgress((prev) => ({
        ...prev,
        vocabQuizLog: [
          ...(prev.vocabQuizLog ?? []),
          { ...result, timestamp: Date.now() },
        ],
        streak: computeStreak(prev, getTodayString()),
      }));
    },
    [],
  );

  const resetAllProgress = useCallback(() => {
    setProgress({
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
    });
  }, []);

  return (
    <ProgressContext.Provider
      value={{
        progress,
        markWordSeen,
        recordWordPractice,
        recordSentenceAttempt,
        logVocabQuiz,
        getWordProgress,
        getSentenceProgress,
        resetAllProgress,
        updateStreak,
        recordDailyGoalProgress,
        getDailyGoal,
      }}
    >
      {children}
    </ProgressContext.Provider>
  );
}

export function useProgressContext(): ProgressContextValue {
  const context = useContext(ProgressContext);
  if (!context) {
    throw new Error('useProgressContext must be used within a ProgressProvider');
  }
  return context;
}
