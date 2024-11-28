import Image from 'next/image';
import Link from 'next/link';
import BlogList from '@/app/_components/BlogList';
import { getBlogList } from '@/app/_libs/microcms';
import { TOP_BLOG_LIMIT } from '@/app/_constants';

export default async function Home() {
  const data = await getBlogList({
    limit: TOP_BLOG_LIMIT,
  });

  return (
    <>
      <div className="hero">
        <div className="hero__image">
          <picture>
            <source srcSet="/img/pages/top/img_hero_sp.webp" type="image/webp" media="(max-width: 767px)" />
            <source srcSet="/img/pages/top/img_hero_sp.jpg" media="(max-width: 767px)" />
            <source srcSet="/img/pages/top/img_hero.webp" type="image/webp" />
            <Image src="/img/pages/top/img_hero.jpg" alt="ノートパソコン" width={1366} height={400} priority sizes="100vw" placeholder="blur" blurDataURL="/img/pages/top/img_hero-placeholder.jpg" />
          </picture>
        </div>
        <div className="hero__wrap l-inner">
          <p className="hero__en">
            <span className="char">T</span>
            <span className="char">O</span>
            <span className="char">M</span>
            <span className="char">O</span>
            <span className="char">C</span>
            <span className="char">A</span>
            <span className="char">N</span>
            <span className="char u-pc-only">&nbsp;</span>
            <br className="u-sp-only" />
            <span className="char">L</span>
            <span className="char">I</span>
            <span className="char">F</span>
            <span className="char">E</span>
            <span className="char">S</span>
            <span className="char">T</span>
            <span className="char">Y</span>
            <span className="char">L</span>
            <span className="char">E</span>
          </p>
          <p className="hero__ja">
            <span className="char">と</span>
            <span className="char">も</span>
            <span className="char">き</span>
            <span className="char">ゃ</span>
            <span className="char">ん</span>
            <span className="char">の</span>
            <br className="u-sp-only" />
            <span className="char">プ</span>
            <span className="char">ロ</span>
            <span className="char">フ</span>
            <span className="char">ィ</span>
            <span className="char">ー</span>
            <span className="char">ル</span>
            <span className="char">サ</span>
            <span className="char">イ</span>
            <span className="char">ト</span>
          </p>
        </div>
      </div>
      <main>
        <section className="about l-inner l-inner-s">
          <h2 className="c-heading-lv2 flipDownTrigger">
            <span className="c-heading-lv2-en">About</span>
            <span className="c-heading-lv2-ja">ともきゃんについて</span>
          </h2>
          <div className="about__cont">
            <div className="about__image flipDownTrigger">
              <Image src="/img/pages/top/img_tomocan.jpg" alt="ともきゃんの似顔絵" width={200} height={200} />
            </div>
            <div className="about__detail flipDownTrigger">
              <p>
                名古屋在住のWebエンジニア兼ブロガー、「ともきゃん」です。
                <br />
                プロフィールサイトをご覧いただき、ありがとうございます。
                <br />
                私は2社のWebサイト制作会社で計8年以上勤務し、2つのブログ運営や個人サービスの販売など、多岐にわたる活動を行っています。
              </p>
              <p>お客様の「集客力を上げたい」「WordPressブログを収益化したい」「既存サイトのデザインを見直したい」といったご要望に対して、Webの力で解決策を提供します。</p>
              <p>Webサイト制作の現場で経験した豊富なノウハウを活かし、あなただけのサイトやブログを丁寧に作り上げます。まずはお気軽にご相談ください。</p>
            </div>
            <div className="about__button flipDownTrigger">
              <Link href="/about/" className="c-button__link">
                ともきゃんについて知る
              </Link>
            </div>
          </div>
        </section>
        <section className="skill l-inner">
          <h2 className="c-heading-lv2 flipDownTrigger">
            <span className="c-heading-lv2-en">Skill</span>
            <span className="c-heading-lv2-ja">ともきゃんができること</span>
          </h2>
          <div className="skill__cont c-row">
            <div className="skill__item col flipDownTrigger">
              <Image src="/img/pages/top/img_programming.jpg" alt="プログラミングのイメージ写真" width={300} height={200} />
              <h3 className="skill__item__heading c-heading-lv3">プログラミング</h3>
              <p>HTML、CSS、JavaScript、PHPを用いたWebサイト構築が得意です。特にWordPressのカスタマイズに強みを持ち、独自のテーマを作成します。お客様のご要望に合わせて、管理画面の更新機能やサイトのレイアウトを自在に調整し、ユーザビリティを向上させます。また、SEOに配慮したコーディングも行い、検索エンジンでの集客力アップをサポートします。</p>
            </div>
            <div className="skill__item col flipDownTrigger">
              <Image src="/img/pages/top/img_web-tool.jpg" alt="サイト制作ツールのイメージ写真" width={300} height={200} />
              <h3 className="skill__item__heading c-heading-lv3">サイト制作ツール</h3>
              <p>Visual Studio Code、Figma、Photoshop、Illustratorを使いこなし、効率的かつ美しいデザインを実現します。さらに、CanvaやAdobe Expressといったオンラインツールも活用し、短時間で効果的なビジュアルを作成。プロジェクトの進行スピードを速めつつ、クオリティを保つことができます。各ツールの特性を活かして、ユーザーにとってわかりやすく魅力的なデザインを提供します。</p>
            </div>
            <div className="skill__item col flipDownTrigger">
              <Image src="/img/pages/top/img_seo.jpg" alt="SEOのイメージ写真" width={300} height={200} />
              <h3 className="skill__item__heading c-heading-lv3">SEO</h3>
              <p>SEOに配慮したコーディングとコンテンツ制作が得意です。5年間のブログ運営で培った経験を活かし、キーワード選定や内部対策、効果的なWebライティングを行います。検索エンジンに強いサイト構築を目指し、ユーザーの検索意図に応えるコンテンツを作成し、上位表示を実現します。また、アクセス解析を通じて改善策を提案し、サイト全体のパフォーマンス向上をサポートします。</p>
            </div>
          </div>
          <div className="skill__button flipDownTrigger">
            <Link href="/skill/" className="c-button__link">
              ともきゃんのできることを見る
            </Link>
          </div>
        </section>
        <section className="diary l-inner">
          <h2 className="c-heading-lv2 flipDownTrigger">
            <span className="c-heading-lv2-en">Diary</span>
            <span className="c-heading-lv2-ja">日記</span>
          </h2>
          <div className="diary__cont flipDownTrigger">
            <p>
              「スタバのジンジャーブレッドラテが美味しすぎて年中飲みたい！」そんな日常の<b>“なんで？”</b>や<b>“楽しい”</b>をシェアします。SEOに縛られない、気ままなエピソードやお気に入りの話題を更新していきます。
            </p>
          </div>
          <div className="diary__list flipDownTrigger">
            <BlogList blog={data.contents} />
          </div>
          <div className="diary__button flipDownTrigger">
            <Link href="/blog/" className="c-button__link">
              ともきゃんの日記を読む
            </Link>
          </div>
        </section>
        <section className="contact l-inner">
          <h2 className="c-heading-lv2 flipDownTrigger">
            <span className="c-heading-lv2-en">Contact</span>
            <span className="c-heading-lv2-ja">お問い合わせ</span>
          </h2>
          <div className="contact__cont c-row flipDownTrigger">
            <div className="contact__img col-img">
              <Image src="/img/pages/top/img_contact.jpg" alt="お問い合わせのイメージ写真" width={310} height={200} />
            </div>
            <div className="contact__detail col-text">
              <p>
                ブログのデザイン相談やWebサイト制作のご依頼、その他Webに関するお悩みなど、お気軽にご相談ください。お問い合わせフォームより承っております。また、ココナラでもご依頼を受け付けていますので、ご希望の方法でご連絡ください。
                <br />
                あなたの課題に寄り添い、最適な解決策をご提案いたします。
              </p>
              <div className="contact__button">
                <Link href="/contact/" className="c-button__link">
                  ともきゃんに相談する
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
