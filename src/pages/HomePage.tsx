import { PageShell } from '@/components/layout/PageShell';
import { SituationCard } from '@/components/situations/SituationCard';
import { Button } from '@/components/shared/Button';
import { ProgressBar } from '@/components/shared/ProgressBar';
import { situations, getAllVocab, getAllSentences, getVocabBySituation, getSentencesBySituation, getAllGrammarLessons } from '@/data';
import { GRAMMAR_CATEGORY_LABELS } from '@/utils/constants';
import { useProgress } from '@/hooks/useProgress';
import { Link } from 'react-router-dom';
import styles from './HomePage.module.css';

export function HomePage() {
  const { progress } = useProgress();
  const totalWords = getAllVocab().length;
  const totalSentences = getAllSentences().length;
  const wordsSeen = Object.values(progress.wordsProgress).filter((w) => w.seen).length;
  const sentencesDone = Object.values(progress.sentencesProgress).filter((s) => s.completedCorrectly).length;

  // Only show situations that have content
  const activeSituations = situations.filter((s) => {
    return getVocabBySituation(s.slug).length > 0 || getSentencesBySituation(s.slug).length > 0;
  });

  return (
    <PageShell>
      <div className={styles.hero}>
        <h1 className={styles.title}>Learn German, the way it's actually spoken</h1>
        <p className={styles.subtitle}>
          Build real-world fluency through situations, sentences, and practice.
          Designed for A2 learners moving toward B1/B2.
        </p>
        <div className={styles.heroCta}>
          <Link to="/situations">
            <Button size="lg">Start Learning</Button>
          </Link>
          <Link to="/builder">
            <Button variant="secondary" size="lg">Sentence Builder</Button>
          </Link>
        </div>
      </div>

      <div className={styles.stats}>
        <div className={styles.statCard}>
          <ProgressBar value={wordsSeen} max={totalWords} label="Words explored" />
          <span className={styles.statDetail}>{wordsSeen} / {totalWords}</span>
        </div>
        <div className={styles.statCard}>
          <ProgressBar value={sentencesDone} max={totalSentences} label="Sentences completed" />
          <span className={styles.statDetail}>{sentencesDone} / {totalSentences}</span>
        </div>
      </div>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Situations</h2>
        <p className={styles.sectionSubtitle}>
          Learn vocabulary and sentences grouped by real-life scenarios
        </p>
        <div className={styles.situationGrid}>
          {activeSituations.map((s) => (
            <SituationCard
              key={s.slug}
              situation={s}
              wordCount={getVocabBySituation(s.slug).length}
              sentenceCount={getSentencesBySituation(s.slug).length}
            />
          ))}
        </div>
      </section>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Grammar</h2>
        <p className={styles.sectionSubtitle}>
          Master the rules behind the language — cases, word order, verb forms, and more
        </p>
        <div className={styles.grammarPreview}>
          {(['cases', 'word-order', 'verbs', 'prepositions'] as const).map((cat) => (
            <Link key={cat} to="/grammar" className={styles.grammarCat}>
              <span className={styles.grammarCatName}>{GRAMMAR_CATEGORY_LABELS[cat]}</span>
              <span className={styles.grammarCatCount}>
                {getAllGrammarLessons().filter((l) => l.category === cat).length} lessons
              </span>
            </Link>
          ))}
        </div>
        <div style={{ textAlign: 'center', marginTop: 'var(--space-4)' }}>
          <Link to="/grammar">
            <Button variant="secondary">View All Grammar Lessons</Button>
          </Link>
        </div>
      </section>
    </PageShell>
  );
}
