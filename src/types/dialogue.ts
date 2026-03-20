import type { SituationSlug, CefrLevel } from './vocabulary';

export interface DialogueSpeaker {
  name: string;
  role: string;
}

export interface DialogueLine {
  speaker: 'a' | 'b';
  de: string;
  en: string;
}

export interface Dialogue {
  id: string;
  title: string;
  titleEn: string;
  situation: SituationSlug;
  level: CefrLevel;
  description: string;
  speakers: {
    a: DialogueSpeaker;
    b: DialogueSpeaker;
  };
  lines: DialogueLine[];
}
