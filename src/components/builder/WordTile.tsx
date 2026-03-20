import styles from './WordTile.module.css';

interface WordTileProps {
  text: string;
  onClick: () => void;
  variant?: 'bank' | 'answer' | 'correct' | 'incorrect';
}

export function WordTile({ text, onClick, variant = 'bank' }: WordTileProps) {
  return (
    <button
      className={`${styles.tile} ${styles[variant]}`}
      onClick={onClick}
    >
      {text}
    </button>
  );
}
