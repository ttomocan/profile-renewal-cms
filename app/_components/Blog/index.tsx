import Link from 'next/link';
import Image from 'next/image';

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
          「ともきゃんのボイトレ生活」では、ボイストレーニングや話し方の上達に役立つ情報をわかりやすく発信しています。
          <br />
          実際の体験や学びをもとに、あなたのスキルアップを全力でサポート！
          <br />
          「ブログデザインマニア」では、現場で培ったブログ制作ノウハウやデザインのポイントを詳しく解説。
          <br />
          あなたのブログをより魅力的に進化させるヒントをお届けします。
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
