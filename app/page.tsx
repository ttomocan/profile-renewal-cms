import '@/styles/pages/top.scss';

import Image from 'next/image';
import Link from 'next/link';
import DiaryList from '@/app/_components/DiaryList';
import { getBlogList } from '@/app/_libs/microcms';
import { TOP_DIARY_LIMIT } from '@/app/_constants';

export default async function Home() {
  const data = await getBlogList({
    limit: TOP_DIARY_LIMIT,
  });

  return (
    <>
      <div className="p-top-hero">
        <div className="p-top-hero__image">
          <picture>
            <source srcSet="/img/pages/top/img_hero_sp.webp" type="image/webp" media="(max-width: 767px)" />
            <source srcSet="/img/pages/top/img_hero_sp.jpg" type="image/jpg" media="(max-width: 767px)" />
            <source srcSet="/img/pages/top/img_hero.webp" type="image/webp" />
            <Image src="/img/pages/top/img_hero.jpg" alt="メインビジュアルの背景画像" width={2732} height={1000} priority sizes="100vw" placeholder="blur" blurDataURL="/img/pages/top/img_hero-placeholder.jpg" />
          </picture>
        </div>

        <div className="p-top-hero__wrap inner">
          <p className="p-top-hero__en">
            <span className="p-top-hero__en__char char">T</span>
            <span className="p-top-hero__en__char char">O</span>
            <span className="p-top-hero__en__char char">M</span>
            <span className="p-top-hero__en__char char">O</span>
            <span className="p-top-hero__en__char char">C</span>
            <span className="p-top-hero__en__char char">A</span>
            <span className="p-top-hero__en__char char">N</span>
            <span className="p-top-hero__en__char u-pc-only">&nbsp;</span>
            <br className="u-sp-only" />
            <span className="p-top-hero__en__char char">L</span>
            <span className="p-top-hero__en__char char">I</span>
            <span className="p-top-hero__en__char char">F</span>
            <span className="p-top-hero__en__char char">E</span>
            <span className="p-top-hero__en__char char">S</span>
            <span className="p-top-hero__en__char char">T</span>
            <span className="p-top-hero__en__char char">Y</span>
            <span className="p-top-hero__en__char char">L</span>
            <span className="p-top-hero__en__char char">E</span>
          </p>
          <p className="p-top-hero__ja">
            <span className="p-top-hero__ja__char char">と</span>
            <span className="p-top-hero__ja__char char">も</span>
            <span className="p-top-hero__ja__char char">き</span>
            <span className="p-top-hero__ja__char char">ゃ</span>
            <span className="p-top-hero__ja__char char">ん</span>
            <span className="p-top-hero__ja__char char">の</span>
            <br className="u-sp-only" />
            <span className="p-top-hero__ja__char char">プ</span>
            <span className="p-top-hero__ja__char char">ロ</span>
            <span className="p-top-hero__ja__char char">フ</span>
            <span className="p-top-hero__ja__char char">ィ</span>
            <span className="p-top-hero__ja__char char">ー</span>
            <span className="p-top-hero__ja__char char">ル</span>
            <span className="p-top-hero__ja__char char">サ</span>
            <span className="p-top-hero__ja__char char">イ</span>
            <span className="p-top-hero__ja__char char">ト</span>
          </p>
        </div>
      </div>
      <main>
        <section className="p-top-about inner inner-s">
          <h2 className="c-heading-lv2 fadeUpTrigger">
            <span className="c-heading-lv2-en">About</span>
            <span className="c-heading-lv2-ja">ともきゃんについて</span>
          </h2>
          <div className="p-top-about__cont">
            <div className="p-top-about__image fadeUpTrigger">
              <Image src="/img/pages/top/img_tomocan.jpg" alt="ともきゃんの似顔絵" width={200} height={200} />
            </div>
            <div className="p-top-about__detail fadeUpTrigger">
              <p>
                名古屋を拠点に活動するWebエンジニア・ブロガーの「ともきゃん」です。
                <br />
                当プロフィールサイトをご覧いただき、ありがとうございます。
                <br />
                これまで2社のWeb制作会社で10年以上にわたり、コーポレートサイトやブログ、ECサイトなど多様なWebサイトの設計・開発・運用に携わってきました。
                <br />
                また、個人で2つのブログ運営やWebサービスの開発・販売も行っています。
                <br />
                「Webサイトの集客を強化したい」「ブログで成果を出したい」「デザインやUIを改善したい」など、クライアントの課題に対して最適なソリューションを提案・実装いたします。
                <br />
                現場で培った実践的なノウハウと最新の技術を活かし、目的に合わせた高品質なWebサイト・ブログを丁寧に制作します。ご相談・ご依頼はお気軽にご連絡ください。
              </p>
            </div>
            <div className="p-top-about__button fadeUpTrigger">
              <Link href="/about/" className="c-button__link">
                ともきゃんについて知る
              </Link>
            </div>
          </div>
        </section>
        <section className="p-top-skill inner">
          <h2 className="c-heading-lv2 fadeUpTrigger">
            <span className="c-heading-lv2-en">Skill</span>
            <span className="c-heading-lv2-ja">ともきゃんができること</span>
          </h2>
          <div className="p-top-skill__cont c-row">
            <div className="p-top-skill__item col fadeUpTrigger">
              <Image src="/img/pages/top/img_programming.jpg" alt="プログラミングのイメージ写真" width={300} height={200} />
              <h3 className="p-top-skill__item-heading c-heading-lv3">プログラミング</h3>
              <p>HTML、CSS、JavaScript、PHPを用いたWebサイト構築が得意です。特にWordPressのカスタマイズに強みを持ち、独自のテーマを作成します。お客様のご要望に合わせて、管理画面の更新機能やサイトのレイアウトを自在に調整し、ユーザビリティを向上させます。また、SEOに配慮したコーディングも行い、検索エンジンでの集客力アップをサポートします。</p>
            </div>
            <div className="p-top-skill__item col fadeUpTrigger">
              <Image src="/img/pages/top/img_web-tool.jpg" alt="サイト制作ツールのイメージ写真" width={300} height={200} />
              <h3 className="p-top-skill__item-heading c-heading-lv3">サイト制作ツール</h3>
              <p>Cursor、Figma、Photoshop、Illustratorを使いこなし、効率的かつ美しいデザインを実現します。さらに、CanvaやAdobe Expressといったオンラインツールも活用し、短時間で効果的なビジュアルを作成。プロジェクトの進行スピードを速めつつ、クオリティを保つことができます。各ツールの特性を活かして、ユーザーにとってわかりやすく魅力的なデザインを提供します。</p>
            </div>
            <div className="p-top-skill__item col fadeUpTrigger">
              <Image src="/img/pages/top/img_seo.jpg" alt="SEOのイメージ写真" width={300} height={200} />
              <h3 className="p-top-skill__item-heading c-heading-lv3">SEO</h3>
              <p>SEOに配慮したコーディングとコンテンツ制作が得意です。5年間のブログ運営で培った経験を活かし、キーワード選定や内部対策、効果的なWebライティングを行います。検索エンジンに強いサイト構築を目指し、ユーザーの検索意図に応えるコンテンツを作成し、上位表示を実現します。また、アクセス解析を通じて改善策を提案し、サイト全体のパフォーマンス向上をサポートします。</p>
            </div>
          </div>
          <div className="p-top-skill__button fadeUpTrigger">
            <Link href="/skill/" className="c-button__link">
              ともきゃんのできることを見る
            </Link>
          </div>
        </section>
        <section className="p-top-diary inner">
          <h2 className="c-heading-lv2 fadeUpTrigger">
            <span className="c-heading-lv2-en">Diary</span>
            <span className="c-heading-lv2-ja">ともきゃん日記</span>
          </h2>
          <div className="p-top-diary__cont fadeUpTrigger">
            <p>
              「スタバのジンジャーブレッドラテが美味しすぎて年中飲みたい！」そんな日常の<b>“なんで？”</b>や<b>“楽しい”</b>をシェアします。SEOに縛られない、気ままなエピソードやお気に入りの話題を更新していきます。
            </p>
          </div>
          <div className="p-top-diary__list fadeUpTrigger">
            <DiaryList blog={data.contents} />
          </div>
          <div className="p-top-diary__button fadeUpTrigger">
            <Link href="/diary/" className="c-button__link">
              ともきゃん日記を読む
            </Link>
          </div>
        </section>
        <section className="p-top-contact inner">
          <h2 className="c-heading-lv2 fadeUpTrigger">
            <span className="c-heading-lv2-en">Contact</span>
            <span className="c-heading-lv2-ja">お問い合わせ</span>
          </h2>
          <div className="p-top-contact__cont c-row fadeUpTrigger">
            <div className="p-top-contact__img col-img">
              <Image src="/img/pages/top/img_contact.jpg" alt="お問い合わせのイメージ写真" width={310} height={200} />
            </div>
            <div className="p-top-contact__detail col-text">
              <p>Webサイト制作やブログデザイン、UI/UX改善、SEO対策など、Webに関するご相談・ご依頼を承っております。ご要望やご予算に合わせて、最適なご提案・サポートをいたします。ご興味をお持ちいただけましたら、お気軽にお問い合わせフォームよりご連絡ください。</p>
              <div className="p-top-contact__button">
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
