import { Link } from 'react-router-dom';
import type { Situation } from '@/types';
import styles from './SituationCard.module.css';

const iconMap: Record<string, string> = {
  briefcase: '\uD83D\uDCBC',
  chat: '\uD83D\uDCAC',
  heart: '\u2764\uFE0F',
  users: '\uD83D\uDC65',
  mail: '\u2709\uFE0F',
  map: '\uD83D\uDDFA\uFE0F',
  'shopping-bag': '\uD83D\uDECD\uFE0F',
  'file-text': '\uD83D\uDCC4',
  phone: '\uD83D\uDCDE',
  home: '\uD83C\uDFE0',
};

interface SituationCardProps {
  situation: Situation;
  wordCount: number;
  sentenceCount: number;
}

export function SituationCard({ situation, wordCount, sentenceCount }: SituationCardProps) {
  return (
    <Link to={`/situations/${situation.slug}`} className={styles.card}>
      <div className={styles.iconWrapper} style={{ backgroundColor: situation.color + '18' }}>
        <span className={styles.icon}>{iconMap[situation.icon] ?? '📚'}</span>
      </div>
      <div className={styles.content}>
        <h3 className={styles.name}>{situation.name}</h3>
        <p className={styles.description}>{situation.description}</p>
        <div className={styles.stats}>
          <span>{wordCount} words</span>
          <span>{sentenceCount} sentences</span>
        </div>
      </div>
    </Link>
  );
}
