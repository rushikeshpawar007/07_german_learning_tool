import { useState } from 'react';
import type { VocabWord } from '@/types';
import { Badge } from '@/components/shared/Badge';
import styles from './Flashcard.module.css';

interface FlashcardProps {
  word: VocabWord;
  current: number;
  total: number;
  onKnow: () => void;
  onDontKnow: () => void;
}

function generateLetterHint(meaning: string): string {
  if (meaning.length <= 1) return meaning;
  const rest = '_'.repeat(meaning.length - 1);
  return `${meaning[0]}${rest} (${meaning.length} letters)`;
}

function generateExampleHint(word: VocabWord): string | null {
  const example = word.examples[0];
  if (!example) return null;
  const regex = new RegExp(word.baseForm, 'gi');
  return example.de.replace(regex, '___');
}

export function Flashcard({ word, current, total, onKnow, onDontKnow }: FlashcardProps) {
  const [flipped, setFlipped] = useState(false);
  const [hintLevel, setHintLevel] = useState(0);

  const hints: string[] = [];

  // Hint 1: usage note
  if (word.usageNotes.length > 0) {
    hints.push(word.usageNotes[0]!);
  }

  // Hint 2: letter hint
  hints.push(generateLetterHint(word.meaningEn));

  // Hint 3: example sentence with blank
  const exampleHint = generateExampleHint(word);
  if (exampleHint) {
    hints.push(exampleHint);
  }

  const showHint = () => {
    if (hintLevel < hints.length) {
      setHintLevel(hintLevel + 1);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.progress}>
        {current} / {total}
      </div>

      <div className={styles.cardWrapper}>
        <div className={`${styles.card} ${flipped ? styles.flipped : ''}`}>
          <div className={styles.front}>
            <span className={styles.wordText}>{word.word}</span>

            {hintLevel > 0 && (
              <div className={styles.hints}>
                {hints.slice(0, hintLevel).map((hint, i) => (
                  <div key={i} className={styles.hint}>
                    <span className={styles.hintNumber}>Hint {i + 1}:</span> {hint}
                  </div>
                ))}
              </div>
            )}

            <div className={styles.frontActions}>
              {hintLevel < hints.length && (
                <button className={styles.hintBtn} onClick={showHint}>
                  Get Hint ({hintLevel + 1}/{hints.length})
                </button>
              )}
              <button className={styles.flipBtn} onClick={() => setFlipped(true)}>
                Flip Card
              </button>
            </div>
          </div>

          <div className={styles.back}>
            <span className={styles.wordText}>{word.word}</span>
            <span className={styles.meaning}>{word.meaningEn}</span>
            {word.meaningDe && (
              <span className={styles.meaningDe}>{word.meaningDe}</span>
            )}
            <div className={styles.metaRow}>
              <Badge>{word.wordClass}</Badge>
              {word.gender && <Badge variant="info">{word.gender}</Badge>}
              <Badge>{word.level}</Badge>
            </div>
            {word.examples[0] && (
              <div className={styles.example}>
                <p className={styles.exampleDe}>{word.examples[0].de}</p>
                <p className={styles.exampleEn}>{word.examples[0].en}</p>
              </div>
            )}
            <div className={styles.assessButtons}>
              <button className={styles.dontKnowBtn} onClick={onDontKnow}>
                Don't Know
              </button>
              <button className={styles.knowBtn} onClick={onKnow}>
                Know It
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
