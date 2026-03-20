import { useMemo } from 'react';
import { PageShell } from '@/components/layout/PageShell';
import { StoryCard } from '@/components/reading/StoryCard';
import { getAllReadings } from '@/data';
import styles from './ReadingListPage.module.css';

export function ReadingListPage() {
  const stories = useMemo(() => getAllReadings(), []);

  return (
    <PageShell
      title="Reading"
      subtitle="Read German stories and click any word for its translation"
    >
      <div className={styles.grid}>
        {stories.map((story) => (
          <StoryCard key={story.id} story={story} />
        ))}
      </div>
    </PageShell>
  );
}
