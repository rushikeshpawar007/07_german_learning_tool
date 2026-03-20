import { createContext, useContext, useState, useCallback, useEffect, useRef } from 'react';
import type { ReactNode } from 'react';
import type { UserProgress, WordProgress, SentenceProgress, VocabQuizResult } from '@/types';
import { loadProgress, saveProgress } from '@/utils/storage';

interface ProgressContextValue {
  progress: UserProgress;
  markWordSeen: (vocabId: string) => void;
  recordWordPractice: (vocabId: string, correct: boolean, mistake?: string) => void;
  recordSentenceAttempt: (sentenceId: string, correct: boolean, userAnswer: string, correctAnswer: string) => void;
  logVocabQuiz: (result: Omit<VocabQuizResult, 'timestamp'>) => void;
  getWordProgress: (vocabId: string) => WordProgress | undefined;
  getSentenceProgress: (sentenceId: string) => SentenceProgress | undefined;
  resetAllProgress: () => void;
}

const ProgressContext = createContext<ProgressContextValue | null>(null);

export function ProgressProvider({ children }: { children: ReactNode }) {
  const [progress, setProgress] = useState<UserProgress>(loadProgress);
  const saveTimeout = useRef<ReturnType<typeof setTimeout>>(undefined);

  // Debounced save to localStorage
  useEffect(() => {
    clearTimeout(saveTimeout.current);
    saveTimeout.current = setTimeout(() => {
      saveProgress(progress);
    }, 500);
    return () => clearTimeout(saveTimeout.current);
  }, [progress]);

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
    (vocabId: string, correct: boolean, mistake?: string) => {
      setProgress((prev) => {
        const existing = prev.wordsProgress[vocabId];
        return {
          ...prev,
          wordsProgress: {
            ...prev.wordsProgress,
            [vocabId]: {
              vocabId,
              seen: true,
              practiceCount: (existing?.practiceCount ?? 0) + 1,
              correctCount: (existing?.correctCount ?? 0) + (correct ? 1 : 0),
              lastPracticed: Date.now(),
              mistakes: mistake
                ? [...(existing?.mistakes ?? []), mistake]
                : existing?.mistakes ?? [],
            },
          },
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
      }));
    },
    [],
  );

  const resetAllProgress = useCallback(() => {
    setProgress({
      version: 1,
      wordsProgress: {},
      sentencesProgress: {},
      vocabQuizLog: [],
      weakAreas: [],
      lastSessionDate: Date.now(),
      totalPracticeTime: 0,
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
