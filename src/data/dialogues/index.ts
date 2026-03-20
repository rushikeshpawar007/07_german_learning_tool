import type { Dialogue } from '@/types';
import work from './dialogue-work.json';
import healthcare from './dialogue-healthcare.json';
import travel from './dialogue-travel.json';
import shopping from './dialogue-shopping.json';
import bureaucracy from './dialogue-bureaucracy.json';
import smalltalk from './dialogue-smalltalk.json';
import meetings from './dialogue-meetings.json';
import phone from './dialogue-phone.json';
import housing from './dialogue-housing.json';

const allDialogues: Dialogue[] = [
  work as Dialogue,
  healthcare as Dialogue,
  travel as Dialogue,
  shopping as Dialogue,
  bureaucracy as Dialogue,
  smalltalk as Dialogue,
  meetings as Dialogue,
  phone as Dialogue,
  housing as Dialogue,
];

const dialogueMap = new Map<string, Dialogue>(
  allDialogues.map((d) => [d.id, d]),
);

export function getAllDialogues(): Dialogue[] {
  return allDialogues;
}

export function getDialogueById(id: string): Dialogue | undefined {
  return dialogueMap.get(id);
}
