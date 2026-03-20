import type { ReadingStory } from '@/types';

// Short stories
import normalerTag from './story-normaler-tag.json';
import supermarkt from './story-supermarkt.json';
import neueKollege from './story-neue-kollege.json';
import beimArzt from './story-beim-arzt.json';
import wohnungssuche from './story-wohnungssuche.json';
import wochenendesee from './story-wochenende-see.json';
import vorstellungsgespraech from './story-vorstellungsgespraech.json';
import unterwegsMuenchen from './story-unterwegs-muenchen.json';

// Long stories — Movie retellings
import koenigDerLoewen from './story-koenig-der-loewen.json';
import findetNemo from './story-findet-nemo.json';
import zaubererVonOz from './story-zauberer-von-oz.json';

// Long stories — Classic fables
import schildkroeteUndHase from './story-schildkroete-und-hase.json';
import jungeDerWolfRief from './story-junge-der-wolf-rief.json';
import ameiseUndGrille from './story-ameise-und-grille.json';

// Long stories — Real life
import erstesJahr from './story-erstes-jahr.json';
import reiseMumbaiBerlin from './story-reise-mumbai-berlin.json';

const allReadings: ReadingStory[] = [
  // Short stories
  normalerTag as ReadingStory,
  supermarkt as ReadingStory,
  neueKollege as ReadingStory,
  beimArzt as ReadingStory,
  wohnungssuche as ReadingStory,
  wochenendesee as ReadingStory,
  vorstellungsgespraech as ReadingStory,
  unterwegsMuenchen as ReadingStory,
  // Long stories
  koenigDerLoewen as ReadingStory,
  findetNemo as ReadingStory,
  zaubererVonOz as ReadingStory,
  schildkroeteUndHase as ReadingStory,
  jungeDerWolfRief as ReadingStory,
  ameiseUndGrille as ReadingStory,
  erstesJahr as ReadingStory,
  reiseMumbaiBerlin as ReadingStory,
];

const readingMap = new Map<string, ReadingStory>(
  allReadings.map((r) => [r.id, r]),
);

export function getAllReadings(): ReadingStory[] {
  return allReadings;
}

export function getReadingById(id: string): ReadingStory | undefined {
  return readingMap.get(id);
}
