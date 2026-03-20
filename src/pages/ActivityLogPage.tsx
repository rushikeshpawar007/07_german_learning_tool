import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { PageShell } from '@/components/layout/PageShell';
import { Badge } from '@/components/shared/Badge';
import { Button } from '@/components/shared/Button';
import { EmptyState } from '@/components/shared/EmptyState';
import { useProgress } from '@/hooks/useProgress';
import { getSentenceById, getVocabById } from '@/data';
import styles from './ActivityLogPage.module.css';

type FilterType = 'all' | 'correct' | 'incorrect';
type TabType = 'sentences' | 'vocab-quiz';

export function ActivityLogPage() {
  const { progress } = useProgress();
  const [filter, setFilter] = useState<FilterType>('all');
  const [tab, setTab] = useState<TabType>('sentences');

  const entries = useMemo(() => {
    const items = Object.values(progress.sentencesProgress)
      .filter((sp) => sp.attempted)
      .map((sp) => {
        const sentence = getSentenceById(sp.sentenceId);
        return { ...sp, sentence };
      })
      .filter((item) => item.sentence)
      .sort((a, b) => (b.lastAttempted ?? 0) - (a.lastAttempted ?? 0));

    if (filter === 'correct') return items.filter((i) => i.completedCorrectly);
    if (filter === 'incorrect') return items.filter((i) => !i.completedCorrectly);
    return items;
  }, [progress.sentencesProgress, filter]);

  const totalAttempted = Object.values(progress.sentencesProgress).filter((s) => s.attempted).length;
  const totalCorrect = Object.values(progress.sentencesProgress).filter((s) => s.completedCorrectly).length;
  const totalIncorrect = totalAttempted - totalCorrect;

  const quizLog = useMemo(() => {
    return [...(progress.vocabQuizLog ?? [])].sort((a, b) => b.timestamp - a.timestamp);
  }, [progress.vocabQuizLog]);

  return (
    <PageShell
      title="Activity Log"
      subtitle="Review your learning progress"
    >
      <div className={styles.tabBar}>
        <button
          className={`${styles.tabBtn} ${tab === 'sentences' ? styles.tabActive : ''}`}
          onClick={() => setTab('sentences')}
        >
          Sentence Builder
        </button>
        <button
          className={`${styles.tabBtn} ${tab === 'vocab-quiz' ? styles.tabActive : ''}`}
          onClick={() => setTab('vocab-quiz')}
        >
          Vocab Quiz ({quizLog.length})
        </button>
      </div>

      {tab === 'vocab-quiz' && (
        <div>
          {quizLog.length === 0 ? (
            <EmptyState
              title="No quiz attempts yet"
              description="Take a vocab quiz to see your history here."
              action={<Link to="/vocab-quiz"><Button>Start a Quiz</Button></Link>}
            />
          ) : (
            <div className={styles.list}>
              {quizLog.map((quiz, i) => (
                <div key={i} className={styles.card}>
                  <div className={styles.cardHeader}>
                    <Badge variant={quiz.unknownCount === 0 ? 'success' : quiz.knownCount > quiz.unknownCount ? 'info' : 'error'}>
                      {Math.round((quiz.knownCount / quiz.totalWords) * 100)}%
                    </Badge>
                    <span className={styles.attempts}>
                      {quiz.situation === 'all' ? 'All words' : quiz.situation}
                    </span>
                    <span className={styles.date}>
                      {new Date(quiz.timestamp).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </span>
                  </div>
                  <div className={styles.quizScore}>
                    <span className={styles.quizKnown}>{quiz.knownCount} known</span>
                    <span className={styles.quizDivider}>/</span>
                    <span className={styles.quizUnknown}>{quiz.unknownCount} to review</span>
                    <span className={styles.quizTotal}>({quiz.totalWords} total)</span>
                  </div>
                  {quiz.unknownWordIds.length > 0 && (
                    <div className={styles.quizWords}>
                      <span className={styles.quizWordsLabel}>Didn't know:</span>
                      {quiz.unknownWordIds.map((id) => {
                        const w = getVocabById(id);
                        return w ? (
                          <Link key={id} to={`/vocabulary/${id}`} className={styles.quizWordLink}>
                            {w.word}
                          </Link>
                        ) : null;
                      })}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {tab === 'sentences' && (
      <>
      <div className={styles.stats}>
        <div className={styles.statItem}>
          <span className={styles.statNumber}>{totalAttempted}</span>
          <span className={styles.statLabel}>Attempted</span>
        </div>
        <div className={styles.statItem}>
          <span className={`${styles.statNumber} ${styles.correct}`}>{totalCorrect}</span>
          <span className={styles.statLabel}>Correct</span>
        </div>
        <div className={styles.statItem}>
          <span className={`${styles.statNumber} ${styles.incorrect}`}>{totalIncorrect}</span>
          <span className={styles.statLabel}>Incorrect</span>
        </div>
      </div>

      <div className={styles.filters}>
        {(['all', 'correct', 'incorrect'] as FilterType[]).map((f) => (
          <button
            key={f}
            className={`${styles.filterBtn} ${filter === f ? styles.active : ''}`}
            onClick={() => setFilter(f)}
          >
            {f === 'all' ? `All (${totalAttempted})` : f === 'correct' ? `Correct (${totalCorrect})` : `Incorrect (${totalIncorrect})`}
          </button>
        ))}
      </div>

      {entries.length === 0 ? (
        <EmptyState
          title={filter === 'all' ? 'No attempts yet' : `No ${filter} attempts`}
          description={filter === 'all' ? 'Start practicing in the Sentence Builder!' : 'Try a different filter.'}
          action={
            filter === 'all' ? (
              <Link to="/builder"><Button>Go to Builder</Button></Link>
            ) : undefined
          }
        />
      ) : (
        <div className={styles.list}>
          {entries.map((entry) => (
            <div key={entry.sentenceId} className={styles.card}>
              <div className={styles.cardHeader}>
                <Badge variant={entry.completedCorrectly ? 'success' : 'error'}>
                  {entry.completedCorrectly ? 'Correct' : 'Incorrect'}
                </Badge>
                <span className={styles.attempts}>
                  {entry.attempts} attempt{entry.attempts !== 1 ? 's' : ''}
                </span>
                {entry.lastAttempted && (
                  <span className={styles.date}>
                    {new Date(entry.lastAttempted).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </span>
                )}
              </div>

              <p className={styles.german}>{entry.sentence!.de}</p>
              <p className={styles.english}>{entry.sentence!.en}</p>

              {entry.attemptHistory && entry.attemptHistory.length > 0 && (
                <div className={styles.history}>
                  {entry.attemptHistory.slice(-3).map((attempt, i) => (
                    <div
                      key={i}
                      className={`${styles.attemptItem} ${attempt.correct ? styles.attemptCorrect : styles.attemptIncorrect}`}
                    >
                      <span className={styles.attemptIcon}>
                        {attempt.correct ? '\u2713' : '\u2717'}
                      </span>
                      <span className={styles.attemptAnswer}>{attempt.userAnswer}</span>
                    </div>
                  ))}
                </div>
              )}

              <div className={styles.cardFooter}>
                <Link to={`/builder/${entry.sentenceId}`}>
                  <Button size="sm" variant={entry.completedCorrectly ? 'ghost' : 'primary'}>
                    {entry.completedCorrectly ? 'Practice Again' : 'Try Again'}
                  </Button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
      </>
      )}
    </PageShell>
  );
}
