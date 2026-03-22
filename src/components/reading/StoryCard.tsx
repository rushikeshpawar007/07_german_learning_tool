import { Link } from 'react-router-dom';
import type { ReadingStory } from '@/types';
import { Badge } from '@/components/shared/Badge';
import styles from './StoryCard.module.css';

interface StoryCardProps {
  story: ReadingStory;
}

export function StoryCard({ story }: StoryCardProps) {
  const wordCount = story.paragraphs.join(' ').split(/\s+/).length;

  return (
    <Link to={`/reading/${story.id}`} className={styles.card}>
      {story.coverImage && (
        <img
          src={`${import.meta.env.BASE_URL}${story.coverImage}`}
          alt={story.title}
          className={styles.coverImage}
          loading="lazy"
        />
      )}
      <div className={styles.cardBody}>
        <div className={styles.header}>
          <Badge variant={story.level === 'A2' ? 'success' : 'info'}>
            {story.level}
          </Badge>
          <span className={styles.topic}>{story.topic}</span>
        </div>
        <h3 className={styles.title}>{story.title}</h3>
        <p className={styles.titleEn}>{story.titleEn}</p>
        <p className={styles.description}>{story.description}</p>
        <div className={styles.meta}>
          <span>{story.paragraphs.length} paragraphs</span>
          <span>{wordCount} words</span>
        </div>
      </div>
    </Link>
  );
}
