import { Link } from 'react-router-dom';
import type { WeakArea } from '@/utils/weakAreaAnalyzer';
import { Button } from '@/components/shared/Button';
import styles from './WeakAreaCard.module.css';

interface WeakAreaCardProps {
  area: WeakArea;
}

const severityColors: Record<WeakArea['severity'], string> = {
  mild: 'mild',
  moderate: 'moderate',
  severe: 'severe',
};

export function WeakAreaCard({ area }: WeakAreaCardProps) {
  return (
    <div className={`${styles.card} ${styles[severityColors[area.severity]]}`}>
      <div className={styles.header}>
        <span className={styles.category}>{area.category}</span>
        <span className={`${styles.severity} ${styles[area.severity]}`}>
          {area.severity}
        </span>
      </div>
      <p className={styles.description}>{area.description}</p>
      <div className={styles.actions}>
        <Link to="/review">
          <Button size="sm">Practice These</Button>
        </Link>
        {area.grammarTopicId && (
          <Link to={`/grammar/${area.grammarTopicId}`}>
            <Button size="sm" variant="ghost">Learn Grammar</Button>
          </Link>
        )}
      </div>
    </div>
  );
}
