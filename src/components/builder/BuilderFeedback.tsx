import type { GrammarFeedback } from '@/types';
import styles from './BuilderFeedback.module.css';

interface BuilderFeedbackProps {
  isCorrect: boolean;
  feedback: GrammarFeedback[];
  correctAnswer: string;
  onTryAgain: () => void;
  onNext: () => void;
}

export function BuilderFeedback({
  isCorrect,
  feedback,
  correctAnswer,
  onTryAgain,
  onNext,
}: BuilderFeedbackProps) {
  return (
    <div className={`${styles.container} ${isCorrect ? styles.success : styles.error}`}>
      <div className={styles.header}>
        <h3 className={styles.title}>
          {isCorrect ? 'Richtig! Well done!' : 'Not quite right'}
        </h3>
      </div>

      {!isCorrect && (
        <>
          <div className={styles.correctAnswer}>
            <span className={styles.label}>Correct answer:</span>
            <p className={styles.answer}>{correctAnswer}</p>
          </div>

          {feedback.map((fb, i) => (
            <div key={i} className={styles.feedbackItem}>
              <span className={styles.topic}>{fb.topic.replace('-', ' ')}</span>
              <p className={styles.explanation}>{fb.explanation}</p>
            </div>
          ))}
        </>
      )}

      <div className={styles.actions}>
        {!isCorrect && (
          <button className={styles.tryAgainBtn} onClick={onTryAgain}>
            Try Again
          </button>
        )}
        <button className={styles.nextBtn} onClick={onNext}>
          {isCorrect ? 'Next Sentence' : 'Skip'}
        </button>
      </div>
    </div>
  );
}
