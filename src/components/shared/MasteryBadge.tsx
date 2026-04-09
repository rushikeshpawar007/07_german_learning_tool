import type { MasteryLevel } from '@/types';
import styles from './MasteryBadge.module.css';

interface MasteryBadgeProps {
  level: MasteryLevel;
}

const labels: Record<MasteryLevel, string> = {
  new: '',
  learning: 'Learning',
  reviewing: 'Reviewing',
  mastered: 'Mastered',
};

export function MasteryBadge({ level }: MasteryBadgeProps) {
  if (level === 'new') return null;

  return (
    <span className={`${styles.badge} ${styles[level]}`}>
      {level === 'mastered' && <span className={styles.check}>&#10003;</span>}
      {labels[level]}
    </span>
  );
}
