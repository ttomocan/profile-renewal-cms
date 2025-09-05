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
          声に自信がない、ブログで稼げない…そんな悩みを解決する2つのブログを運営しています。
          <br className="u-pc-only" />
          「ともきゃんのボイトレ生活」では、人前で話すのが苦手だった私が実践した
          <br className="u-pc-only" />
          今すぐ使える発声テクニックや会話テクニックが満載です。
          <br />
          「ブログデザインマニア」では、月収6桁を達成したブログ運営の裏側を大公開。
          <br className="u-pc-only" />
          デザインのコツから収益化まで、現役Web制作者だからこそ知る秘訣をお伝えします。
          <br />
          どちらも知りたいことが詰まった内容ばかりなので、
          <br className="u-pc-only" />
          気になる記事からぜひチェックしてみてください！
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
