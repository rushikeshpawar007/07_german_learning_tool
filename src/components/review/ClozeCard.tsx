import { useState, useRef, useEffect } from 'react';
import type { ClozeExercise } from '@/utils/cloze';
import { checkClozeAnswer } from '@/utils/cloze';
import { Button } from '@/components/shared/Button';
import styles from './ClozeCard.module.css';

interface ClozeCardProps {
  exercise: ClozeExercise;
  onComplete: (allCorrect: boolean, blanksCorrect: number, blanksTotal: number) => void;
}

export function ClozeCard({ exercise, onComplete }: ClozeCardProps) {
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [submitted, setSubmitted] = useState(false);
  const [results, setResults] = useState<Record<number, boolean>>({});
  const firstInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setAnswers({});
    setSubmitted(false);
    setResults({});
    firstInputRef.current?.focus();
  }, [exercise.sentenceId]);

  const handleChange = (blankIndex: number, value: string) => {
    if (submitted) return;
    setAnswers((prev) => ({ ...prev, [blankIndex]: value }));
  };

  const handleSubmit = () => {
    if (submitted) return;

    const newResults: Record<number, boolean> = {};
    let correctCount = 0;

    for (const blank of exercise.blanks) {
      const userAnswer = answers[blank.index] ?? '';
      const isCorrect = checkClozeAnswer(userAnswer, blank.answer);
      newResults[blank.index] = isCorrect;
      if (isCorrect) correctCount++;
    }

    setResults(newResults);
    setSubmitted(true);
    onComplete(correctCount === exercise.blanks.length, correctCount, exercise.blanks.length);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !submitted) {
      handleSubmit();
    }
  };

  let inputIndex = 0;

  return (
    <div className={styles.container}>
      <p className={styles.translation}>{exercise.translation}</p>

      <div className={styles.sentence}>
        {exercise.displayWords.map((part, i) => {
          if (typeof part === 'string') {
            return <span key={i} className={styles.word}>{part}</span>;
          }

          const blank = part;
          const userValue = answers[blank.index] ?? '';
          const isFirst = inputIndex === 0;
          inputIndex++;

          return (
            <span key={i} className={styles.blankWrapper}>
              <input
                ref={isFirst ? firstInputRef : undefined}
                className={`${styles.blankInput} ${
                  submitted
                    ? results[blank.index]
                      ? styles.correct
                      : styles.incorrect
                    : ''
                }`}
                type="text"
                value={userValue}
                onChange={(e) => handleChange(blank.index, e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={blank.hint}
                disabled={submitted}
                style={{ width: `${Math.max(blank.answer.length + 2, 6)}ch` }}
                autoComplete="off"
                spellCheck={false}
              />
              {submitted && !results[blank.index] && (
                <span className={styles.correctAnswer}>{blank.answer}</span>
              )}
            </span>
          );
        })}
      </div>

      {!submitted && (
        <div className={styles.actions}>
          <Button onClick={handleSubmit} disabled={exercise.blanks.some((b) => !(answers[b.index] ?? '').trim())}>
            Check
          </Button>
        </div>
      )}

      {submitted && (
        <div className={styles.feedback}>
          {Object.values(results).every(Boolean) ? (
            <p className={styles.feedbackCorrect}>Correct!</p>
          ) : (
            <p className={styles.feedbackIncorrect}>
              {Object.values(results).filter(Boolean).length} of {exercise.blanks.length} correct
            </p>
          )}
        </div>
      )}
    </div>
  );
}
