import type { SceneHotspot } from '@/types';
import styles from './SceneTooltip.module.css';

interface SceneTooltipProps {
  hotspot: SceneHotspot;
  position: 'above' | 'below';
}

export function SceneTooltip({ hotspot, position }: SceneTooltipProps) {
  return (
    <div className={`${styles.tooltip} ${styles[position]}`}>
      <div className={styles.header}>
        <span className={styles.word}>
          {hotspot.article && <span className={styles.article}>{hotspot.article} </span>}
          {hotspot.word}
        </span>
        <span className={styles.wordClass}>{hotspot.wordClass}</span>
      </div>
      <p className={styles.meaning}>{hotspot.meaning}</p>
      <div className={styles.sentence}>
        <p className={styles.sentenceDe}>{hotspot.sentence}</p>
        <p className={styles.sentenceEn}>{hotspot.sentenceEn}</p>
      </div>
    </div>
  );
}
