import Link from 'next/link';
import styles from './not-found.module.css';

export const metadata = {
  title: 'ページが見つかりません｜ともきゃんスタイル',
  description: '指定されたページは見つかりませんでした。URLをご確認いただくか、トップページまたは制作実績一覧から目的のページをお探しください。',
  robots: {
    index: false,
    follow: true,
  },
};

export default function NotFound() {
  return (
    <main>
      <div className={`${styles.container} inner`}>
        <h1 className={styles.title}>ページが見つかりませんでした</h1>
        <p className={styles.text}>アクセスしようとしたページは存在しないか、移動した可能性があります。URLを再度ご確認ください。</p>
        <p>
          <Link href="/" className="c-button__link --return">
            トップページへ戻る
          </Link>
        </p>
      </div>
    </main>
  );
}
