import { Link } from 'react-router-dom';
import type { VocabWord } from '@/types';
import { Badge } from '@/components/shared/Badge';
import { MasteryBadge } from '@/components/shared/MasteryBadge';
import { useProgress } from '@/hooks/useProgress';
import { getMasteryLevel } from '@/utils/srs';
import styles from './VocabCard.module.css';

interface VocabCardProps {
  word: VocabWord;
}

export function VocabCard({ word }: VocabCardProps) {
  const { getWordProgress } = useProgress();
  const wp = getWordProgress(word.id);
  const mastery = getMasteryLevel(wp);

  return (
    <Link to={`/vocabulary/${word.id}`} className={styles.card}>
      <div className={styles.header}>
        <span className={styles.word}>{word.word}</span>
        <div className={styles.badges}>
          <MasteryBadge level={mastery} />
          <Badge variant={word.level === 'B1' ? 'info' : 'default'}>
            {word.level}
          </Badge>
        </div>
      </div>
      <p className={styles.meaning}>{word.meaningEn}</p>
      <div className={styles.meta}>
        <span className={styles.wordClass}>{word.wordClass}</span>
        {word.gender && <span className={styles.gender}>{word.gender}</span>}
      </div>
    </Link>
  );
}
