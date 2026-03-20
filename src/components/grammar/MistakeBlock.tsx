import type { GrammarExample } from '@/types';
import styles from './MistakeBlock.module.css';

interface MistakeBlockProps {
  mistakes: GrammarExample[];
}

export function MistakeBlock({ mistakes }: MistakeBlockProps) {
  return (
    <div className={styles.container}>
      {mistakes.map((mistake, i) => (
        <div key={i} className={styles.item}>
          {mistake.incorrect && (
            <p className={styles.incorrect}>{mistake.incorrect}</p>
          )}
          <p className={styles.correct}>{mistake.correct}</p>
          <p className={styles.explanation}>{mistake.explanation}</p>
        </div>
      ))}
    </div>
  );
}
