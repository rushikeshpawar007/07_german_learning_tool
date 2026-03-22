import type { Sentence } from '@/types';
import { SentenceCard } from './SentenceCard';
import { EmptyState } from '@/components/shared/EmptyState';
import styles from './SentenceList.module.css';

interface SentenceListProps {
  sentences: Sentence[];
  onPractice?: (sentenceId: string) => void;
}

export function SentenceList({ sentences, onPractice }: SentenceListProps) {
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
      <div className={styles.list}>
        {sentences.map((sentence) => (
          <SentenceCard
            key={sentence.id}
            sentence={sentence}
            onPractice={onPractice ? () => onPractice(sentence.id) : undefined}
          />
        ))}
      </div>
    </div>
  );
}
