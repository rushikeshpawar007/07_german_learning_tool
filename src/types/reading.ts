import type { CefrLevel } from './vocabulary';

export interface WordDefinition {
  word: string;
  baseForm: string;
  translation: string;
  partOfSpeech: string;
  contextNote?: string;
}

export interface ReadingStory {
  id: string;
  title: string;
  titleEn: string;
  level: CefrLevel;
  topic: string;
  description: string;
  paragraphs: string[];
  fullTranslation: string[];
  dictionary: WordDefinition[];
}
