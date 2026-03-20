import { useState, useEffect } from 'react';
import styles from './SearchInput.module.css';

interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  debounceMs?: number;
}

export function SearchInput({
  value,
  onChange,
  placeholder = 'Search...',
  debounceMs = 300,
}: SearchInputProps) {
  const [local, setLocal] = useState(value);

  useEffect(() => {
    setLocal(value);
  }, [value]);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (local !== value) onChange(local);
    }, debounceMs);
    return () => clearTimeout(timer);
  }, [local, debounceMs, onChange, value]);

  return (
    <div className={styles.wrapper}>
      <span className={styles.icon}>&#128269;</span>
      <input
        type="text"
        className={styles.input}
        value={local}
        onChange={(e) => setLocal(e.target.value)}
        placeholder={placeholder}
      />
      {local && (
        <button
          className={styles.clear}
          onClick={() => {
            setLocal('');
            onChange('');
          }}
          aria-label="Clear search"
        >
          &#10005;
        </button>
      )}
    </div>
  );
}
