import { useState } from 'react';
import type { SituationSlug } from '@/types';
import { situations } from '@/data';
import { Button } from '@/components/shared/Button';
import styles from './QuizSetup.module.css';

interface QuizSetupProps {
  onStart: (situation: SituationSlug | 'all', count: number) => void;
}

const quizSizes = [10, 20, 50];

export function QuizSetup({ onStart }: QuizSetupProps) {
  const [selectedSituation, setSelectedSituation] = useState<SituationSlug | 'all'>('all');
  const [selectedCount, setSelectedCount] = useState(10);

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Vocab Quiz</h2>
      <p className={styles.subtitle}>Test your vocabulary knowledge with flashcards</p>

      <div className={styles.section}>
        <h3 className={styles.label}>Choose a situation</h3>
        <div className={styles.situationGrid}>
          <button
            className={`${styles.situationBtn} ${selectedSituation === 'all' ? styles.active : ''}`}
            onClick={() => setSelectedSituation('all')}
          >
            All words
          </button>
          {situations.map((s) => (
            <button
              key={s.slug}
              className={`${styles.situationBtn} ${selectedSituation === s.slug ? styles.active : ''}`}
              onClick={() => setSelectedSituation(s.slug)}
            >
              {s.name}
            </button>
          ))}
        </div>
      </div>

      <div className={styles.section}>
        <h3 className={styles.label}>How many words?</h3>
        <div className={styles.countGroup}>
          {quizSizes.map((size) => (
            <button
              key={size}
              className={`${styles.countBtn} ${selectedCount === size ? styles.active : ''}`}
              onClick={() => setSelectedCount(size)}
            >
              {size}
            </button>
          ))}
        </div>
      </div>

      <Button size="lg" onClick={() => onStart(selectedSituation, selectedCount)}>
        Start Quiz
      </Button>
    </div>
  );
}
