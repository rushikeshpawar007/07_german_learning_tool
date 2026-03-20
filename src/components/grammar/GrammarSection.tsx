import type { GrammarRule } from '@/types';
import styles from './GrammarSection.module.css';

interface GrammarSectionProps {
  rule: GrammarRule;
}

export function GrammarSection({ rule }: GrammarSectionProps) {
  return (
    <div className={styles.section}>
      <h3 className={styles.title}>{rule.title}</h3>
      <p className={styles.explanation}>{rule.explanation}</p>
      <div className={styles.examples}>
        {rule.examples.map((ex, i) => (
          <div key={i} className={styles.example}>
            <p className={styles.correct}>{ex.correct}</p>
            {ex.incorrect && (
              <p className={styles.incorrect}>{ex.incorrect}</p>
            )}
            <p className={styles.exExplanation}>{ex.explanation}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
