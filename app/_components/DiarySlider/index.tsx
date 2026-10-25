import CardSlider from '../CardSlider';
import Image from 'next/image';
import Link from 'next/link';
import type { Blog } from '@/app/_libs/microcms';
import Category from '../Category';
import Date from '../Date';

interface DiarySliderProps {
  blog: Blog[];
}

export default function DiarySlider({ blog }: DiarySliderProps) {
  if (blog.length === 0) return null;

  return (
    <CardSlider kind="diary" label="活動記録の記事" previous="前の記事を表示" next="次の記事を表示">
        {blog.map((article) => (
          <li key={article.id} className="splide__slide">
          <article className="diary-card">
            <Link
              href={`/diary/${article.id}/`}
              className="diary-card__link"
              aria-label={`記事「${article.title}」を読む`}
            >
              <div className="diary-card__image">
                {article.thumbnail ? (
                  <Image
                    src={article.thumbnail.url}
                    alt=""
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    className="diary-card__image-img"
                    loading="lazy"
                  />
                ) : (
                  <Image
                    src="/img/common/ogp.png"
                    alt=""
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    className="diary-card__image-img"
                    loading="lazy"
                  />
                )}
                <div className="diary-card__overlay"></div>
              </div>

              <div className="diary-card__content">
                <div className="diary-card__meta">
                  <Category category={article.category} />
                  <Date date={article.publishedAt ?? article.createdAt} />
                </div>

                <h3 className="diary-card__title">{article.title}</h3>

                {article.description && (
                  <p className="diary-card__description">
                    {article.description}
                  </p>
                )}
              </div>
            </Link>
          </article>
          </li>
        ))}
    </CardSlider>
  );
}
