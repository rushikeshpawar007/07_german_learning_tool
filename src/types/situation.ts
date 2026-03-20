import type { SituationSlug } from './vocabulary';

export interface Situation {
  slug: SituationSlug;
  name: string;
  description: string;
  icon: string;
  color: string;
}
