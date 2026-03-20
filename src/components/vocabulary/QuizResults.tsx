import type { VocabWord } from '@/types';
import { Button } from '@/components/shared/Button';
import { Badge } from '@/components/shared/Badge';
import styles from './QuizResults.module.css';

interface QuizResultsProps {
  knownWords: VocabWord[];
  unknownWords: VocabWord[];
  onRestart: () => void;
  onRetryUnknown: () => void;
}

export function QuizResults({ knownWords, unknownWords, onRestart, onRetryUnknown }: QuizResultsProps) {
  const total = knownWords.length + unknownWords.length;
  const percent = Math.round((knownWords.length / total) * 100);

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Quiz Complete!</h2>

      <div className={styles.scoreCard}>
        <div className={styles.scoreNumber}>{percent}%</div>
        <div className={styles.scoreDetail}>
          <span className={styles.known}>{knownWords.length} known</span>
          <span className={styles.divider}>/</span>
          <span className={styles.unknown}>{unknownWords.length} to review</span>
        </div>
      </div>

      {unknownWords.length > 0 && (
        <div className={styles.section}>
          <h3 className={styles.sectionTitle}>Words to Review</h3>
          <div className={styles.wordList}>
            {unknownWords.map((w) => (
              <div key={w.id} className={styles.wordItem}>
                <span className={styles.german}>{w.word}</span>
                <span className={styles.english}>{w.meaningEn}</span>
                <Badge variant="error">Review</Badge>
              </div>
            ))}
          </div>
        </div>
      )}

      {knownWords.length > 0 && (
        <div className={styles.section}>
          <h3 className={styles.sectionTitle}>Words You Know</h3>
          <div className={styles.wordList}>
            {knownWords.map((w) => (
              <div key={w.id} className={styles.wordItem}>
                <span className={styles.german}>{w.word}</span>
                <span className={styles.english}>{w.meaningEn}</span>
                <Badge variant="success">Known</Badge>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className={styles.actions}>
        {unknownWords.length > 0 && (
          <Button onClick={onRetryUnknown}>
            Retry Unknown Words ({unknownWords.length})
          </Button>
        )}
        <Button variant="secondary" onClick={onRestart}>
          New Quiz
        </Button>
      </div>
    </div>
  );
}
