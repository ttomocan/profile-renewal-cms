import styles from './not-found.module.css';

export const metadata = {
  title: '404 - Not Found',
};

export default function NotFound() {
  return (
    <main>
      <div className={`${styles.container} l-inner`}>
        <dl>
          <dt className={styles.title}>ページが見つかりませんでした</dt>
          <dd className={styles.text}>
            あなたがアクセスしようとしたページは存在しません。
            <br />
            URLを再度ご確認ください。
          </dd>
        </dl>
      </div>
    </main>
  );
}
