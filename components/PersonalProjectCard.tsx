import Image from 'next/image';
import Link from 'next/link';
import type { Blog } from '@/app/_libs/microcms';

export default function PersonalProjectCard({ article }: { article: Blog }) {
  return (
    <article className="result-card fadeUpTrigger">
      <Link href={`/diary/${article.id}/`} className="result-card__link" aria-label="個人開発「いろポン！」の開発経緯を読む">
        <div className="result-card__image">
          <Image src={article.thumbnail?.url || '/img/common/ogp.png'} alt="" fill sizes="(max-width: 767px) calc(100vw - 40px), (max-width: 1200px) 50vw, 33vw" className="result-card__image-img" />
          <div className="result-card__badge"><span className="result-card__work-type">個人開発</span></div>
        </div>
        <div className="result-card__content">
          <div className="result-card__meta"><span className="result-card__category">学習Webアプリ</span></div>
          <h3 className="result-card__title">色をクイズで覚える「いろポン！」</h3>
          <p className="result-card__summary">{article.description}</p>
          <span className="result-card__detail-text">開発の目的・経緯を読む</span>
        </div>
      </Link>
    </article>
  );
}
