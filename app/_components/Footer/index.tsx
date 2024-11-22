import Link from 'next/link';
import styles from './index.module.css';

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.footer_navigation} role="navigation" aria-label="グローバルナビゲーション">
        <ul className={styles.navigation}>
          <li className={styles.navigation_item}>
            <Link href="/">Top</Link>
          </li>
          <li className={styles.navigation_item}>
            <Link href="/about/">About</Link>
          </li>
          <li className={styles.navigation_item}>
            <Link href="/skill/">Skill</Link>
          </li>
          <li className={styles.navigation_item}>
            <Link href="/contact/">Contact</Link>
          </li>
        </ul>
      </div>
      <div className={styles.footer_copyright}>
        <small>&copy; 2024 ともきゃんスタイル inc.</small>
      </div>
    </footer>
  );
}
