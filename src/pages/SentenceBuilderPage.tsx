import { useParams, useNavigate } from 'react-router-dom';
import { useMemo, useEffect } from 'react';
import { PageShell } from '@/components/layout/PageShell';
import { WordTile } from '@/components/builder/WordTile';
import { DropZone } from '@/components/builder/DropZone';
import { BuilderFeedback } from '@/components/builder/BuilderFeedback';
import { Button } from '@/components/shared/Button';
import { Badge } from '@/components/shared/Badge';
import { EmptyState } from '@/components/shared/EmptyState';
import { useSentenceBuilder } from '@/hooks/useSentenceBuilder';
import { useProgress } from '@/hooks/useProgress';
import { useLearningMode } from '@/context/LearningModeContext';
import { getAllSentences, getSentenceById } from '@/data';
import { shuffle } from '@/utils/shuffle';
import { Link } from 'react-router-dom';
import styles from './SentenceBuilderPage.module.css';

export function SentenceBuilderPage() {
  const { sentenceId } = useParams<{ sentenceId: string }>();
  const navigate = useNavigate();
  const { recordSentenceAttempt, progress } = useProgress();
  const { mode } = useLearningMode();

  const allSentences = useMemo(() => {
    const all = getAllSentences();
    if (mode === 'review') {
      const attempted = all.filter((s) => progress.sentencesProgress[s.id]?.attempted);
      return attempted.length > 0 ? attempted : all;
    }
    return all;
  }, [mode, progress.sentencesProgress]);

  // Filter out correctly completed sentences (unless directly navigated to one)
  const unfinishedSentences = useMemo(() => {
    return allSentences.filter((s) => !progress.sentencesProgress[s.id]?.completedCorrectly);
  }, [allSentences, progress.sentencesProgress]);

  const sentence = sentenceId
    ? getSentenceById(sentenceId)
    : (unfinishedSentences[0] ?? allSentences[0]);

  const {
    phase,
    bankTiles,
    answerTiles,
    isCorrect,
    feedback,
    correctAnswer,
    tileResults,
    moveTileToAnswer,
    moveTileToBank,
    submit,
    tryAgain,
    reset,
  } = useSentenceBuilder(sentence ?? null);

  useEffect(() => {
    reset();
  }, [sentenceId, reset]);

  // Auto-redirect away from completed sentences
  useEffect(() => {
    if (sentence && progress.sentencesProgress[sentence.id]?.completedCorrectly) {
      const next = unfinishedSentences[0];
      if (next && next.id !== sentence.id) {
        navigate(`/builder/${next.id}`, { replace: true });
      }
    }
  }, [sentence, progress.sentencesProgress, unfinishedSentences, navigate]);

  const hasAttempts = Object.keys(progress.sentencesProgress).length > 0;

  if (!sentence || allSentences.length === 0) {
    return (
      <PageShell title="Sentence Builder">
        <EmptyState
          title="No sentences available"
          description="Add some sentence data to get started."
        />
      </PageShell>
    );
  }

  const handleNext = () => {
    // Record attempt with detailed data
    if (phase === 'feedback') {
      const userAnswer = answerTiles.map((t) => t.text).join(' ');
      recordSentenceAttempt(sentence.id, isCorrect, userAnswer, correctAnswer);
    }

    // Pick a random next sentence from unfinished ones
    const remaining = unfinishedSentences.filter((s) => s.id !== sentence.id);
    if (remaining.length === 0) {
      // All sentences completed — pick from all sentences
      const others = allSentences.filter((s) => s.id !== sentence.id);
      const next = shuffle(others)[0];
      if (next) navigate(`/builder/${next.id}`, { replace: true });
    } else {
      const next = shuffle(remaining)[0];
      if (next) navigate(`/builder/${next.id}`, { replace: true });
    }
  };

  const handleSubmit = () => {
    if (answerTiles.length === 0) return;
    submit();
  };

  return (
    <PageShell
      title="Sentence Builder"
      subtitle="Arrange the words to form a correct German sentence"
    >
      <div className={styles.container}>
        <div className={styles.prompt}>
          <p className={styles.translation}>{sentence.en}</p>
          <div className={styles.meta}>
            <Badge variant="info">{sentence.level}</Badge>
            <Badge>{sentence.tone}</Badge>
            <Badge>{sentence.situation}</Badge>
          </div>
        </div>

        <DropZone
          tiles={answerTiles}
          onTileClick={moveTileToBank}
          phase={phase}
          isCorrect={isCorrect}
          tileResults={tileResults}
        />

        {phase === 'building' && (
          <>
            <div className={styles.bank}>
              {bankTiles.map((tile) => (
                <WordTile
                  key={tile.id}
                  text={tile.text}
                  onClick={() => moveTileToAnswer(tile.id)}
                  variant="bank"
                />
              ))}
            </div>

            <div className={styles.submitArea}>
              <Button
                onClick={handleSubmit}
                disabled={answerTiles.length === 0}
                size="lg"
              >
                Check Answer
              </Button>
            </div>
          </>
        )}

        {phase === 'feedback' && (
          <BuilderFeedback
            isCorrect={isCorrect}
            feedback={feedback}
            correctAnswer={correctAnswer}
            onTryAgain={tryAgain}
            onNext={handleNext}
          />
        )}

        {sentence.builderHints && sentence.builderHints.length > 0 && phase === 'building' && mode !== 'practice' && (
          <div className={styles.hints}>
            <span className={styles.hintLabel}>Hint:</span>
            <span className={styles.hintText}>{sentence.builderHints[0]}</span>
          </div>
        )}

        {mode === 'explore' && phase === 'building' && (
          <div className={styles.hints}>
            <span className={styles.hintLabel}>Answer:</span>
            <span className={styles.hintText}>{sentence.de}</span>
          </div>
        )}

        {hasAttempts && (
          <div className={styles.logLink}>
            <Link to="/activity-log">
              <Button variant="ghost" size="sm">View Activity Log</Button>
            </Link>
          </div>
        )}
      </div>
    </PageShell>
  );
}
