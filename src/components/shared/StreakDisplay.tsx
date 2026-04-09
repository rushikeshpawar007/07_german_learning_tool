import type { StreakData } from '@/types';
import styles from './StreakDisplay.module.css';

interface StreakDisplayProps {
  streak: StreakData | undefined;
  compact?: boolean;
}

export function StreakDisplay({ streak, compact }: StreakDisplayProps) {
  if (!streak || streak.currentStreak === 0) {
    if (compact) return null;
    return (
      <div className={styles.empty}>
        <span>Start your streak today!</span>
      </div>
    );
  }

  if (compact) {
    return (
      <div className={styles.compact}>
        <span className={styles.flame}>&#128293;</span>
        <span className={styles.compactCount}>{streak.currentStreak}</span>
      </div>
    );
  }

  return (
    <div className={styles.full}>
      <div className={styles.main}>
        <span className={styles.flameLarge}>&#128293;</span>
        <div>
          <span className={styles.count}>{streak.currentStreak}</span>
          <span className={styles.label}>day streak</span>
        </div>
      </div>
      <div className={styles.details}>
        <span className={styles.detail}>Best: {streak.longestStreak} days</span>
        {streak.streakFreezes > 0 && (
          <span className={styles.detail}>&#10052; {streak.streakFreezes} freeze{streak.streakFreezes > 1 ? 's' : ''}</span>
        )}
      </div>
    </div>
  );
}
