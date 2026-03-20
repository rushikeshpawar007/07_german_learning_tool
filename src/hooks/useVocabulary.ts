import { useMemo } from 'react';
import type { VocabWord, SituationSlug, CefrLevel } from '@/types';
import { getAllVocab, getVocabById } from '@/data';
import { matchesSearch } from '@/utils/search';

interface UseVocabularyOptions {
  situation?: SituationSlug;
  level?: CefrLevel;
  search?: string;
}

export function useVocabulary(options: UseVocabularyOptions = {}) {
  const { situation, level, search } = options;

  const allVocab = useMemo(() => getAllVocab(), []);

  const filtered = useMemo(() => {
    return allVocab.filter((word) => {
      if (situation && !word.situations.includes(situation)) return false;
      if (level && word.level !== level) return false;
      if (search && !matchesSearch(word.word, search) && !matchesSearch(word.meaningEn, search)) {
        return false;
      }
      return true;
    });
  }, [allVocab, situation, level, search]);

  const getById = (id: string): VocabWord | undefined => getVocabById(id);

  return { vocab: filtered, total: allVocab.length, getById };
}
