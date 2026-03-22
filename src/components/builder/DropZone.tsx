import type { TileState } from '@/hooks/useSentenceBuilder';
import { WordTile } from './WordTile';
import styles from './DropZone.module.css';

interface DropZoneProps {
  tiles: TileState[];
  onTileClick: (tileId: number) => void;
  phase: 'building' | 'submitted' | 'feedback';
  isCorrect?: boolean;
  tileResults?: Record<number, 'correct' | 'incorrect'>;
}

export function DropZone({ tiles, onTileClick, phase, isCorrect, tileResults }: DropZoneProps) {
  return (
    <div className={`${styles.zone} ${phase === 'feedback' ? (isCorrect ? styles.correct : styles.incorrect) : ''}`}>
      {tiles.length === 0 ? (
        <p className={styles.placeholder}>Click words below to build your sentence...</p>
      ) : (
        <div className={styles.tiles}>
          {tiles.map((tile) => {
            let variant: 'bank' | 'answer' | 'correct' | 'incorrect' = 'answer';
            if (phase === 'feedback') {
              if (isCorrect) {
                variant = 'correct';
              } else {
                variant = tileResults?.[tile.id] ?? 'incorrect';
              }
            }
            return (
              <WordTile
                key={tile.id}
                text={tile.text}
                onClick={() => onTileClick(tile.id)}
                variant={variant}
              />
            );
          })}
        </div>
      )}
    </div>
  );
}
