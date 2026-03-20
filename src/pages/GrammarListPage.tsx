import { useState, useMemo } from 'react';
import { PageShell } from '@/components/layout/PageShell';
import { GrammarCard } from '@/components/grammar/GrammarCard';
import type { GrammarCategory } from '@/types';
import { getAllGrammarLessons } from '@/data';
import styles from './GrammarListPage.module.css';

const categories: { value: GrammarCategory | ''; label: string }[] = [
  { value: '', label: 'All topics' },
  { value: 'cases', label: 'Cases & Articles' },
  { value: 'word-order', label: 'Word Order' },
  { value: 'verbs', label: 'Verb Forms' },
  { value: 'prepositions', label: 'Prepositions' },
];

export function GrammarListPage() {
  const [category, setCategory] = useState<GrammarCategory | ''>('');
  const allLessons = useMemo(() => getAllGrammarLessons(), []);

  const filtered = useMemo(() => {
    if (!category) return allLessons;
    return allLessons.filter((l) => l.category === category);
  }, [allLessons, category]);

  return (
    <PageShell
      title="Grammar"
      subtitle={`${filtered.length} lessons to master German grammar`}
    >
      <div className={styles.filters}>
        {categories.map((c) => (
          <button
            key={c.value}
            className={`${styles.filterBtn} ${category === c.value ? styles.active : ''}`}
            onClick={() => setCategory(c.value)}
          >
            {c.label}
          </button>
        ))}
      </div>
      <div className={styles.grid}>
        {filtered.map((lesson) => (
          <GrammarCard key={lesson.id} lesson={lesson} />
        ))}
      </div>
    </PageShell>
  );
}
