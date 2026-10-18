import Image from 'next/image';
import styles from './index.module.css';

export default function WordPressWork() {
  return (
    <section id="wordpress-blog" className={`inner ${styles.section}`} aria-labelledby="wordpress-blog-heading">
      <div className={styles.card}>
        <div className={styles.screens}>
          <figure className={styles.screen}>
            <figcaption className={styles.browserBar}>newagevoice.com</figcaption>
            <div className={styles.viewport}>
              <Image src="/img/works/newagevoice-home-desktop.jpg" alt="ともきゃんのボイトレ生活のトップページ" width={1150} height={738} sizes="(max-width: 767px) 100vw, 50vw" />
            </div>
          </figure>
          <figure className={styles.screen}>
            <figcaption className={styles.browserBar}>blogdesign-mania.com</figcaption>
            <div className={styles.viewport}>
              <Image src="/img/works/blogdesign-mania-home-desktop.jpg" alt="ブログデザインマニアのトップページ" width={1150} height={738} sizes="(max-width: 767px) 100vw, 50vw" />
            </div>
          </figure>
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
            <a href="https://www.newagevoice.com/" target="_blank" rel="noopener noreferrer" className="c-link-external">ともきゃんのボイトレ生活を見る<span className="u-visually-hidden">（新しいタブで開く）</span></a>
            <a href="https://www.blogdesign-mania.com/" target="_blank" rel="noopener noreferrer" className="c-link-external">ブログデザインマニアで改善事例を読む<span className="u-visually-hidden">（新しいタブで開く）</span></a>
          </div>
        </div>
      </div>
    </section>
  );
}
