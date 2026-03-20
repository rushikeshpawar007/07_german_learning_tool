import { useState } from 'react';
import type { Sentence } from '@/types';
import { SentenceCard } from './SentenceCard';
import { EmptyState } from '@/components/shared/EmptyState';
import { useLearningMode } from '@/context/LearningModeContext';
import styles from './SentenceList.module.css';

interface SentenceListProps {
  sentences: Sentence[];
  onPractice?: (sentenceId: string) => void;
}

export function SentenceList({ sentences, onPractice }: SentenceListProps) {
  const { mode } = useLearningMode();
  const [showAll, setShowAll] = useState(mode === 'explore');

  if (sentences.length === 0) {
    return (
      <EmptyState
        title="No sentences found"
        description="Try adjusting your filters."
      />
    );
  }

  return (
    <div>
      <div className={styles.toolbar}>
        <button
          className={styles.toggleAllBtn}
          onClick={() => setShowAll(!showAll)}
        >
          {showAll ? 'Hide' : 'Show'} all translations
        </button>
      </div>
      <div className={styles.list}>
        {sentences.map((sentence) => (
          <SentenceCard
            key={sentence.id}
            sentence={sentence}
            showTranslation={showAll}
            onPractice={onPractice ? () => onPractice(sentence.id) : undefined}
          />
        ))}
      </div>
    </div>
  );
}
