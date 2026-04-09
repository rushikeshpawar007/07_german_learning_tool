import { PageShell } from '@/components/layout/PageShell';
import { Flashcard } from '@/components/vocabulary/Flashcard';
import { MiniBuilder } from '@/components/review/MiniBuilder';
import { ClozeCard } from '@/components/review/ClozeCard';
import { ReviewHeader } from '@/components/review/ReviewHeader';
import { ReviewComplete } from '@/components/review/ReviewComplete';
import { EmptyState } from '@/components/shared/EmptyState';
import { Button } from '@/components/shared/Button';
import { useReviewQueue } from '@/hooks/useReviewQueue';
import { useProgress } from '@/hooks/useProgress';
import { qualityFromFlashcard, qualityFromBuilder, qualityFromCloze } from '@/utils/srs';
import { generateCloze } from '@/utils/cloze';
import { Link } from 'react-router-dom';
import styles from './ReviewPage.module.css';

export function ReviewPage() {
  const { recordWordPractice, markWordSeen, recordSentenceAttempt, recordDailyGoalProgress, progress } = useProgress();
  const { queue, currentItem, currentIndex, isComplete, advance, skip, dailyGoal, stats } = useReviewQueue();

  if (queue.length === 0) {
    return (
      <PageShell title="Daily Review">
        <EmptyState
          title="No items to review!"
          description="You're all caught up. Start exploring vocabulary to add words to your review queue."
          action={
            <Link to="/vocabulary" style={{ textDecoration: 'none' }}>
              <Button>Explore Vocabulary</Button>
            </Link>
          }
        />
      </PageShell>
    );
  }

  if (isComplete) {
    return (
      <PageShell title="Daily Review">
        <ReviewComplete stats={stats} streak={progress.streak} />
      </PageShell>
    );
  }

  const handleFlashcardKnow = () => {
    if (!currentItem?.vocabWord) return;
    const quality = qualityFromFlashcard(true, false);
    markWordSeen(currentItem.vocabWord.id);
    recordWordPractice(currentItem.vocabWord.id, true, quality);
    recordDailyGoalProgress('word');
    advance(true);
  };

  const handleFlashcardDontKnow = () => {
    if (!currentItem?.vocabWord) return;
    const quality = qualityFromFlashcard(false, false);
    markWordSeen(currentItem.vocabWord.id);
    recordWordPractice(currentItem.vocabWord.id, false, quality);
    recordDailyGoalProgress('word');
    advance(false);
  };

  const handleBuilderComplete = (correct: boolean) => {
    if (!currentItem?.sentence) return;
    const quality = qualityFromBuilder(correct, 1);
    recordSentenceAttempt(currentItem.sentence.id, correct, '', currentItem.sentence.de);
    recordDailyGoalProgress('sentence');
    for (const vocabId of currentItem.sentence.vocabIds) {
      recordWordPractice(vocabId, correct, quality);
    }
    advance(correct);
  };

  const handleClozeComplete = (allCorrect: boolean, _blanksCorrect: number, _blanksTotal: number) => {
    if (!currentItem?.sentence) return;
    const quality = qualityFromCloze(allCorrect, 0);
    recordDailyGoalProgress('cloze');
    for (const vocabId of currentItem.sentence.vocabIds) {
      recordWordPractice(vocabId, allCorrect, quality);
    }
    // Auto-advance after a short delay for cloze
    setTimeout(() => advance(allCorrect), 1500);
  };

  return (
    <PageShell>
      <ReviewHeader
        dailyGoal={dailyGoal}
        streak={progress.streak}
        completed={stats.completed}
        total={stats.total}
      />

      <div className={styles.body}>
        {currentItem?.type === 'flashcard' && currentItem.vocabWord && (
          <div className={styles.itemContainer}>
            <div className={styles.reason}>{currentItem.reason}</div>
            <Flashcard
              key={currentItem.vocabWord.id}
              word={currentItem.vocabWord}
              current={currentIndex + 1}
              total={queue.length}
              onKnow={handleFlashcardKnow}
              onDontKnow={handleFlashcardDontKnow}
            />
          </div>
        )}

        {currentItem?.type === 'builder' && currentItem.sentence && (
          <div className={styles.itemContainer}>
            <div className={styles.reason}>{currentItem.reason}</div>
            <MiniBuilder
              key={currentItem.sentence.id}
              sentence={currentItem.sentence}
              onComplete={handleBuilderComplete}
            />
          </div>
        )}

        {currentItem?.type === 'cloze' && currentItem.sentence && (
          <div className={styles.itemContainer}>
            <div className={styles.reason}>{currentItem.reason}</div>
            <ClozeCard
              key={currentItem.sentence.id}
              exercise={generateCloze(currentItem.sentence)}
              onComplete={handleClozeComplete}
            />
          </div>
        )}
      </div>

      <div className={styles.footer}>
        <button className={styles.skipBtn} onClick={skip}>
          Skip
        </button>
        <button className={styles.endBtn} onClick={() => advance()}>
          End Session
        </button>
      </div>
    </PageShell>
  );
}
