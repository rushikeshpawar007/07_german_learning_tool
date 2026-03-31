export interface SceneHotspot {
  id: string;
  word: string;
  article?: string;
  meaning: string;
  wordClass: string;
  sentence: string;
  sentenceEn: string;
  area: { x: number; y: number; width: number; height: number };
}

export interface Scene {
  id: string;
  title: string;
  titleEn: string;
  description: string;
  image: string;
  hotspots: SceneHotspot[];
}
