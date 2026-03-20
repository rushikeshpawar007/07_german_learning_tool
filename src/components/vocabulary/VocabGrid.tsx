import type { VocabWord } from '@/types';
import { VocabCard } from './VocabCard';
import { EmptyState } from '@/components/shared/EmptyState';
import styles from './VocabGrid.module.css';

interface VocabGridProps {
  words: VocabWord[];
}

export function VocabGrid({ words }: VocabGridProps) {
  if (words.length === 0) {
    return (
      <EmptyState
        title="No words found"
        description="Try adjusting your search or filters."
      />
    );
  }

  return (
    <div className={styles.grid}>
      {words.map((word) => (
        <VocabCard key={word.id} word={word} />
      ))}
    </div>
  );
}
