type BlogVariant = 'home' | 'about' | 'skill' | 'diary' | 'contact';

const copyByVariant: Record<BlogVariant, string> = {
  home: '個人活動として、ボイストレーニングとブログデザインの2つのブログを運営しています。実体験とWeb制作者の視点から、読者が実践しやすい情報を発信しています。',
  about: '個人で2つのブログを企画・制作・運営しています。継続的な発信を通して、記事設計、UI改善、SEO、運用の知見を深めています。',
  skill: 'WordPressのカスタマイズ、記事UI、ブログ運営の改善事例は「ブログデザインマニア」で発信しています。',
  diary: '活動記録とは別に、ボイストレーニングとブログデザインの専門ブログも継続して運営しています。',
  contact: '運営しているブログやメディアに関するお問い合わせは、上記フォームから受け付けています。',
};

type Props = {
  variant?: BlogVariant;
};

export default function Blog({ variant = 'home' }: Props) {
  return (
    <aside className="l-blog-area" aria-labelledby="blog-area-heading">
      <div className="l-blog-area__image" aria-hidden="true">
        <picture>
          <source srcSet="/img/common/bg_blog_sp.webp" type="image/webp" media="(max-width: 767px)" />
          <source srcSet="/img/common/bg_blog_sp.jpg" media="(max-width: 767px)" />
          <source srcSet="/img/common/bg_blog.webp" type="image/webp" />
          <img src="/img/common/bg_blog.jpg" alt="" width={1366} height={400} sizes="100vw" loading="lazy" decoding="async" />
        </picture>
      </div>
      <div className="l-blog-area__wrap inner">
        <h2 id="blog-area-heading" className="c-heading-lv2 fadeUpTrigger --color-w">
          <span className="c-heading-lv2-en">Blog</span>
          <span className="c-heading-lv2-ja">運営ブログ</span>
        </h2>
        <p className="fadeUpTrigger">{copyByVariant[variant]}</p>
        <div className="l-blog-area__button fadeUpTrigger">
          <a href="https://www.newagevoice.com/" target="_blank" rel="noopener noreferrer" className="c-button__link-external c-link-external --w">
            ともきゃんのボイトレ生活（外部サイト）
          </a>
          <a href="https://www.blogdesign-mania.com/" target="_blank" rel="noopener noreferrer" className="c-button__link-external c-link-external --w">
            ブログデザインマニア（外部サイト）
          </a>
        </div>
      </div>
    </aside>
  );
}
