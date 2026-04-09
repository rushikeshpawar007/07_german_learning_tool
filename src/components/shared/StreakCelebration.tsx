import { useEffect, useState } from 'react';
import styles from './StreakCelebration.module.css';

interface StreakCelebrationProps {
  streak: number;
}

const MILESTONES = [7, 14, 30, 60, 100];

function getMessage(streak: number): string | null {
  if (MILESTONES.includes(streak)) {
    return `${streak}-day streak! Amazing!`;
  }
  if (streak === 1) return null; // Don't celebrate day 1
  return `${streak}-day streak!`;
}

export function StreakCelebration({ streak }: StreakCelebrationProps) {
  const [visible, setVisible] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    const msg = getMessage(streak);
    if (msg && streak > 1) {
      setMessage(msg);
      setVisible(true);
      const timer = setTimeout(() => setVisible(false), 2500);
      return () => clearTimeout(timer);
    }
  }, [streak]);

  if (!visible || !message) return null;

  return (
    <div className={styles.overlay} onClick={() => setVisible(false)}>
      <div className={styles.card}>
        <span className={styles.flame}>&#128293;</span>
        <p className={styles.message}>{message}</p>
        {MILESTONES.includes(streak) && (
          <p className={styles.milestone}>+1 Streak Freeze earned!</p>
        )}
      </div>
    </div>
  );
}
