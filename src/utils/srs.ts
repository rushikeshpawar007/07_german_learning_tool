import type { WordProgress, MasteryLevel, VocabWord } from '@/types';

const MS_PER_DAY = 86_400_000;

export interface SRSUpdate {
  easeFactor: number;
  interval: number;
  nextReviewDate: number;
  reviewCount: number;
  lastQuality: number;
}

/**
 * SM-2 variant spaced repetition algorithm.
 * quality: 0-5 scale
 *   0 = complete blackout
 *   1 = wrong answer
 *   2 = wrong but recognized after reveal
 *   3 = correct with serious difficulty
 *   4 = correct with hesitation
 *   5 = perfect instant recall
 */
export function calculateSRS(wp: WordProgress, quality: number): SRSUpdate {
  let easeFactor = wp.easeFactor ?? 2.5;
  let interval = wp.interval ?? 0;
  let reviewCount = wp.reviewCount ?? 0;

  if (quality >= 3) {
    // Passed
    if (reviewCount === 0) {
      interval = 1;
    } else if (reviewCount === 1) {
      interval = 6;
    } else {
      interval = Math.round(interval * easeFactor);
    }
    reviewCount += 1;
  } else {
    // Failed — reset interval but don't destroy ease factor
    reviewCount = 0;
    interval = 1;
  }

  // SM-2 ease factor adjustment
  easeFactor = easeFactor + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02));
  easeFactor = Math.max(1.3, easeFactor);

  const nextReviewDate = Date.now() + interval * MS_PER_DAY;

  return { easeFactor, interval, nextReviewDate, reviewCount, lastQuality: quality };
}

/** Maps flashcard Know/Don't Know to quality 0-5 */
export function qualityFromFlashcard(knew: boolean, hintUsed: boolean): number {
  if (!knew) return 1;
  if (hintUsed) return 3;
  return 4;
}

/** Maps sentence builder result to quality 0-5 */
export function qualityFromBuilder(correct: boolean, attempts: number): number {
  if (!correct) return 1;
  if (attempts > 2) return 3;
  if (attempts === 2) return 4;
  return 5;
}

/** Maps cloze result to quality 0-5 */
export function qualityFromCloze(correct: boolean, hintsUsed: number): number {
  if (!correct) return 1;
  if (hintsUsed > 1) return 3;
  if (hintsUsed === 1) return 4;
  return 5;
}

/** Returns vocab words due for review (nextReviewDate <= now), sorted most overdue first */
export function getWordsForReview(
  wordsProgress: Record<string, WordProgress>,
  allVocab: VocabWord[],
): VocabWord[] {
  const now = Date.now();
  const vocabMap = new Map(allVocab.map((v) => [v.id, v]));

  const dueWords: { word: VocabWord; overdue: number }[] = [];

  for (const [id, wp] of Object.entries(wordsProgress)) {
    if (wp.nextReviewDate != null && wp.nextReviewDate <= now) {
      const word = vocabMap.get(id);
      if (word) {
        dueWords.push({ word, overdue: now - wp.nextReviewDate });
      }
    }
  }

  dueWords.sort((a, b) => b.overdue - a.overdue);
  return dueWords.map((d) => d.word);
}

/** Returns unseen words for today's new learning, prioritizing by situation variety */
export function getNewWordsForToday(
  wordsProgress: Record<string, WordProgress>,
  allVocab: VocabWord[],
  limit: number = 5,
): VocabWord[] {
  const unseen = allVocab.filter((v) => {
    const wp = wordsProgress[v.id];
    return !wp || (!wp.seen && wp.nextReviewDate == null);
  });

  // Spread across situations for variety
  const bySituation = new Map<string, VocabWord[]>();
  for (const word of unseen) {
    const sit = word.situations[0] ?? 'other';
    const list = bySituation.get(sit) ?? [];
    list.push(word);
    bySituation.set(sit, list);
  }

  const result: VocabWord[] = [];
  const situationQueues = [...bySituation.values()];
  let i = 0;
  while (result.length < limit && situationQueues.some((q) => q.length > 0)) {
    const queue = situationQueues[i % situationQueues.length]!;
    if (queue.length > 0) {
      result.push(queue.shift()!);
    }
    i++;
  }

  return result;
}

/** Computes mastery level from word progress */
export function getMasteryLevel(wp: WordProgress | undefined): MasteryLevel {
  if (!wp || wp.practiceCount === 0) return 'new';

  const accuracy = wp.practiceCount > 0 ? wp.correctCount / wp.practiceCount : 0;
  const interval = wp.interval ?? 0;
  const reviewCount = wp.reviewCount ?? 0;

  if (reviewCount >= 5 && accuracy >= 0.8 && interval > 21) return 'mastered';
  if (wp.practiceCount >= 3 && accuracy >= 0.5) return 'reviewing';
  return 'learning';
}

/** Returns today's date as "YYYY-MM-DD" */
export function getTodayString(): string {
  return new Date().toISOString().slice(0, 10);
}
