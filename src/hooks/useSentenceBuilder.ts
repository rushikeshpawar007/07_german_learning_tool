import { useState, useCallback, useMemo } from 'react';
import type { Sentence } from '@/types';
import type { GrammarFeedback } from '@/types';
import { validateSentence } from '@/utils/grammarValidator';
import { shuffle } from '@/utils/shuffle';

export type BuilderPhase = 'building' | 'submitted' | 'feedback';

export interface TileState {
  id: number;
  text: string;
  zone: 'bank' | 'answer';
  position: number;
}

interface BuilderState {
  phase: BuilderPhase;
  tiles: TileState[];
  isCorrect: boolean;
  feedback: GrammarFeedback[];
  correctAnswer: string;
  attempts: number;
}

export function useSentenceBuilder(sentence: Sentence | null) {
  const initialTiles = useMemo(() => {
    if (!sentence) return [];
    const words = sentence.words.map((w, i) => ({
      id: i,
      text: w.text,
      zone: 'bank' as const,
      position: i,
    }));
    return shuffle(words);
  }, [sentence]);

  const [state, setState] = useState<BuilderState>({
    phase: 'building',
    tiles: initialTiles,
    isCorrect: false,
    feedback: [],
    correctAnswer: sentence?.de ?? '',
    attempts: 0,
  });

  // Sync tiles when sentence changes
  const reset = useCallback(() => {
    if (!sentence) return;
    const words = sentence.words.map((w, i) => ({
      id: i,
      text: w.text,
      zone: 'bank' as const,
      position: i,
    }));
    setState({
      phase: 'building',
      tiles: shuffle(words),
      isCorrect: false,
      feedback: [],
      correctAnswer: sentence.de,
      attempts: 0,
    });
  }, [sentence]);

  const moveTileToAnswer = useCallback((tileId: number) => {
    setState((prev) => {
      if (prev.phase !== 'building') return prev;
      const answerCount = prev.tiles.filter((t) => t.zone === 'answer').length;
      return {
        ...prev,
        tiles: prev.tiles.map((t) =>
          t.id === tileId ? { ...t, zone: 'answer', position: answerCount } : t,
        ),
      };
    });
  }, []);

  const moveTileToBank = useCallback((tileId: number) => {
    setState((prev) => {
      if (prev.phase !== 'building') return prev;
      return {
        ...prev,
        tiles: prev.tiles.map((t) =>
          t.id === tileId ? { ...t, zone: 'bank', position: 0 } : t,
        ),
      };
    });
  }, []);

  const submit = useCallback(() => {
    if (!sentence) return;

    setState((prev) => {
      const answerTiles = prev.tiles
        .filter((t) => t.zone === 'answer')
        .sort((a, b) => a.position - b.position);

      const userSentence = answerTiles.map((t) => t.text).join(' ');
      const result = validateSentence(userSentence, sentence);

      return {
        ...prev,
        phase: 'feedback',
        isCorrect: result.isCorrect,
        feedback: result.feedback,
        correctAnswer: result.correctAnswer,
        attempts: prev.attempts + 1,
      };
    });
  }, [sentence]);

  const tryAgain = useCallback(() => {
    setState((prev) => ({
      ...prev,
      phase: 'building',
      tiles: prev.tiles.map((t) => ({ ...t, zone: 'bank' as const, position: t.id })),
      feedback: [],
    }));
  }, []);

  const answerTiles = state.tiles
    .filter((t) => t.zone === 'answer')
    .sort((a, b) => a.position - b.position);

  const bankTiles = state.tiles.filter((t) => t.zone === 'bank');

  return {
    phase: state.phase,
    bankTiles,
    answerTiles,
    isCorrect: state.isCorrect,
    feedback: state.feedback,
    correctAnswer: state.correctAnswer,
    attempts: state.attempts,
    moveTileToAnswer,
    moveTileToBank,
    submit,
    tryAgain,
    reset,
  };
}
