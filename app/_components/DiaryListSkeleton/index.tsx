import styles from './index.module.css';

export default function DiaryListSkeleton() {
  // 3つのスケルトンアイテムを表示
  return (
    <div className={styles.container}>
      {[...Array(3)].map((_, index) => (
        <div key={index} className={styles.item}>
          <div className={styles.thumbnail}></div>
          <div className={styles.content}>
            <div className={styles.title}></div>
            <div className={styles.meta}>
              <div className={styles.date}></div>
              <div className={styles.category}></div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
