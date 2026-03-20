import { useParams, Link } from 'react-router-dom';
import { PageShell } from '@/components/layout/PageShell';
import { VocabPanel } from '@/components/vocabulary/VocabPanel';
import { Button } from '@/components/shared/Button';
import { EmptyState } from '@/components/shared/EmptyState';
import { useVocabulary } from '@/hooks/useVocabulary';
import { useProgress } from '@/hooks/useProgress';
import { useEffect } from 'react';

export function VocabularyDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { getById } = useVocabulary();
  const { markWordSeen } = useProgress();

  const word = id ? getById(id) : undefined;

  useEffect(() => {
    if (word) {
      markWordSeen(word.id);
    }
  }, [word, markWordSeen]);

  if (!word) {
    return (
      <PageShell>
        <EmptyState
          title="Word not found"
          description="This vocabulary word doesn't exist."
          action={<Link to="/vocabulary"><Button>Back to Vocabulary</Button></Link>}
        />
      </PageShell>
    );
  }

  return (
    <PageShell
      actions={<Link to="/vocabulary"><Button variant="ghost">Back to list</Button></Link>}
    >
      <VocabPanel word={word} />
    </PageShell>
  );
}
