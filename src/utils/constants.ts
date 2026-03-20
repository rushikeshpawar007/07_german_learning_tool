export const APP_NAME = 'Deutsch Lernen';

export const ROUTES = {
  HOME: '/',
  VOCABULARY: '/vocabulary',
  VOCABULARY_DETAIL: '/vocabulary/:id',
  SITUATIONS: '/situations',
  SITUATION_DETAIL: '/situations/:slug',
  BUILDER: '/builder',
  BUILDER_SENTENCE: '/builder/:sentenceId',
  GRAMMAR: '/grammar',
  GRAMMAR_DETAIL: '/grammar/:topicId',
  PERFEKT_VERBS: '/grammar/perfekt-verbs',
  READING: '/reading',
  READING_DETAIL: '/reading/:id',
  ACTIVITY_LOG: '/activity-log',
  VOCAB_QUIZ: '/vocab-quiz',
  DIALOGUES: '/dialogues',
  DIALOGUE_DETAIL: '/dialogues/:id',
} as const;

export const STORAGE_KEYS = {
  PROGRESS: 'german-app-progress',
  LEARNING_MODE: 'german-app-mode',
} as const;

export const ITEMS_PER_PAGE = 24;

export const GRAMMAR_CATEGORY_LABELS: Record<string, string> = {
  cases: 'Cases & Articles',
  'word-order': 'Word Order',
  verbs: 'Verb Forms',
  prepositions: 'Prepositions',
};
