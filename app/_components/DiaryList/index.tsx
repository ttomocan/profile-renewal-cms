import Image from 'next/image';
import Link from 'next/link';

import styles from './index.module.css';
import Category from '../Category';
import Date from '../Date';
import { Blog } from '@/app/_libs/microcms';

type Props = {
  blog: Blog[];
};

export default function BlogList({ blog }: Props) {
  if (blog.length === 0) {
    return (
      <section className={styles.empty} role="status" aria-live="polite">
        <p className={styles.emptyMessage}>
          記事がありません。
          <br />
          別のカテゴリーや検索条件をお試しください。
        </p>
      </section>
    );
  }

  return (
    <section aria-label="記事一覧">
      <ul className={styles.list_parent} role="list">
        {blog.map((article) => (
          <li key={article.id} className={`${styles.list}`} role="listitem">
            <article className={styles.article}>
              <Link href={`/diary/${article.id}/`} className={styles.link} aria-label={`記事「${article.title}」を読む`}>
                <div className={styles.imageWrapper}>{article.thumbnail ? <Image src={article.thumbnail.url} alt={`${article.title}のサムネイル画像`} className={styles.image} width={article.thumbnail.width} height={article.thumbnail.height} loading="lazy" sizes="(max-width: 640px) 100vw, 200px" /> : <Image className={styles.image} src="/img/common/ogp.png" alt="デフォルトのサムネイル画像" width={200} height={105} loading="lazy" sizes="(max-width: 640px) 100vw, 200px" />}</div>
                <div className={styles.content}>
                  <header>
                    <h3 className={styles.title}>{article.title}</h3>
                  </header>
                  <div className={styles.meta}>
                    <Category category={article.category} />
                    <Date date={article.publishedAt ?? article.createdAt} />
                  </div>
                  {article.description && <p className={styles.description}>{article.description}</p>}
                </div>
              </Link>
            </article>
          </li>
        ))}
      </ul>
    </section>
  );
}
