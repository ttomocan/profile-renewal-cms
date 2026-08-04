import Link from 'next/link';
import Image from 'next/image';
import type { Blog } from '@/app/_libs/microcms';
import Date from '../Date';
import Category from '../Category';
import styles from './index.module.css';
import { addHeadingIds } from '@/lib/tableOfContents';

type Props = {
  data: Blog;
};

export default function Article({ data }: Props) {
  const article = addHeadingIds(data.content);
  const showTableOfContents = article.items.length >= 2;

  return (
    <div className={styles.article}>
      <h1 className={styles.title}>{data.title}</h1>
      <div className={styles.meta}>
        <Link href={`/diary/category/${data.category.id}`} className={styles.categoryLink}>
          <Category category={data.category} />
        </Link>
        <Date date={data.publishedAt ?? data.createdAt} />
      </div>
      <p className={styles.description}>{data.description}</p>
      {data.thumbnail && (
        <div className={styles.thumbnailWrapper}>
          <Image src={data.thumbnail.url} alt={data.thumbnailAlt?.trim() || `${data.title}のアイキャッチ画像`} className={styles.thumbnail} width={data.thumbnail.width} height={data.thumbnail.height} sizes="(max-width: 767px) calc(100vw - 40px), 900px" />
        </div>
      )}
      {showTableOfContents && (
        <nav className={styles.tableOfContents} aria-labelledby="table-of-contents-title">
          <h2 id="table-of-contents-title" className={styles.tableOfContentsTitle}>
            目次
          </h2>
          <ol>
            {article.items.map((item) => (
              <li key={item.id} className={item.level === 3 ? styles.tableOfContentsSubItem : undefined}>
                <a href={`#${item.id}`}>{item.title}</a>
              </li>
            ))}
          </ol>
        </nav>
      )}
      <div
        className={styles.content}
        dangerouslySetInnerHTML={{
          __html: article.content,
        }}
      />
    </div>
  );
}
