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
      <div className={styles.empty}>
        <p className={styles.emptyMessage}>
          記事がありません。
          <br />
          別のカテゴリーや検索条件をお試しください。
        </p>
      </div>
    );
  }

  return (
    <ul className={styles.list_parent}>
      {blog.map((article) => (
        <li key={article.id} className={`${styles.list}`}>
          <Link href={`/diary/${article.id}/`} className={styles.link}>
            <div className={styles.imageWrapper}>{article.thumbnail ? <Image src={article.thumbnail.url} alt="" className={styles.image} width={article.thumbnail.width} height={article.thumbnail.height} loading="lazy" sizes="(max-width: 640px) 100vw, 200px" /> : <Image className={styles.image} src="/img/common/ogp.png" alt="No Image" width={200} height={105} loading="lazy" sizes="(max-width: 640px) 100vw, 200px" />}</div>
            <dl className={styles.content}>
              <dt className={styles.title}>{article.title}</dt>
              <dd className={styles.meta}>
                <Category category={article.category} />
                <Date date={article.publishedAt ?? article.createdAt} />
              </dd>
              {article.description && <dd className={styles.description}>{article.description}</dd>}
            </dl>
          </Link>
        </li>
      ))}
    </ul>
  );
}
