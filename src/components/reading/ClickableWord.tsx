import type { WordDefinition } from '@/types';
import styles from './ClickableWord.module.css';

interface ClickableWordProps {
  text: string;
  definition: WordDefinition | undefined;
  onClick: (definition: WordDefinition) => void;
}

export function ClickableWord({ text, definition, onClick }: ClickableWordProps) {
  if (!definition) {
    return <span className={styles.plain}>{text}</span>;
  }

  return (
    <button
      className={styles.word}
      onClick={() => onClick(definition)}
      title="Click to see translation"
    >
      {text}
    </button>
  );
}
