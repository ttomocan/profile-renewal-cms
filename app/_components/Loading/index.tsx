import styles from './index.module.css';

export default function loading() {
  return (
    <div className={styles.loading}>
      <div className={styles.loading_border}>
        <div className={styles.loading_core}></div>
      </div>
    </div>
  );
}
