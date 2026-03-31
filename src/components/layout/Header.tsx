import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { APP_NAME, ROUTES } from '@/utils/constants';
import styles from './Header.module.css';

const navLinks = [
  { path: ROUTES.HOME, label: 'Home' },
  { path: ROUTES.SITUATIONS, label: 'Situations' },
  { path: ROUTES.VOCABULARY, label: 'Vocabulary' },
  { path: ROUTES.BUILDER, label: 'Builder' },
  { path: ROUTES.GRAMMAR, label: 'Grammar' },
  { path: ROUTES.READING, label: 'Reading' },
  { path: ROUTES.DIALOGUES, label: 'Dialogues' },
  { path: '/explore', label: 'Explore' },
];

export function Header() {
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  const closeMenu = () => setMenuOpen(false);

  return (
    <header className={styles.header}>
      <div className={styles.inner}>
        <Link to="/" className={styles.logo} onClick={closeMenu}>
          {APP_NAME}
        </Link>

        <button
          className={styles.hamburger}
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          <span className={`${styles.bar} ${menuOpen ? styles.barOpen : ''}`} />
          <span className={`${styles.bar} ${menuOpen ? styles.barOpen : ''}`} />
          <span className={`${styles.bar} ${menuOpen ? styles.barOpen : ''}`} />
        </button>

        <nav className={`${styles.nav} ${menuOpen ? styles.navOpen : ''}`}>
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={`${styles.navLink} ${
                location.pathname === link.path ? styles.active : ''
              }`}
              onClick={closeMenu}
            >
              {link.label}
            </Link>
          ))}
          <Link
            to={ROUTES.ACTIVITY_LOG}
            className={`${styles.navLink} ${styles.logLink} ${
              location.pathname === ROUTES.ACTIVITY_LOG ? styles.active : ''
            }`}
            onClick={closeMenu}
          >
            Activity Log
          </Link>
        </nav>

        <Link
          to={ROUTES.ACTIVITY_LOG}
          className={`${styles.logBtn} ${location.pathname === ROUTES.ACTIVITY_LOG ? styles.logActive : ''}`}
        >
          Activity Log
        </Link>
      </div>
    </header>
  );
}
