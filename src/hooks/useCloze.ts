import { useState, useMemo, useCallback } from 'react';
import type { Sentence } from '@/types';
import { generateCloze } from '@/utils/cloze';
import type { ClozeExercise } from '@/utils/cloze';

interface ClozeSession {
  exercises: ClozeExercise[];
  currentIndex: number;
  results: { correct: number; total: number }[];
  finished: boolean;
}

export function useCloze(sentences: Sentence[]) {
  const exercises = useMemo(
    () => sentences.map((s) => generateCloze(s)),
    [sentences],
  );

  const [session, setSession] = useState<ClozeSession>({
    exercises,
    currentIndex: 0,
    results: [],
    finished: false,
  });

  const currentExercise = session.exercises[session.currentIndex] ?? null;

  const recordResult = useCallback((blanksCorrect: number, blanksTotal: number) => {
    setSession((prev) => ({
      ...prev,
      results: [...prev.results, { correct: blanksCorrect, total: blanksTotal }],
    }));
  }, []);

  const nextExercise = useCallback(() => {
    setSession((prev) => {
      const next = prev.currentIndex + 1;
      if (next >= prev.exercises.length) {
        return { ...prev, finished: true };
      }
      return { ...prev, currentIndex: next };
    });
  }, []);

  const totalCorrect = session.results.reduce((sum, r) => sum + r.correct, 0);
  const totalBlanks = session.results.reduce((sum, r) => sum + r.total, 0);

  return {
    currentExercise,
    currentIndex: session.currentIndex,
    total: session.exercises.length,
    finished: session.finished,
    recordResult,
    nextExercise,
    accuracy: totalBlanks > 0 ? totalCorrect / totalBlanks : 0,
  };
}
