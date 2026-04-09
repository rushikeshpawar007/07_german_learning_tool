import { useMemo, useState, useCallback } from 'react';
import type { VocabWord, Sentence } from '@/types';
import { useProgress } from '@/hooks/useProgress';
import { getAllVocab, getAllSentences } from '@/data';
import { getWordsForReview, getNewWordsForToday } from '@/utils/srs';
import { shuffle } from '@/utils/shuffle';

export type ReviewItemType = 'flashcard' | 'builder' | 'cloze';

export interface ReviewItem {
  type: ReviewItemType;
  vocabWord?: VocabWord;
  sentence?: Sentence;
  reason: string;
}

export function useReviewQueue() {
  const { progress, getDailyGoal } = useProgress();
  const allVocab = useMemo(() => getAllVocab(), []);
  const allSentences = useMemo(() => getAllSentences(), []);

  const queue = useMemo(() => {
    const items: ReviewItem[] = [];

    // 1. Words due for SRS review
    const dueWords = getWordsForReview(progress.wordsProgress, allVocab);
    for (const word of dueWords.slice(0, 10)) {
      items.push({ type: 'flashcard', vocabWord: word, reason: 'Due for review' });
    }

    // 2. Weak sentences (attempted but not completed correctly)
    const weakSentences = allSentences.filter((s) => {
      const sp = progress.sentencesProgress[s.id];
      return sp && sp.attempted && !sp.completedCorrectly;
    });
    for (const sentence of shuffle(weakSentences).slice(0, 3)) {
      items.push({ type: 'builder', sentence, reason: 'Needs practice' });
    }

    // 3. New words (if we have room)
    const newWords = getNewWordsForToday(progress.wordsProgress, allVocab, 5);
    for (const word of newWords) {
      items.push({ type: 'flashcard', vocabWord: word, reason: 'New word' });
    }

    // 4. Cloze exercises from sentences related to due words
    const dueWordSituations = new Set(dueWords.flatMap((w) => w.situations));
    const clozeSentences = allSentences.filter((s) => dueWordSituations.has(s.situation));
    for (const sentence of shuffle(clozeSentences).slice(0, 3)) {
      items.push({ type: 'cloze', sentence, reason: 'Fill in the blank' });
    }

    // Interleave: group into sets of [flashcard, flashcard, builder/cloze]
    const flashcards = items.filter((i) => i.type === 'flashcard');
    const exercises = items.filter((i) => i.type !== 'flashcard');

    const interleaved: ReviewItem[] = [];
    let fi = 0;
    let ei = 0;
    while (fi < flashcards.length || ei < exercises.length) {
      if (fi < flashcards.length) interleaved.push(flashcards[fi++]!);
      if (fi < flashcards.length) interleaved.push(flashcards[fi++]!);
      if (ei < exercises.length) interleaved.push(exercises[ei++]!);
    }

    return interleaved.slice(0, 20);
  }, [progress.wordsProgress, progress.sentencesProgress, allVocab, allSentences]);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [completedCount, setCompletedCount] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);

  const currentItem = queue[currentIndex] ?? null;
  const isComplete = currentIndex >= queue.length;
  const dailyGoal = getDailyGoal();
  const isGoalMet =
    dailyGoal.wordsReviewed >= dailyGoal.targetWords &&
    dailyGoal.sentencesBuilt >= dailyGoal.targetSentences;

  const advance = useCallback((wasCorrect?: boolean) => {
    setCompletedCount((c) => c + 1);
    if (wasCorrect) setCorrectCount((c) => c + 1);
    setCurrentIndex((i) => i + 1);
  }, []);

  const skip = useCallback(() => {
    setCurrentIndex((i) => i + 1);
  }, []);

  return {
    queue,
    currentItem,
    currentIndex,
    isComplete,
    advance,
    skip,
    dailyGoal,
    isGoalMet,
    stats: {
      completed: completedCount,
      remaining: Math.max(0, queue.length - currentIndex),
      total: queue.length,
      accuracy: completedCount > 0 ? correctCount / completedCount : 0,
    },
  };
}
