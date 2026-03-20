import type { TileState } from '@/hooks/useSentenceBuilder';
import { WordTile } from './WordTile';
import styles from './DropZone.module.css';

interface DropZoneProps {
  tiles: TileState[];
  onTileClick: (tileId: number) => void;
  phase: 'building' | 'submitted' | 'feedback';
  isCorrect?: boolean;
}

export function DropZone({ tiles, onTileClick, phase, isCorrect }: DropZoneProps) {
  const variant =
    phase === 'feedback'
      ? isCorrect
        ? 'correct'
        : 'incorrect'
      : 'answer';

  return (
    <div className={`${styles.zone} ${phase === 'feedback' ? (isCorrect ? styles.correct : styles.incorrect) : ''}`}>
      {tiles.length === 0 ? (
        <p className={styles.placeholder}>Click words below to build your sentence...</p>
      ) : (
        <div className={styles.tiles}>
          {tiles.map((tile) => (
            <WordTile
              key={tile.id}
              text={tile.text}
              onClick={() => onTileClick(tile.id)}
              variant={phase === 'feedback' ? variant : 'answer'}
            />
          ))}
        </div>
      )}
    </div>
  );
}
