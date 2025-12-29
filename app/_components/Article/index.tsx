import Link from 'next/link';
import Image from 'next/image';
import type { Blog } from '@/app/_libs/microcms';
import Date from '../Date';
import Category from '../Category';
import styles from './index.module.css';

type Props = {
  data: Blog;
};

export default function Article({ data }: Props) {
  return (
    <div className={styles.article}>
      <h1 className={styles.title}>{data.title}</h1>
      <p className={styles.description}>{data.description}</p>
      <div className={styles.meta}>
        <Link href={`/diary/category/${data.category.id}`} className={styles.categoryLink}>
          <Category category={data.category} />
        </Link>
        <Date date={data.publishedAt ?? data.createdAt} />
      </div>
      {data.thumbnail && (
        <div className={styles.thumbnailWrapper}>
          <Image
            src={data.thumbnail.url}
            alt=""
            className={styles.thumbnail}
            width={data.thumbnail.width}
            height={data.thumbnail.height}
          />
        </div>
      )}
      <div
        className={styles.content}
        dangerouslySetInnerHTML={{
          __html: data.content,
        }}
      />
    </div>
  );
}
