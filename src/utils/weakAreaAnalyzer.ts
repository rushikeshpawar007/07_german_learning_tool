import type { WordProgress, SentenceProgress, VocabWord, Sentence } from '@/types';

export interface WeakArea {
  category: string;
  description: string;
  wordIds: string[];
  sentenceIds: string[];
  severity: 'mild' | 'moderate' | 'severe';
  grammarTopicId?: string;
}

interface CategoryStats {
  total: number;
  errors: number;
  wordIds: string[];
  sentenceIds: string[];
}

/** Analyzes user progress to find weak areas */
export function analyzeWeakAreas(
  wordsProgress: Record<string, WordProgress>,
  sentencesProgress: Record<string, SentenceProgress>,
  allVocab: VocabWord[],
  allSentences: Sentence[],
): WeakArea[] {
  const vocabMap = new Map(allVocab.map((v) => [v.id, v]));
  const sentenceMap = new Map(allSentences.map((s) => [s.id, s]));

  // Analyze word class weaknesses
  const wordClassStats = new Map<string, CategoryStats>();
  for (const [id, wp] of Object.entries(wordsProgress)) {
    if (wp.practiceCount === 0) continue;
    const word = vocabMap.get(id);
    if (!word) continue;

    const key = word.wordClass;
    const stats = wordClassStats.get(key) ?? { total: 0, errors: 0, wordIds: [], sentenceIds: [] };
    stats.total += wp.practiceCount;
    stats.errors += wp.practiceCount - wp.correctCount;
    if (wp.correctCount / wp.practiceCount < 0.6) {
      stats.wordIds.push(id);
    }
    wordClassStats.set(key, stats);
  }

  // Analyze grammar point weaknesses from sentences
  const grammarStats = new Map<string, CategoryStats>();
  for (const [id, sp] of Object.entries(sentencesProgress)) {
    if (sp.attempts === 0) continue;
    const sentence = sentenceMap.get(id);
    if (!sentence) continue;

    for (const point of sentence.grammarPoints) {
      const stats = grammarStats.get(point) ?? { total: 0, errors: 0, wordIds: [], sentenceIds: [] };
      stats.total += sp.attempts;
      const failedAttempts = sp.attemptHistory.filter((a) => !a.correct).length;
      stats.errors += failedAttempts;
      if (!sp.completedCorrectly) {
        stats.sentenceIds.push(id);
      }
      grammarStats.set(point, stats);
    }
  }

  // Analyze situation-based weaknesses
  const situationStats = new Map<string, CategoryStats>();
  for (const [id, wp] of Object.entries(wordsProgress)) {
    if (wp.practiceCount === 0) continue;
    const word = vocabMap.get(id);
    if (!word) continue;

    for (const sit of word.situations) {
      const stats = situationStats.get(sit) ?? { total: 0, errors: 0, wordIds: [], sentenceIds: [] };
      stats.total += wp.practiceCount;
      stats.errors += wp.practiceCount - wp.correctCount;
      if (wp.correctCount / wp.practiceCount < 0.6) {
        stats.wordIds.push(id);
      }
      situationStats.set(sit, stats);
    }
  }

  const weakAreas: WeakArea[] = [];

  // Collect grammar weaknesses
  for (const [point, stats] of grammarStats) {
    if (stats.total < 2) continue;
    const errorRate = stats.errors / stats.total;
    if (errorRate < 0.3) continue;

    const severity = errorRate >= 0.6 ? 'severe' : errorRate >= 0.4 ? 'moderate' : 'mild';
    weakAreas.push({
      category: point,
      description: `You struggle with "${point}" — ${Math.round(errorRate * 100)}% error rate`,
      wordIds: stats.wordIds,
      sentenceIds: stats.sentenceIds,
      severity,
    });
  }

  // Collect word class weaknesses
  for (const [wc, stats] of wordClassStats) {
    if (stats.total < 3) continue;
    const errorRate = stats.errors / stats.total;
    if (errorRate < 0.35) continue;

    const severity = errorRate >= 0.6 ? 'severe' : errorRate >= 0.4 ? 'moderate' : 'mild';
    weakAreas.push({
      category: `${wc} vocabulary`,
      description: `${wc} words need more practice — ${stats.wordIds.length} words below 60% accuracy`,
      wordIds: stats.wordIds,
      sentenceIds: [],
      severity,
    });
  }

  // Sort by severity then error volume
  const severityOrder = { severe: 0, moderate: 1, mild: 2 };
  weakAreas.sort((a, b) => {
    const sDiff = severityOrder[a.severity] - severityOrder[b.severity];
    if (sDiff !== 0) return sDiff;
    return (b.wordIds.length + b.sentenceIds.length) - (a.wordIds.length + a.sentenceIds.length);
  });

  return weakAreas.slice(0, 5);
}
