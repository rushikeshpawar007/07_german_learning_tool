export type MasteryLevel = 'new' | 'learning' | 'reviewing' | 'mastered';

export interface WordProgress {
  vocabId: string;
  seen: boolean;
  practiceCount: number;
  correctCount: number;
  lastPracticed?: number;
  mistakes: string[];
  // SRS fields
  easeFactor?: number;
  interval?: number;
  nextReviewDate?: number;
  reviewCount?: number;
  lastQuality?: number;
}

export interface SentenceAttempt {
  timestamp: number;
  userAnswer: string;
  correct: boolean;
  correctAnswer: string;
}

export interface SentenceProgress {
  sentenceId: string;
  attempted: boolean;
  completedCorrectly: boolean;
  attempts: number;
  lastAttempted?: number;
  mistakes: string[];
  attemptHistory: SentenceAttempt[];
}

export interface VocabQuizResult {
  timestamp: number;
  situation: string;
  totalWords: number;
  knownCount: number;
  unknownCount: number;
  knownWordIds: string[];
  unknownWordIds: string[];
}

export interface StreakData {
  currentStreak: number;
  longestStreak: number;
  lastActiveDate: string; // "YYYY-MM-DD"
  streakFreezes: number;
}

export interface DailyGoal {
  date: string; // "YYYY-MM-DD"
  wordsReviewed: number;
  sentencesBuilt: number;
  clozeCompleted: number;
  targetWords: number;
  targetSentences: number;
  targetCloze: number;
}

export interface UserProgress {
  version: 1 | 2;
  wordsProgress: Record<string, WordProgress>;
  sentencesProgress: Record<string, SentenceProgress>;
  vocabQuizLog: VocabQuizResult[];
  weakAreas: string[];
  lastSessionDate?: number;
  totalPracticeTime?: number;
  streak?: StreakData;
  dailyGoals?: Record<string, DailyGoal>;
}
