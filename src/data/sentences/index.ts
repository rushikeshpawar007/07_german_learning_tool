import type { Sentence, SituationSlug } from '@/types';
import workSentences from './work.json';
import smalltalkSentences from './smalltalk.json';
import healthcareSentences from './healthcare.json';
import meetingsSentences from './meetings.json';
import emailsSentences from './emails.json';
import travelSentences from './travel.json';
import shoppingSentences from './shopping.json';
import bureaucracySentences from './bureaucracy.json';
import phoneSentences from './phone.json';
import housingSentences from './housing.json';
import advancedSentences from './advanced.json';

const allSentences: Sentence[] = [
  ...(workSentences as Sentence[]),
  ...(smalltalkSentences as Sentence[]),
  ...(healthcareSentences as Sentence[]),
  ...(meetingsSentences as Sentence[]),
  ...(emailsSentences as Sentence[]),
  ...(travelSentences as Sentence[]),
  ...(shoppingSentences as Sentence[]),
  ...(bureaucracySentences as Sentence[]),
  ...(phoneSentences as Sentence[]),
  ...(housingSentences as Sentence[]),
  ...(advancedSentences as Sentence[]),
];

const sentenceMap = new Map<string, Sentence>(
  allSentences.map((s) => [s.id, s]),
);

export function getAllSentences(): Sentence[] {
  return allSentences;
}

export function getSentenceById(id: string): Sentence | undefined {
  return sentenceMap.get(id);
}

export function getSentencesBySituation(slug: SituationSlug): Sentence[] {
  return allSentences.filter((s) => s.situation === slug);
}
