import { PageShell } from '@/components/layout/PageShell';
import { SituationCard } from '@/components/situations/SituationCard';
import { situations, getVocabBySituation, getSentencesBySituation } from '@/data';
import styles from './SituationListPage.module.css';

export function SituationListPage() {
  return (
    <PageShell
      title="Situations"
      subtitle="Learn German through real-life scenarios"
    >
      <div className={styles.grid}>
        {situations.map((s) => (
          <SituationCard
            key={s.slug}
            situation={s}
            wordCount={getVocabBySituation(s.slug).length}
            sentenceCount={getSentencesBySituation(s.slug).length}
          />
        ))}
      </div>
    </PageShell>
  );
}
