import Image from 'next/image';
import styles from './index.module.css';

export default function WordPressWork() {
  return (
    <section id="wordpress-blog" className={`inner ${styles.section}`} aria-labelledby="wordpress-blog-heading">
      <div className={styles.card}>
        <div className={styles.image}>
          <Image src="/img/common/bg_blog.webp" alt="" width={1366} height={426} sizes="(max-width: 767px) 100vw, 280px" />
        </div>
        <div className={styles.body}>
          <p className={styles.eyebrow}>WordPress / 自主運営</p>
          <h2 id="wordpress-blog-heading">自主運営のWordPress実績</h2>
          <p>「ともきゃんのボイトレ生活」「ブログデザインマニア」の2つのブログを企画・制作・運営しています。</p>
          <dl className={styles.details}>
            <div>
              <dt>担当範囲</dt>
              <dd>企画、記事作成、デザイン、SEO、公開後の運用・改善</dd>
            </div>
            <div>
              <dt>実装・運用</dt>
              <dd>記事設計やUIを継続的に改善。WordPressのカスタマイズや記事UI、ブログ運営の改善事例も発信しています。</dd>
            </div>
            <div>
              <dt>運営実績</dt>
              <dd>ともきゃんのボイトレ生活：月平均1万PV（2025年までの運営実績）</dd>
            </div>
          </dl>
          <div className={styles.links}>
            <a href="https://www.newagevoice.com/" target="_blank" rel="noopener noreferrer">ともきゃんのボイトレ生活を見る（外部）</a>
            <a href="https://www.blogdesign-mania.com/" target="_blank" rel="noopener noreferrer">ブログデザインマニアで改善事例を読む（外部）</a>
          </div>
        </div>
      </div>
    </section>
  );
}
