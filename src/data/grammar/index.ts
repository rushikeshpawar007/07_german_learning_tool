import type { GrammarLesson, GrammarCategory } from '@/types';

// Cases
import nominative from './nominative.json';
import accusative from './accusative.json';
import dative from './dative.json';
import genitive from './genitive.json';

// Word Order
import mainClause from './main-clause.json';
import subordinateClauses from './subordinate-clauses.json';
import questions from './questions.json';

// Verb Forms
import presentTense from './present-tense.json';
import perfekt from './perfekt.json';
import praeteritum from './praeteritum.json';
import modalVerbs from './modal-verbs.json';
import separableVerbs from './separable-verbs.json';
import reflexiveVerbs from './reflexive-verbs.json';
import konjunktivII from './konjunktiv-ii.json';

// Prepositions
import twoWayPrepositions from './two-way-prepositions.json';
import fixedPrepositions from './fixed-prepositions.json';

const allLessons: GrammarLesson[] = [
  nominative as GrammarLesson,
  accusative as GrammarLesson,
  dative as GrammarLesson,
  genitive as GrammarLesson,
  mainClause as GrammarLesson,
  subordinateClauses as GrammarLesson,
  questions as GrammarLesson,
  presentTense as GrammarLesson,
  perfekt as GrammarLesson,
  praeteritum as GrammarLesson,
  modalVerbs as GrammarLesson,
  separableVerbs as GrammarLesson,
  reflexiveVerbs as GrammarLesson,
  konjunktivII as GrammarLesson,
  twoWayPrepositions as GrammarLesson,
  fixedPrepositions as GrammarLesson,
];

const lessonMap = new Map<string, GrammarLesson>(
  allLessons.map((l) => [l.id, l]),
);

export function getAllGrammarLessons(): GrammarLesson[] {
  return allLessons;
}

export function getGrammarLessonById(id: string): GrammarLesson | undefined {
  return lessonMap.get(id);
}

export function getGrammarLessonsByCategory(category: GrammarCategory): GrammarLesson[] {
  return allLessons.filter((l) => l.category === category);
}
