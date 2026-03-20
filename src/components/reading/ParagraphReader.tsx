import { useState, useMemo, useCallback, useEffect } from 'react';
import type { WordDefinition } from '@/types';
import { ClickableWord } from './ClickableWord';
import { WordPopup } from './WordPopup';
import styles from './ParagraphReader.module.css';

interface ParagraphReaderProps {
  text: string;
  translation: string;
  dictionary: WordDefinition[];
  showTranslation: boolean;
}

function stripPunctuation(word: string): string {
  return word.replace(/^[.,!?;:"""„»«()–—\-]+|[.,!?;:"""„»«()–—\-]+$/g, '');
}

export function ParagraphReader({
  text,
  translation,
  dictionary,
  showTranslation,
}: ParagraphReaderProps) {
  const [activeDefinition, setActiveDefinition] = useState<WordDefinition | null>(null);

  // Build a lookup map from the dictionary
  const dictMap = useMemo(() => {
    const map = new Map<string, WordDefinition>();
    for (const entry of dictionary) {
      map.set(entry.word.toLowerCase(), entry);
    }
    return map;
  }, [dictionary]);

  const words = useMemo(() => text.split(/(\s+)/), [text]);

  const handleWordClick = useCallback((definition: WordDefinition) => {
    setActiveDefinition(definition);
  }, []);

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setActiveDefinition(null);
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, []);

  return (
    <div className={styles.container}>
      <p className={styles.paragraph}>
        {words.map((token, i) => {
          // Whitespace tokens — render as actual spaces
          if (/^\s+$/.test(token)) return <span key={i}>{' '}</span>;

          const cleaned = stripPunctuation(token);
          const definition = dictMap.get(cleaned.toLowerCase());

          return (
            <ClickableWord
              key={i}
              text={token}
              definition={definition}
              onClick={handleWordClick}
            />
          );
        })}
      </p>

      {showTranslation && (
        <p className={styles.translation}>{translation}</p>
      )}

      {activeDefinition && (
        <WordPopup
          definition={activeDefinition}
          onClose={() => setActiveDefinition(null)}
        />
      )}
    </div>
  );
}
