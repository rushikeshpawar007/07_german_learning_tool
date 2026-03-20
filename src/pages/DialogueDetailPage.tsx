import { useParams, Link } from 'react-router-dom';
import { PageShell } from '@/components/layout/PageShell';
import { DialogueViewer } from '@/components/dialogues/DialogueViewer';
import { Badge } from '@/components/shared/Badge';
import { Button } from '@/components/shared/Button';
import { EmptyState } from '@/components/shared/EmptyState';
import { getDialogueById } from '@/data';
import styles from './DialogueDetailPage.module.css';

export function DialogueDetailPage() {
  const { id } = useParams<{ id: string }>();
  const dialogue = id ? getDialogueById(id) : undefined;

  if (!dialogue) {
    return (
      <PageShell>
        <EmptyState
          title="Dialogue not found"
          action={<Link to="/dialogues"><Button>Back to Dialogues</Button></Link>}
        />
      </PageShell>
    );
  }

  return (
    <PageShell
      actions={<Link to="/dialogues"><Button variant="ghost">Back to Dialogues</Button></Link>}
    >
      <div className={styles.header}>
        <div className={styles.badges}>
          <Badge variant="info">{dialogue.level}</Badge>
          <Badge>{dialogue.situation}</Badge>
        </div>
        <h1 className={styles.title}>{dialogue.title}</h1>
        <p className={styles.titleEn}>{dialogue.titleEn}</p>
        <p className={styles.description}>{dialogue.description}</p>
      </div>
      <DialogueViewer dialogue={dialogue} />
    </PageShell>
  );
}
