import type { VocabWord, SituationSlug } from '@/types';
import workVocab from './work.json';
import smalltalkVocab from './smalltalk.json';
import healthcareVocab from './healthcare.json';
import meetingsVocab from './meetings.json';
import emailsVocab from './emails.json';
import travelVocab from './travel.json';
import shoppingVocab from './shopping.json';
import bureaucracyVocab from './bureaucracy.json';
import phoneVocab from './phone.json';
import housingVocab from './housing.json';

const allVocab: VocabWord[] = [
  ...(workVocab as VocabWord[]),
  ...(smalltalkVocab as VocabWord[]),
  ...(healthcareVocab as VocabWord[]),
  ...(meetingsVocab as VocabWord[]),
  ...(emailsVocab as VocabWord[]),
  ...(travelVocab as VocabWord[]),
  ...(shoppingVocab as VocabWord[]),
  ...(bureaucracyVocab as VocabWord[]),
  ...(phoneVocab as VocabWord[]),
  ...(housingVocab as VocabWord[]),
];

const vocabMap = new Map<string, VocabWord>(
  allVocab.map((w) => [w.id, w]),
);

export function getAllVocab(): VocabWord[] {
  return allVocab;
}

export function getVocabById(id: string): VocabWord | undefined {
  return vocabMap.get(id);
}

export function getVocabBySituation(slug: SituationSlug): VocabWord[] {
  return allVocab.filter((w) => w.situations.includes(slug));
}
