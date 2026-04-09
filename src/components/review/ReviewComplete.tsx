import { Link } from 'react-router-dom';
import { Button } from '@/components/shared/Button';
import type { StreakData } from '@/types';
import styles from './ReviewComplete.module.css';

interface ReviewCompleteProps {
  stats: {
    completed: number;
    total: number;
    accuracy: number;
  };
  streak: StreakData | undefined;
}

export function ReviewComplete({ stats, streak }: ReviewCompleteProps) {
  const accuracyPercent = Math.round(stats.accuracy * 100);

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h2 className={styles.title}>Session Complete!</h2>

        <div className={styles.scoreCircle}>
          <span className={styles.scoreNumber}>{accuracyPercent}%</span>
          <span className={styles.scoreLabel}>accuracy</span>
        </div>

        <div className={styles.statsRow}>
          <div className={styles.stat}>
            <span className={styles.statNumber}>{stats.completed}</span>
            <span className={styles.statLabel}>items reviewed</span>
          </div>
          {streak && streak.currentStreak > 0 && (
            <div className={styles.stat}>
              <span className={styles.statNumber}>
                <span className={styles.flame}>&#128293;</span> {streak.currentStreak}
              </span>
              <span className={styles.statLabel}>day streak</span>
            </div>
          )}
        </div>

        <div className={styles.actions}>
          <Link to="/">
            <Button variant="secondary">Done for Today</Button>
          </Link>
          <Link to="/review">
            <Button onClick={() => window.location.reload()}>Continue Practicing</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
