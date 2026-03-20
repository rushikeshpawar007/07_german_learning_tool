export type GrammarTopic =
  | 'word-order'
  | 'verb-conjugation'
  | 'articles'
  | 'cases'
  | 'prepositions';

export interface GrammarFeedback {
  topic: GrammarTopic;
  message: string;
  correct: string;
  userAttempt: string;
  explanation: string;
}

export type GrammarCategory = 'cases' | 'word-order' | 'verbs' | 'prepositions';

export interface GrammarExample {
  correct: string;
  incorrect?: string;
  explanation: string;
}

export interface GrammarRule {
  title: string;
  explanation: string;
  examples: GrammarExample[];
}

export interface GrammarTable {
  title: string;
  headers: string[];
  rows: string[][];
}

export interface GrammarLesson {
  id: string;
  title: string;
  category: GrammarCategory;
  level: 'A2' | 'B1' | 'B2';
  description: string;
  whenToUse: string[];
  rules: GrammarRule[];
  tables: GrammarTable[];
  commonMistakes: GrammarExample[];
  tips: string[];
  relatedTopics?: string[];
  relatedSentenceIds?: string[];
}
