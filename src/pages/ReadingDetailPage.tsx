import { useParams, Link } from 'react-router-dom';
import { useState } from 'react';
import { PageShell } from '@/components/layout/PageShell';
import { ParagraphReader } from '@/components/reading/ParagraphReader';
import { Badge } from '@/components/shared/Badge';
import { Button } from '@/components/shared/Button';
import { EmptyState } from '@/components/shared/EmptyState';
import { getReadingById } from '@/data';
import styles from './ReadingDetailPage.module.css';

export function ReadingDetailPage() {
  const { id } = useParams<{ id: string }>();
  const story = id ? getReadingById(id) : undefined;
  const [showTranslations, setShowTranslations] = useState(false);

  if (!story) {
    return (
      <PageShell>
        <EmptyState
          title="Story not found"
          action={<Link to="/reading"><Button>Back to Reading</Button></Link>}
        />
      </PageShell>
    );
  }

  return (
    <PageShell
      actions={
        <div className={styles.actions}>
          <Link to="/reading">
            <Button variant="ghost">Back to Stories</Button>
          </Link>
        </div>
      }
    >
      <article className={styles.article}>
        <header className={styles.header}>
          <div className={styles.badges}>
            <Badge variant={story.level === 'A2' ? 'success' : 'info'}>
              {story.level}
            </Badge>
            <Badge>{story.topic}</Badge>
          </div>
          <h1 className={styles.title}>{story.title}</h1>
          <p className={styles.titleEn}>{story.titleEn}</p>
          <p className={styles.hint}>Click on any German word to see its translation</p>
        </header>

        <div className={styles.controls}>
          <button
            className={styles.translationToggle}
            onClick={() => setShowTranslations(!showTranslations)}
          >
            {showTranslations ? 'Hide' : 'Show'} all translations
          </button>
        </div>

        <div className={styles.content}>
          {story.paragraphs.map((paragraph, i) => (
            <ParagraphReader
              key={i}
              text={paragraph}
              translation={story.fullTranslation[i] ?? ''}
              dictionary={story.dictionary}
              showTranslation={showTranslations}
            />
          ))}
        </div>
      </article>
    </PageShell>
  );
}
