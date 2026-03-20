import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { PageShell } from '@/components/layout/PageShell';
import { VocabGrid } from '@/components/vocabulary/VocabGrid';
import { Button } from '@/components/shared/Button';
import { SearchInput } from '@/components/shared/SearchInput';
import { useVocabulary } from '@/hooks/useVocabulary';
import { useProgress } from '@/hooks/useProgress';
import { useLearningMode } from '@/context/LearningModeContext';
import type { SituationSlug, CefrLevel } from '@/types';
import { situations } from '@/data';
import styles from './VocabularyListPage.module.css';

export function VocabularyListPage() {
  const [search, setSearch] = useState('');
  const [situation, setSituation] = useState<SituationSlug | ''>('');
  const [level, setLevel] = useState<CefrLevel | ''>('');
  const { mode } = useLearningMode();
  const { progress } = useProgress();

  const { vocab, total } = useVocabulary({
    search,
    situation: situation || undefined,
    level: level || undefined,
  });

  const displayVocab = useMemo(() => {
    if (mode === 'review') {
      return vocab.filter((w) => progress.wordsProgress[w.id]?.seen);
    }
    return vocab;
  }, [vocab, mode, progress.wordsProgress]);

  return (
    <PageShell
      title="Vocabulary"
      subtitle={`${displayVocab.length} of ${total} words${mode === 'review' ? ' (review mode)' : ''}`}
      actions={<Link to="/vocab-quiz"><Button>Quiz Me</Button></Link>}
    >
      <div className={styles.filters}>
        <SearchInput
          value={search}
          onChange={setSearch}
          placeholder="Search words..."
        />
        <select
          className={styles.select}
          value={situation}
          onChange={(e) => setSituation(e.target.value as SituationSlug | '')}
        >
          <option value="">All situations</option>
          {situations.map((s) => (
            <option key={s.slug} value={s.slug}>{s.name}</option>
          ))}
        </select>
        <select
          className={styles.select}
          value={level}
          onChange={(e) => setLevel(e.target.value as CefrLevel | '')}
        >
          <option value="">All levels</option>
          <option value="A2">A2</option>
          <option value="B1">B1</option>
          <option value="B2">B2</option>
        </select>
      </div>
      <VocabGrid words={displayVocab} />
    </PageShell>
  );
}
