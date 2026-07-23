export default function Blog() {
  return (
    <div className="l-blog-area">
      <div className="l-blog-area__image">
        <picture>
          <source srcSet="/img/common/bg_blog_sp.webp" type="image/webp" media="(max-width: 767px)" />
          <source srcSet="/img/common/bg_blog_sp.jpg" media="(max-width: 767px)" />
          <source srcSet="/img/common/bg_blog.webp" type="image/webp" />
          <img src="/img/common/bg_blog.jpg" alt="" width={1366} height={400} sizes="100vw" />
        </picture>
      </div>
      <div className="l-blog-area__wrap inner">
        <h2 className="c-heading-lv2 fadeUpTrigger --color-w">
          <span className="c-heading-lv2-en">Blog</span>
          <span className="c-heading-lv2-ja">ブログ</span>
        </h2>
        <p className="fadeUpTrigger">
          個人活動として、ボイストレーニングとブログデザインをテーマにした2つのブログを継続して運営しています。
          <br className="u-pc-only" />
          「ともきゃんのボイトレ生活」では、自分で試した発声・会話の方法を記録し、
          <br className="u-pc-only" />
          読者が実践しやすい形に整理して発信しています。
          <br />
          「ブログデザインマニア」では、Web制作者としての視点から、
          <br className="u-pc-only" />
          UI、記事の読みやすさ、WordPressのカスタマイズ、運営改善について紹介しています。
        </p>
        <div className="l-blog-area__button fadeUpTrigger">
          <a href="https://www.newagevoice.com/" target="_blank" rel="noopener noreferrer" className="c-button__link-external c-link-external --w">
            ともきゃんのボイトレ生活
          </a>
          <a href="https://www.blogdesign-mania.com/" target="_blank" rel="noopener noreferrer" className="c-button__link-external c-link-external --w">
            ブログデザインマニア
          </a>
        </div>
      </div>
    </div>
  );
}
