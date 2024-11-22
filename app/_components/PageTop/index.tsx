import styles from './index.module.css';
import Link from 'next/link';

export default function PageTop() {
  return (
    <div className={styles.pagetop}>
      <div className={styles.pagetop_icon}></div>
      <Link href="#" className={styles.pagetop_link}>
        PAGE TOP
      </Link>
    </div>
  );
}
