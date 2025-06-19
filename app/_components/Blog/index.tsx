import Link from 'next/link';
import Image from 'next/image';

export default function Blog() {
  return (
    <div className="blog-area">
      <div className="blog-area__image">
        <picture>
          <source srcSet="/img/common/bg_blog_sp.webp" type="image/webp" media="(max-width: 767px)" />
          <source srcSet="/img/common/bg_blog_sp.jpg" media="(max-width: 767px)" />
          <source srcSet="/img/common/bg_blog.webp" type="image/webp" />
          <Image src="/img/common/bg_blog.jpg" alt="" width={1366} height={400} sizes="100vw" />
        </picture>
      </div>
      <div className="blog-area__wrap inner">
        <h2 className="c-heading-lv2 fadeUpTrigger --color-w">
          <span className="c-heading-lv2-en">Blog</span>
          <span className="c-heading-lv2-ja">ブログ</span>
        </h2>
        <p className="fadeUpTrigger">
          「ともきゃんのボイトレ生活」では、
          <wbr />
          ボイトレと話し方のスキルアップに役立つ情報をたっぷりお届け中！
          <br />
          新しい知識や実践からの学びをシェアし、
          <wbr />
          あなたの成長を応援します。
          <br />
          「ブログデザインマニア」では、
          <wbr />
          実務で培ったブログ構築のテクニックとデザインのコツを発信中。
          <br />
          あなたのブログを魅力的にアップデートして、
          <wbr />
          一段上の見せ方を目指しましょう！
        </p>
        <div className="blog-area__button fadeUpTrigger">
          <Link href="https://www.newagevoice.com/" target="_blank" className="c-button__link-external c-link-external --w">
            ともきゃんのボイトレ生活
          </Link>
          <Link href="https://www.blogdesign-mania.com/" target="_blank" className="c-button__link-external c-link-external --w">
            ブログデザインマニア
          </Link>
        </div>
      </div>
    </div>
  );
}
