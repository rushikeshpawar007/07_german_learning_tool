import { useParams, Link, useNavigate } from 'react-router-dom';
import { useMemo } from 'react';
import { PageShell } from '@/components/layout/PageShell';
import { VocabGrid } from '@/components/vocabulary/VocabGrid';
import { SentenceList } from '@/components/sentences/SentenceList';
import { Button } from '@/components/shared/Button';
import { EmptyState } from '@/components/shared/EmptyState';
import { getSituationBySlug, getVocabBySituation, getSentencesBySituation } from '@/data';
import { useLearningMode } from '@/context/LearningModeContext';
import { useProgress } from '@/hooks/useProgress';
import styles from './SituationDetailPage.module.css';

export function SituationDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { mode } = useLearningMode();
  const { progress } = useProgress();

  const situation = slug ? getSituationBySlug(slug) : undefined;
  const allVocab = slug ? getVocabBySituation(slug as never) : [];
  const allSentences = slug ? getSentencesBySituation(slug as never) : [];

  const vocab = useMemo(() => {
    if (mode === 'review') return allVocab.filter((w) => progress.wordsProgress[w.id]?.seen);
    return allVocab;
  }, [allVocab, mode, progress.wordsProgress]);

  const sentences = useMemo(() => {
    if (mode === 'review') return allSentences.filter((s) => progress.sentencesProgress[s.id]?.attempted);
    return allSentences;
  }, [allSentences, mode, progress.sentencesProgress]);

  if (!situation) {
    return (
      <PageShell>
        <EmptyState
          title="Situation not found"
          action={<Link to="/situations"><Button>Back to Situations</Button></Link>}
        />
      </PageShell>
    );
  }

  const handlePractice = (sentenceId: string) => {
    navigate(`/builder/${sentenceId}`);
  };

  return (
    <PageShell
      title={situation.name}
      subtitle={situation.description}
      actions={
        <div className={styles.actions}>
          <Link to="/situations">
            <Button variant="ghost">Back</Button>
          </Link>
          {sentences.length > 0 && (
            <Link to={`/builder/${sentences[0]!.id}`}>
              <Button>Practice Sentences</Button>
            </Link>
          )}
        </div>
      }
    >
      {sentences.length > 0 && (
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>
            Sentences ({sentences.length})
          </h2>
          <SentenceList sentences={sentences} onPractice={handlePractice} />
        </section>
      )}

      {vocab.length > 0 && (
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>
            Vocabulary ({vocab.length})
          </h2>
          <VocabGrid words={vocab} />
        </section>
      )}
    </PageShell>
  );
}
