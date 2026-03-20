import type { VocabWord } from '@/types';
import { Tabs } from '@/components/shared/Tabs';
import { Badge } from '@/components/shared/Badge';
import { Tag } from '@/components/shared/Tag';
import { ConjugationTable } from './ConjugationTable';
import styles from './VocabPanel.module.css';

interface VocabPanelProps {
  word: VocabWord;
}

export function VocabPanel({ word }: VocabPanelProps) {
  const tabs = [
    {
      id: 'meaning',
      label: 'Meaning',
      content: (
        <div className={styles.tabContent}>
          <div className={styles.mainWord}>
            <span className={styles.german}>{word.word}</span>
            <Badge variant={word.level === 'B1' ? 'info' : 'default'} size="md">
              {word.level}
            </Badge>
          </div>
          <p className={styles.english}>{word.meaningEn}</p>
          {word.meaningDe && (
            <p className={styles.germanDef}>{word.meaningDe}</p>
          )}
          <div className={styles.metaRow}>
            <Tag>{word.wordClass}</Tag>
            {word.gender && <Tag>{word.gender}</Tag>}
            {word.plural && <Tag>Pl: {word.plural}</Tag>}
          </div>
        </div>
      ),
    },
    {
      id: 'grammar',
      label: 'Grammar',
      content: (
        <div className={styles.tabContent}>
          {word.conjugation ? (
            <ConjugationTable conjugation={word.conjugation} />
          ) : (
            <div className={styles.grammarInfo}>
              {word.gender && (
                <div className={styles.infoRow}>
                  <span className={styles.infoLabel}>Gender:</span>
                  <span className={styles.infoValue}>{word.gender} ({word.word})</span>
                </div>
              )}
              {word.plural && (
                <div className={styles.infoRow}>
                  <span className={styles.infoLabel}>Plural:</span>
                  <span className={styles.infoValue}>{word.plural}</span>
                </div>
              )}
              <div className={styles.infoRow}>
                <span className={styles.infoLabel}>Word class:</span>
                <span className={styles.infoValue}>{word.wordClass}</span>
              </div>
            </div>
          )}
        </div>
      ),
    },
    {
      id: 'usage',
      label: 'Usage',
      content: (
        <div className={styles.tabContent}>
          {word.usageNotes.length > 0 && (
            <ul className={styles.notesList}>
              {word.usageNotes.map((note, i) => (
                <li key={i} className={styles.note}>{note}</li>
              ))}
            </ul>
          )}
          <div className={styles.situationTags}>
            <span className={styles.infoLabel}>Used in:</span>
            <div className={styles.tags}>
              {word.situations.map((s) => (
                <Tag key={s}>{s}</Tag>
              ))}
            </div>
          </div>
        </div>
      ),
    },
    {
      id: 'examples',
      label: 'Examples',
      content: (
        <div className={styles.tabContent}>
          {word.examples.map((ex, i) => (
            <div key={i} className={styles.example}>
              <p className={styles.exampleDe}>{ex.de}</p>
              <p className={styles.exampleEn}>{ex.en}</p>
              {ex.tone && (
                <Badge variant={ex.tone === 'formal' ? 'info' : 'default'}>
                  {ex.tone}
                </Badge>
              )}
            </div>
          ))}
        </div>
      ),
    },
    {
      id: 'mistakes',
      label: 'Mistakes',
      content: (
        <div className={styles.tabContent}>
          {word.commonMistakes.length > 0 ? (
            <ul className={styles.mistakesList}>
              {word.commonMistakes.map((mistake, i) => (
                <li key={i} className={styles.mistake}>
                  {mistake}
                </li>
              ))}
            </ul>
          ) : (
            <p className={styles.noData}>No common mistakes listed for this word.</p>
          )}
        </div>
      ),
    },
  ];

  return (
    <div className={styles.panel}>
      <Tabs tabs={tabs} defaultTab="meaning" />
    </div>
  );
}
