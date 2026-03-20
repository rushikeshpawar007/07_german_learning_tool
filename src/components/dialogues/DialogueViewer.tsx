import { useState } from 'react';
import type { Dialogue } from '@/types';
import styles from './DialogueViewer.module.css';

interface DialogueViewerProps {
  dialogue: Dialogue;
}

export function DialogueViewer({ dialogue }: DialogueViewerProps) {
  const [revealedLines, setRevealedLines] = useState<Set<number>>(new Set());
  const [showAllTranslations, setShowAllTranslations] = useState(false);

  const toggleLine = (index: number) => {
    setRevealedLines((prev) => {
      const next = new Set(prev);
      if (next.has(index)) next.delete(index);
      else next.add(index);
      return next;
    });
  };

  const isRevealed = (index: number) => showAllTranslations || revealedLines.has(index);

  return (
    <div className={styles.container}>
      <div className={styles.controls}>
        <button
          className={styles.toggleBtn}
          onClick={() => setShowAllTranslations(!showAllTranslations)}
        >
          {showAllTranslations ? 'Hide' : 'Show'} all translations
        </button>
      </div>

      <div className={styles.speakers}>
        <div className={styles.speakerTag} style={{ backgroundColor: 'var(--color-terracotta-light)' }}>
          {dialogue.speakers.a.name} — {dialogue.speakers.a.role}
        </div>
        <div className={styles.speakerTag} style={{ backgroundColor: 'var(--color-sage-light)' }}>
          {dialogue.speakers.b.name} — {dialogue.speakers.b.role}
        </div>
      </div>

      <div className={styles.conversation}>
        {dialogue.lines.map((line, i) => (
          <div
            key={i}
            className={`${styles.line} ${line.speaker === 'a' ? styles.speakerA : styles.speakerB}`}
            onClick={() => toggleLine(i)}
          >
            <span className={styles.speakerName}>
              {line.speaker === 'a' ? dialogue.speakers.a.name : dialogue.speakers.b.name}
            </span>
            <p className={styles.german}>{line.de}</p>
            {isRevealed(i) && (
              <p className={styles.english}>{line.en}</p>
            )}
            {!isRevealed(i) && (
              <span className={styles.clickHint}>click to translate</span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
