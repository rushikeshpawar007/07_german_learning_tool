import { Link } from 'react-router-dom';
import type { Dialogue } from '@/types';
import { Badge } from '@/components/shared/Badge';
import styles from './DialogueCard.module.css';

interface DialogueCardProps {
  dialogue: Dialogue;
}

export function DialogueCard({ dialogue }: DialogueCardProps) {
  return (
    <Link to={`/dialogues/${dialogue.id}`} className={styles.card}>
      <div className={styles.header}>
        <Badge variant={dialogue.level === 'A2' ? 'success' : 'info'}>
          {dialogue.level}
        </Badge>
        <span className={styles.situation}>{dialogue.situation}</span>
      </div>
      <h3 className={styles.title}>{dialogue.title}</h3>
      <p className={styles.titleEn}>{dialogue.titleEn}</p>
      <p className={styles.description}>{dialogue.description}</p>
      <div className={styles.speakers}>
        <span>{dialogue.speakers.a.name} ({dialogue.speakers.a.role})</span>
        <span className={styles.vs}>&</span>
        <span>{dialogue.speakers.b.name} ({dialogue.speakers.b.role})</span>
      </div>
      <span className={styles.lines}>{dialogue.lines.length} lines</span>
    </Link>
  );
}
