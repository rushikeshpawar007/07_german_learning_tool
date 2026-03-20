export interface WordProgress {
  vocabId: string;
  seen: boolean;
  practiceCount: number;
  correctCount: number;
  lastPracticed?: number;
  mistakes: string[];
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

export interface UserProgress {
  version: 1;
  wordsProgress: Record<string, WordProgress>;
  sentencesProgress: Record<string, SentenceProgress>;
  vocabQuizLog: VocabQuizResult[];
  weakAreas: string[];
  lastSessionDate?: number;
  totalPracticeTime?: number;
}
