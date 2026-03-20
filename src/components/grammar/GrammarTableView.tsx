import type { GrammarTable } from '@/types';
import styles from './GrammarTableView.module.css';

interface GrammarTableViewProps {
  table: GrammarTable;
}

export function GrammarTableView({ table }: GrammarTableViewProps) {
  return (
    <div className={styles.container}>
      <h4 className={styles.title}>{table.title}</h4>
      <div className={styles.wrapper}>
        <table className={styles.table}>
          <thead>
            <tr>
              {table.headers.map((header, i) => (
                <th key={i} className={styles.th}>{header}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {table.rows.map((row, i) => (
              <tr key={i}>
                {row.map((cell, j) => (
                  <td key={j} className={j === 0 ? styles.rowHeader : styles.td}>
                    {cell}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
