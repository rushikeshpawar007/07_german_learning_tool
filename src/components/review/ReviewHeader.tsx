import type { DailyGoal, StreakData } from '@/types';
import { ProgressBar } from '@/components/shared/ProgressBar';
import styles from './ReviewHeader.module.css';

interface ReviewHeaderProps {
  dailyGoal: DailyGoal;
  streak: StreakData | undefined;
  completed: number;
  total: number;
}

export function ReviewHeader({ dailyGoal, streak, completed, total }: ReviewHeaderProps) {
  return (
    <div className={styles.container}>
      <div className={styles.streak}>
        {streak && streak.currentStreak > 0 ? (
          <>
            <span className={styles.flame}>&#128293;</span>
            <span className={styles.streakCount}>{streak.currentStreak}</span>
          </>
        ) : (
          <span className={styles.streakEmpty}>Start your streak!</span>
        )}
      </div>

      <div className={styles.goals}>
        <div className={styles.goalItem}>
          <ProgressBar
            value={dailyGoal.wordsReviewed}
            max={dailyGoal.targetWords}
            label="Words"
          />
        </div>
        <div className={styles.goalItem}>
          <ProgressBar
            value={dailyGoal.sentencesBuilt}
            max={dailyGoal.targetSentences}
            label="Sentences"
          />
        </div>
        <div className={styles.goalItem}>
          <ProgressBar
            value={dailyGoal.clozeCompleted}
            max={dailyGoal.targetCloze}
            label="Cloze"
          />
        </div>
      </div>

      <div className={styles.sessionProgress}>
        {completed} / {total} items
      </div>
    </div>
  );
}
