import { Link } from 'react-router-dom';
import type { GrammarLesson } from '@/types';
import { Badge } from '@/components/shared/Badge';
import { GRAMMAR_CATEGORY_LABELS } from '@/utils/constants';
import styles from './GrammarCard.module.css';

interface GrammarCardProps {
  lesson: GrammarLesson;
}

export function GrammarCard({ lesson }: GrammarCardProps) {
  return (
    <Link to={`/grammar/${lesson.id}`} className={styles.card}>
      <div className={styles.header}>
        <Badge variant={lesson.level === 'B1' ? 'info' : 'default'}>
          {lesson.level}
        </Badge>
        <span className={styles.category}>
          {GRAMMAR_CATEGORY_LABELS[lesson.category] ?? lesson.category}
        </span>
      </div>
      <h3 className={styles.title}>{lesson.title}</h3>
      <p className={styles.description}>{lesson.description}</p>
      <div className={styles.meta}>
        <span>{lesson.rules.length} rules</span>
        <span>{lesson.commonMistakes.length} common mistakes</span>
      </div>
    </Link>
  );
}
