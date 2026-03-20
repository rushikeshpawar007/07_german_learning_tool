import styles from './Tag.module.css';

interface TagProps {
  children: React.ReactNode;
  color?: string;
  onClick?: () => void;
}

export function Tag({ children, color, onClick }: TagProps) {
  const style = color ? { borderColor: color, color } : undefined;

  if (onClick) {
    return (
      <button className={styles.tag} style={style} onClick={onClick}>
        {children}
      </button>
    );
  }

  return (
    <span className={styles.tag} style={style}>
      {children}
    </span>
  );
}
