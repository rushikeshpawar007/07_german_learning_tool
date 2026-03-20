import styles from './PageShell.module.css';

interface PageShellProps {
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
  actions?: React.ReactNode;
}

export function PageShell({ children, title, subtitle, actions }: PageShellProps) {
  return (
    <main className={styles.shell}>
      {(title || actions) && (
        <div className={styles.header}>
          <div>
            {title && <h1 className={styles.title}>{title}</h1>}
            {subtitle && <p className={styles.subtitle}>{subtitle}</p>}
          </div>
          {actions && <div className={styles.actions}>{actions}</div>}
        </div>
      )}
      <div className={styles.content}>{children}</div>
    </main>
  );
}
