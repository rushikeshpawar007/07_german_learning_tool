import { useEffect } from 'react';
import type { Sentence } from '@/types';
import { WordTile } from '@/components/builder/WordTile';
import { DropZone } from '@/components/builder/DropZone';
import { BuilderFeedback } from '@/components/builder/BuilderFeedback';
import { Button } from '@/components/shared/Button';
import { Badge } from '@/components/shared/Badge';
import { useSentenceBuilder } from '@/hooks/useSentenceBuilder';
import styles from './MiniBuilder.module.css';

interface MiniBuilderProps {
  sentence: Sentence;
  onComplete: (correct: boolean) => void;
}

export function MiniBuilder({ sentence, onComplete }: MiniBuilderProps) {
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
  } = useSentenceBuilder(sentence);

  useEffect(() => {
    reset();
  }, [sentence.id, reset]);

  const handleSubmit = () => {
    if (answerTiles.length === 0) return;
    submit();
  };

  const handleNext = () => {
    onComplete(isCorrect);
  };

  return (
    <div className={styles.container}>
      <div className={styles.prompt}>
        <p className={styles.translation}>{sentence.en}</p>
        <div className={styles.meta}>
          <Badge variant="info">{sentence.level}</Badge>
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
            <Button onClick={handleSubmit} disabled={answerTiles.length === 0}>
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
    </div>
  );
}
