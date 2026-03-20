export type WordGender = 'der' | 'die' | 'das';

export type WordClass =
  | 'noun'
  | 'verb'
  | 'adjective'
  | 'adverb'
  | 'preposition'
  | 'conjunction'
  | 'phrase';

export type CefrLevel = 'A2' | 'B1' | 'B2';

export type SituationSlug =
  | 'work'
  | 'meetings'
  | 'emails'
  | 'smalltalk'
  | 'travel'
  | 'healthcare'
  | 'shopping'
  | 'bureaucracy'
  | 'phone'
  | 'housing';

export type Tone = 'formal' | 'informal' | 'neutral';

export interface ConjugationSet {
  ich: string;
  du: string;
  er_sie_es: string;
  wir: string;
  ihr: string;
  sie_Sie: string;
}

export interface Conjugation {
  present?: ConjugationSet;
  past?: ConjugationSet;
  pastParticiple?: string;
  auxiliary?: 'haben' | 'sein';
}

export interface VocabExample {
  de: string;
  en: string;
  situation?: SituationSlug;
  tone?: Tone;
}

export interface VocabWord {
  id: string;
  word: string;
  baseForm: string;
  gender?: WordGender;
  plural?: string;
  wordClass: WordClass;
  level: CefrLevel;
  meaningEn: string;
  meaningDe?: string;
  situations: SituationSlug[];
  examples: VocabExample[];
  conjugation?: Conjugation;
  commonMistakes: string[];
  usageNotes: string[];
  relatedWords?: string[];
  tags?: string[];
}
