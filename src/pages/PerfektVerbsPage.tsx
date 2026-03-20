import { useState, useMemo, Fragment } from 'react';
import { Link } from 'react-router-dom';
import { PageShell } from '@/components/layout/PageShell';
import { SearchInput } from '@/components/shared/SearchInput';
import { Badge } from '@/components/shared/Badge';
import { Button } from '@/components/shared/Button';
import { matchesSearch } from '@/utils/search';
import perfektVerbs from '@/data/grammar/perfekt-verbs.json';
import styles from './PerfektVerbsPage.module.css';

interface PerfektVerb {
  infinitive: string;
  meaning: string;
  auxiliary: 'haben' | 'sein';
  pastParticiple: string;
  example: { de: string; en: string };
  type: 'regular' | 'irregular' | 'separable' | 'inseparable' | 'mixed';
}

const verbs = perfektVerbs as PerfektVerb[];

const typeLabels: Record<string, string> = {
  regular: 'Regular',
  irregular: 'Irregular',
  separable: 'Separable',
  inseparable: 'Inseparable',
  mixed: 'Mixed',
};

export function PerfektVerbsPage() {
  const [search, setSearch] = useState('');
  const [auxFilter, setAuxFilter] = useState<'haben' | 'sein' | ''>('');
  const [typeFilter, setTypeFilter] = useState<string>('');
  const [expandedRow, setExpandedRow] = useState<number | null>(null);

  const filtered = useMemo(() => {
    return verbs.filter((v) => {
      if (auxFilter && v.auxiliary !== auxFilter) return false;
      if (typeFilter && v.type !== typeFilter) return false;
      if (search && !matchesSearch(v.infinitive, search) && !matchesSearch(v.meaning, search) && !matchesSearch(v.pastParticiple, search)) {
        return false;
      }
      return true;
    });
  }, [search, auxFilter, typeFilter]);

  return (
    <PageShell
      title="100 Most Useful Perfekt Verbs"
      subtitle="The essential verbs you need to speak in the past tense"
      actions={<Link to="/grammar/perfekt"><Button variant="ghost">Back to Perfekt Lesson</Button></Link>}
    >
      <div className={styles.filters}>
        <SearchInput
          value={search}
          onChange={setSearch}
          placeholder="Search verbs..."
        />
        <div className={styles.filterGroup}>
          <button
            className={`${styles.filterBtn} ${auxFilter === '' ? styles.active : ''}`}
            onClick={() => setAuxFilter('')}
          >
            All ({verbs.length})
          </button>
          <button
            className={`${styles.filterBtn} ${auxFilter === 'haben' ? styles.active : ''}`}
            onClick={() => setAuxFilter('haben')}
          >
            haben ({verbs.filter((v) => v.auxiliary === 'haben').length})
          </button>
          <button
            className={`${styles.filterBtn} ${styles.seinBtn} ${auxFilter === 'sein' ? styles.active : ''}`}
            onClick={() => setAuxFilter('sein')}
          >
            sein ({verbs.filter((v) => v.auxiliary === 'sein').length})
          </button>
        </div>
        <select
          className={styles.select}
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
        >
          <option value="">All types</option>
          <option value="regular">Regular</option>
          <option value="irregular">Irregular</option>
          <option value="separable">Separable</option>
          <option value="inseparable">Inseparable</option>
          <option value="mixed">Mixed</option>
        </select>
      </div>

      <div className={styles.count}>
        Showing {filtered.length} of {verbs.length} verbs
      </div>

      <div className={styles.tableWrapper}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th className={styles.th}>#</th>
              <th className={styles.th}>Infinitive</th>
              <th className={styles.th}>Meaning</th>
              <th className={styles.th}>Auxiliary</th>
              <th className={styles.th}>Partizip II</th>
              <th className={styles.th}>Type</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((verb, i) => (
              <Fragment key={verb.infinitive}>
                <tr
                  className={`${styles.row} ${expandedRow === i ? styles.expanded : ''}`}
                  onClick={() => setExpandedRow(expandedRow === i ? null : i)}
                >
                  <td className={styles.td}>{i + 1}</td>
                  <td className={`${styles.td} ${styles.infinitive}`}>{verb.infinitive}</td>
                  <td className={styles.td}>{verb.meaning}</td>
                  <td className={styles.td}>
                    <span className={`${styles.auxBadge} ${verb.auxiliary === 'sein' ? styles.sein : styles.haben}`}>
                      {verb.auxiliary}
                    </span>
                  </td>
                  <td className={`${styles.td} ${styles.participle}`}>{verb.pastParticiple}</td>
                  <td className={styles.td}>
                    <Badge>{typeLabels[verb.type] ?? verb.type}</Badge>
                  </td>
                </tr>
                {expandedRow === i && (
                  <tr key={`${verb.infinitive}-example`} className={styles.exampleRow}>
                    <td colSpan={6} className={styles.exampleCell}>
                      <p className={styles.exampleDe}>{verb.example.de}</p>
                      <p className={styles.exampleEn}>{verb.example.en}</p>
                    </td>
                  </tr>
                )}
              </Fragment>
            ))}
          </tbody>
        </table>
      </div>
    </PageShell>
  );
}
