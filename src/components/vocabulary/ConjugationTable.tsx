import type { Conjugation } from '@/types';
import styles from './ConjugationTable.module.css';

interface ConjugationTableProps {
  conjugation: Conjugation;
}

const pronounLabels = [
  { key: 'ich', label: 'ich' },
  { key: 'du', label: 'du' },
  { key: 'er_sie_es', label: 'er/sie/es' },
  { key: 'wir', label: 'wir' },
  { key: 'ihr', label: 'ihr' },
  { key: 'sie_Sie', label: 'sie/Sie' },
] as const;

export function ConjugationTable({ conjugation }: ConjugationTableProps) {
  return (
    <div className={styles.container}>
      {conjugation.present && (
        <div>
          <h4 className={styles.tenseLabel}>Present (Prasens)</h4>
          <table className={styles.table}>
            <tbody>
              {pronounLabels.map(({ key, label }) => (
                <tr key={key}>
                  <td className={styles.pronoun}>{label}</td>
                  <td className={styles.form}>{conjugation.present![key]}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {conjugation.pastParticiple && (
        <div className={styles.extra}>
          <span className={styles.extraLabel}>Past Participle:</span>{' '}
          <span className={styles.extraValue}>{conjugation.pastParticiple}</span>
          {conjugation.auxiliary && (
            <>
              {' '}
              <span className={styles.extraNote}>
                (with {conjugation.auxiliary})
              </span>
            </>
          )}
        </div>
      )}
    </div>
  );
}
