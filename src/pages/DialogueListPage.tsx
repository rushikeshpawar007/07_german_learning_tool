import { useMemo } from 'react';
import { PageShell } from '@/components/layout/PageShell';
import { DialogueCard } from '@/components/dialogues/DialogueCard';
import { getAllDialogues } from '@/data';
import styles from './DialogueListPage.module.css';

export function DialogueListPage() {
  const dialogues = useMemo(() => getAllDialogues(), []);

  return (
    <PageShell
      title="Dialogues"
      subtitle="Practice real German conversations — click any line to see its translation"
    >
      <div className={styles.grid}>
        {dialogues.map((d) => (
          <DialogueCard key={d.id} dialogue={d} />
        ))}
      </div>
    </PageShell>
  );
}
