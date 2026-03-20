import { useMemo } from 'react';
import type { SituationSlug, CefrLevel, Tone } from '@/types';
import { getAllSentences, getSentenceById } from '@/data';

interface UseSentencesOptions {
  situation?: SituationSlug;
  level?: CefrLevel;
  tone?: Tone;
}

export function useSentences(options: UseSentencesOptions = {}) {
  const { situation, level, tone } = options;

  const allSentences = useMemo(() => getAllSentences(), []);

  const filtered = useMemo(() => {
    return allSentences.filter((sentence) => {
      if (situation && sentence.situation !== situation) return false;
      if (level && sentence.level !== level) return false;
      if (tone && sentence.tone !== tone) return false;
      return true;
    });
  }, [allSentences, situation, level, tone]);

  return {
    sentences: filtered,
    total: allSentences.length,
    getById: getSentenceById,
  };
}
