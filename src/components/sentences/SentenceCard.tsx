import { useState } from 'react';
import type { Sentence } from '@/types';
import { Badge } from '@/components/shared/Badge';
import styles from './SentenceCard.module.css';

interface SentenceCardProps {
  sentence: Sentence;
  onPractice?: () => void;
}

export function SentenceCard({ sentence, onPractice }: SentenceCardProps) {
  const [showTranslation, setShowTranslation] = useState(false);

  return (
    <div className={styles.card}>
      <div className={styles.content}>
        <p className={styles.german}>{sentence.de}</p>
        {showTranslation && (
          <p className={styles.english}>{sentence.en}</p>
        )}
      </div>
      <div className={styles.footer}>
        <div className={styles.badges}>
          <Badge variant={sentence.level === 'B1' ? 'info' : 'default'}>
            {sentence.level}
          </Badge>
          <Badge variant={sentence.tone === 'formal' ? 'info' : 'default'}>
            {sentence.tone}
          </Badge>
        </div>
        <div className={styles.actions}>
          <button className={styles.toggleBtn} onClick={() => setShowTranslation(!showTranslation)}>
            {showTranslation ? 'Hide' : 'Translate'}
          </button>
          {onPractice && (
            <button className={styles.practiceBtn} onClick={onPractice}>
              Practice
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
