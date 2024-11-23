import Link from 'next/link';

export default function Blog() {
  return (
    <div className="blog">
      <div className="blog__wrap l-inner">
        <h2 className="c-heading-lv2 flipDownTrigger --color-w">
          <span className="c-heading-lv2-en">Blog</span>
          <span className="c-heading-lv2-ja">ブログ</span>
        </h2>
        <p className="flipDownTrigger">
          「ともきゃんのボイトレ生活」では、ボイトレと話し方のスキルアップに役立つ情報をたっぷりお届け中！
          <br />
          新しい知識や実践からの学びをシェアし、あなたの成長を応援します。
          <br />
          「ブログデザインマニア」では、実務で培ったブログ構築のテクニックとデザインのコツを発信中。
          <br />
          あなたのブログをさらに魅力的にアップデートして、一段上の見せ方を目指しましょう！
        </p>
        <div className="blog__button flipDownTrigger">
          <a href="https://www.newagevoice.com/" target="_blank" className="c-button__link-external c-link-external --w">
            ともきゃんのボイトレ生活
          </a>
          <a href="https://www.blogdesign-mania.com/" target="_blank" className="c-button__link-external c-link-external --w">
            ブログデザインマニア
          </a>
        </div>
      </div>
    </div>
  );
}
