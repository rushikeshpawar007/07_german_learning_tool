import type { Sentence, WordRole } from '@/types';

export interface ClozeBlank {
  index: number;
  answer: string;
  role: WordRole;
  hint: string;
}

export interface ClozeExercise {
  sentenceId: string;
  displayWords: (string | ClozeBlank)[];
  blanks: ClozeBlank[];
  fullSentence: string;
  translation: string;
}

const BLANKABLE_ROLES: WordRole[] = ['verb', 'object', 'preposition', 'adverb'];
const SKIP_ROLES: WordRole[] = ['article', 'conjunction', 'particle'];

function generateHint(word: string): string {
  if (word.length <= 1) return '_';
  return word[0] + '_'.repeat(word.length - 1);
}

/** Normalizes German text for comparison (handles ß/ss, umlauts) */
export function normalizeGerman(text: string): string {
  return text
    .toLowerCase()
    .replace(/ß/g, 'ss')
    .replace(/ä/g, 'ae')
    .replace(/ö/g, 'oe')
    .replace(/ü/g, 'ue')
    .replace(/[.,!?;:]/g, '')
    .trim();
}

/** Checks if user answer matches the correct answer (flexible matching) */
export function checkClozeAnswer(userAnswer: string, correctAnswer: string): boolean {
  const normalizedUser = normalizeGerman(userAnswer);
  const normalizedCorrect = normalizeGerman(correctAnswer);
  if (normalizedUser === normalizedCorrect) return true;

  // Also accept the exact original (case-insensitive, punctuation-stripped)
  const simpleUser = userAnswer.toLowerCase().replace(/[.,!?;:]/g, '').trim();
  const simpleCorrect = correctAnswer.toLowerCase().replace(/[.,!?;:]/g, '').trim();
  return simpleUser === simpleCorrect;
}

/** Generates a cloze exercise from a sentence */
export function generateCloze(sentence: Sentence, blankCount?: number): ClozeExercise {
  const words = sentence.words;
  const targetBlanks = blankCount ?? (words.length < 5 ? 1 : 2);

  // Find blankable word indices, preferring grammatically meaningful roles
  const candidates: { index: number; priority: number }[] = [];
  for (let i = 0; i < words.length; i++) {
    const word = words[i]!;
    if (SKIP_ROLES.includes(word.role)) continue;
    const priority = BLANKABLE_ROLES.includes(word.role) ? 2 : 1;
    candidates.push({ index: i, priority });
  }

  // Sort by priority (higher first), then shuffle within same priority
  candidates.sort((a, b) => {
    if (b.priority !== a.priority) return b.priority - a.priority;
    return Math.random() - 0.5;
  });

  const blankIndices = new Set(
    candidates.slice(0, targetBlanks).map((c) => c.index),
  );

  const blanks: ClozeBlank[] = [];
  const displayWords: (string | ClozeBlank)[] = [];

  for (let i = 0; i < words.length; i++) {
    const word = words[i]!;
    if (blankIndices.has(i)) {
      const blank: ClozeBlank = {
        index: i,
        answer: word.text,
        role: word.role,
        hint: generateHint(word.text),
      };
      blanks.push(blank);
      displayWords.push(blank);
    } else {
      displayWords.push(word.text);
    }
  }

  return {
    sentenceId: sentence.id,
    displayWords,
    blanks,
    fullSentence: sentence.de,
    translation: sentence.en,
  };
}
