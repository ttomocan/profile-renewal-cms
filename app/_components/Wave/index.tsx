import styles from './index.module.css';

export default function wave() {
  return (
    <div className={styles.wave}>
      <canvas id="waveCanvas"></canvas>
    </div>
  );
}
