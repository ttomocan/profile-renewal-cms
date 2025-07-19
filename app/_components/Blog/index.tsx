import Link from 'next/link';

export default function Blog() {
  return (
    <div className="l-blog-area">
      <div className="l-blog-area__image">
        <picture>
          <source srcSet="/img/common/bg_blog_sp.webp" type="image/webp" media="(max-width: 767px)" />
          <source srcSet="/img/common/bg_blog_sp.jpg" media="(max-width: 767px)" />
          <source srcSet="/img/common/bg_blog.webp" type="image/webp" />
          <img src="/img/common/bg_blog.jpg" alt="ブログエリアの背景画像" width={1366} height={400} sizes="100vw" />
        </picture>
      </div>
      <div className="l-blog-area__wrap inner">
        <h2 className="c-heading-lv2 fadeUpTrigger --color-w">
          <span className="c-heading-lv2-en">Blog</span>
          <span className="c-heading-lv2-ja">ブログ</span>
        </h2>
        <p className="fadeUpTrigger">
          私が運営する2つのブログを紹介します。
          <br className="u-pc-only" />
          「ともきゃんのボイトレ生活」では、ボイストレーニングや話し方に関する実践的なノウハウを発信し、初心者から経験者まで幅広くサポートしています。
          <br />
          「ブログデザインマニア」では、Web制作現場で培った知識をもとに、ブログ運営やデザインのコツ、収益化のポイントなどを詳しく解説しています。
          <br />
          どちらも実体験に基づいた情報をわかりやすくまとめており、読者の課題解決やスキルアップに貢献できる内容を心がけています。
        </p>
        <div className="l-blog-area__button fadeUpTrigger">
          <Link href="https://www.newagevoice.com/" target="_blank" rel="noopener noreferrer" className="c-button__link-external c-link-external --w">
            ともきゃんのボイトレ生活
          </Link>
          <Link href="https://www.blogdesign-mania.com/" target="_blank" rel="noopener noreferrer" className="c-button__link-external c-link-external --w">
            ブログデザインマニア
          </Link>
        </div>
      </div>
    </div>
  );
}
