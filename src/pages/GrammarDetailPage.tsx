import { useParams, Link } from 'react-router-dom';
import { PageShell } from '@/components/layout/PageShell';
import { GrammarSection } from '@/components/grammar/GrammarSection';
import { GrammarTableView } from '@/components/grammar/GrammarTableView';
import { MistakeBlock } from '@/components/grammar/MistakeBlock';
import { Badge } from '@/components/shared/Badge';
import { Button } from '@/components/shared/Button';
import { EmptyState } from '@/components/shared/EmptyState';
import { getGrammarLessonById } from '@/data';
import { GRAMMAR_CATEGORY_LABELS } from '@/utils/constants';
import styles from './GrammarDetailPage.module.css';

export function GrammarDetailPage() {
  const { topicId } = useParams<{ topicId: string }>();
  const lesson = topicId ? getGrammarLessonById(topicId) : undefined;

  if (!lesson) {
    return (
      <PageShell>
        <EmptyState
          title="Grammar topic not found"
          action={<Link to="/grammar"><Button>Back to Grammar</Button></Link>}
        />
      </PageShell>
    );
  }

  return (
    <PageShell
      actions={<Link to="/grammar"><Button variant="ghost">Back to Grammar</Button></Link>}
    >
      <article className={styles.article}>
        <header className={styles.header}>
          <div className={styles.badges}>
            <Badge variant="info">{lesson.level}</Badge>
            <Badge>{GRAMMAR_CATEGORY_LABELS[lesson.category] ?? lesson.category}</Badge>
          </div>
          <h1 className={styles.title}>{lesson.title}</h1>
          <p className={styles.description}>{lesson.description}</p>
          {lesson.id === 'perfekt' && (
            <Link to="/grammar/perfekt-verbs" style={{ display: 'inline-block', marginTop: 'var(--space-4)' }}>
              <Button>View 100 Most Useful Perfekt Verbs</Button>
            </Link>
          )}
        </header>

        <section className={styles.block}>
          <h2 className={styles.blockTitle}>When to use it</h2>
          <ul className={styles.bulletList}>
            {lesson.whenToUse.map((item, i) => (
              <li key={i}>{item}</li>
            ))}
          </ul>
        </section>

        {lesson.tables.length > 0 && (
          <section className={styles.block}>
            <h2 className={styles.blockTitle}>Reference Tables</h2>
            {lesson.tables.map((table, i) => (
              <GrammarTableView key={i} table={table} />
            ))}
          </section>
        )}

        <section className={styles.block}>
          <h2 className={styles.blockTitle}>Rules & Examples</h2>
          {lesson.rules.map((rule, i) => (
            <GrammarSection key={i} rule={rule} />
          ))}
        </section>

        {lesson.commonMistakes.length > 0 && (
          <section className={styles.block}>
            <h2 className={styles.blockTitle}>Common Mistakes</h2>
            <MistakeBlock mistakes={lesson.commonMistakes} />
          </section>
        )}

        {lesson.tips.length > 0 && (
          <section className={styles.block}>
            <h2 className={styles.blockTitle}>Tips</h2>
            <ul className={styles.tipsList}>
              {lesson.tips.map((tip, i) => (
                <li key={i} className={styles.tip}>{tip}</li>
              ))}
            </ul>
          </section>
        )}

        {lesson.relatedTopics && lesson.relatedTopics.length > 0 && (
          <section className={styles.block}>
            <h2 className={styles.blockTitle}>Related Topics</h2>
            <div className={styles.relatedLinks}>
              {lesson.relatedTopics.map((topicId) => (
                <Link key={topicId} to={`/grammar/${topicId}`} className={styles.relatedLink}>
                  {topicId.replace(/-/g, ' ')}
                </Link>
              ))}
            </div>
          </section>
        )}
      </article>
    </PageShell>
  );
}
