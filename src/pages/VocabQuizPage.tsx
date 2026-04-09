import { useState, useCallback } from 'react';
import { PageShell } from '@/components/layout/PageShell';
import { QuizSetup } from '@/components/vocabulary/QuizSetup';
import { Flashcard } from '@/components/vocabulary/Flashcard';
import { QuizResults } from '@/components/vocabulary/QuizResults';
import { useProgress } from '@/hooks/useProgress';
import { getAllVocab, getVocabBySituation } from '@/data';
import { shuffle } from '@/utils/shuffle';
import type { VocabWord, SituationSlug } from '@/types';

type QuizPhase = 'setup' | 'quizzing' | 'results';

export function VocabQuizPage() {
  const { recordWordPractice, markWordSeen, logVocabQuiz, recordDailyGoalProgress } = useProgress();
  const [phase, setPhase] = useState<QuizPhase>('setup');
  const [deck, setDeck] = useState<VocabWord[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [knownWords, setKnownWords] = useState<VocabWord[]>([]);
  const [unknownWords, setUnknownWords] = useState<VocabWord[]>([]);
  const [currentSituation, setCurrentSituation] = useState<string>('all');

  const handleStart = useCallback((situation: SituationSlug | 'all', count: number) => {
    const words = situation === 'all'
      ? getAllVocab()
      : getVocabBySituation(situation);

    const shuffled = shuffle(words).slice(0, count);
    setDeck(shuffled);
    setCurrentIndex(0);
    setKnownWords([]);
    setUnknownWords([]);
    setCurrentSituation(situation);
    setPhase('quizzing');
  }, []);

  const finishQuiz = useCallback((known: VocabWord[], unknown: VocabWord[]) => {
    logVocabQuiz({
      situation: currentSituation,
      totalWords: known.length + unknown.length,
      knownCount: known.length,
      unknownCount: unknown.length,
      knownWordIds: known.map((w) => w.id),
      unknownWordIds: unknown.map((w) => w.id),
    });
    setPhase('results');
  }, [logVocabQuiz, currentSituation]);

  const handleKnow = useCallback(() => {
    const word = deck[currentIndex];
    if (!word) return;

    markWordSeen(word.id);
    recordWordPractice(word.id, true, 4);
    recordDailyGoalProgress('word');
    const newKnown = [...knownWords, word];
    setKnownWords(newKnown);

    if (currentIndex + 1 >= deck.length) {
      finishQuiz(newKnown, unknownWords);
    } else {
      setCurrentIndex((prev) => prev + 1);
    }
  }, [deck, currentIndex, markWordSeen, recordWordPractice, knownWords, unknownWords, finishQuiz]);

  const handleDontKnow = useCallback(() => {
    const word = deck[currentIndex];
    if (!word) return;

    markWordSeen(word.id);
    recordWordPractice(word.id, false, 1);
    recordDailyGoalProgress('word');
    const newUnknown = [...unknownWords, word];
    setUnknownWords(newUnknown);

    if (currentIndex + 1 >= deck.length) {
      finishQuiz(knownWords, newUnknown);
    } else {
      setCurrentIndex((prev) => prev + 1);
    }
  }, [deck, currentIndex, markWordSeen, recordWordPractice, knownWords, unknownWords, finishQuiz]);

  const handleRestart = useCallback(() => {
    setPhase('setup');
    setDeck([]);
    setCurrentIndex(0);
    setKnownWords([]);
    setUnknownWords([]);
  }, []);

  const handleRetryUnknown = useCallback(() => {
    const reshuffled = shuffle(unknownWords);
    setDeck(reshuffled);
    setCurrentIndex(0);
    setKnownWords([]);
    setUnknownWords([]);
    setPhase('quizzing');
  }, [unknownWords]);

  return (
    <PageShell
      title={phase === 'setup' ? undefined : 'Vocab Quiz'}
    >
      {phase === 'setup' && (
        <QuizSetup onStart={handleStart} />
      )}

      {phase === 'quizzing' && deck[currentIndex] && (
        <Flashcard
          key={deck[currentIndex]!.id}
          word={deck[currentIndex]!}
          current={currentIndex + 1}
          total={deck.length}
          onKnow={handleKnow}
          onDontKnow={handleDontKnow}
        />
      )}

      {phase === 'results' && (
        <QuizResults
          knownWords={knownWords}
          unknownWords={unknownWords}
          onRestart={handleRestart}
          onRetryUnknown={handleRetryUnknown}
        />
      )}
    </PageShell>
  );
}
