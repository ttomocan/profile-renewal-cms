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
    return <p className={styles.title}>記事がありません。</p>;
  }
  return (
    <ul className={styles.list_parent}>
      {blog.map((article) => (
        <li key={article.id} className={`${styles.list}`}>
          <Link href={`/diary/${article.id}/`} className={styles.link}>
            {article.thumbnail ? <Image src={article.thumbnail.url} alt="" className={styles.image} width={article.thumbnail.width} height={article.thumbnail.height} /> : <Image className={styles.image} src="/img/common/ogp.png" alt="No Image" width={200} height={105} />}
            <dl className={styles.content}>
              <dt className={styles.title}>{article.title}</dt>
              <dd className={styles.meta}>
                <Category category={article.category} />
                <Date date={article.publishedAt ?? article.createdAt} />
              </dd>
            </dl>
          </Link>
        </li>
      ))}
    </ul>
  );
}
