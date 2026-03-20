import type { WordDefinition } from '@/types';
import styles from './WordPopup.module.css';

interface WordPopupProps {
  definition: WordDefinition;
  onClose: () => void;
}

export function WordPopup({ definition, onClose }: WordPopupProps) {
  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.popup} onClick={(e) => e.stopPropagation()}>
        <button className={styles.close} onClick={onClose} aria-label="Close">
          &#10005;
        </button>
        <div className={styles.word}>{definition.word}</div>
        {definition.baseForm !== definition.word.toLowerCase() && (
          <div className={styles.baseForm}>
            Base form: <strong>{definition.baseForm}</strong>
          </div>
        )}
        <div className={styles.translation}>{definition.translation}</div>
        <div className={styles.meta}>
          <span className={styles.pos}>{definition.partOfSpeech}</span>
          {definition.contextNote && (
            <span className={styles.context}>{definition.contextNote}</span>
          )}
        </div>
      </div>
    </div>
  );
}
