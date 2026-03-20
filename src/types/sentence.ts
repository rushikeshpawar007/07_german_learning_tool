import type { SituationSlug, CefrLevel, Tone } from './vocabulary';

export type WordRole =
  | 'subject'
  | 'verb'
  | 'object'
  | 'adverb'
  | 'preposition'
  | 'article'
  | 'conjunction'
  | 'particle'
  | 'other';

export interface SentenceWord {
  text: string;
  role: WordRole;
  grammarNote?: string;
}

export interface Sentence {
  id: string;
  de: string;
  en: string;
  situation: SituationSlug;
  level: CefrLevel;
  tone: Tone;
  words: SentenceWord[];
  grammarPoints: string[];
  vocabIds: string[];
  builderHints?: string[];
  alternatives?: string[];
}
