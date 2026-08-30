import '@/styles/pages/top.scss';

import Image, { getImageProps } from 'next/image';
import Link from 'next/link';
import DiarySlider from '@/app/_components/DiarySlider';
import { getBlogList, getResults } from '@/app/_libs/microcms';
import { TOP_DIARY_LIMIT } from '@/app/_constants';
import ResultsSlider from '@/app/_components/ResultsSlider';
import Blog from '@/app/_components/Blog';
import { caveatBrush } from '@/app/fonts';

const heroName = 'TOMOCAN'.split('');
const heroRole = 'Web Engineer / Blogger'.split('');

export default async function Home() {
  const [data, resultsData] = await Promise.all([
    getBlogList({ limit: TOP_DIARY_LIMIT }),
    getResults({ limit: 6 }),
  ]);
  const {
    props: { srcSet: desktopHeroSrcSet, ...desktopHeroProps },
  } = getImageProps({ src: '/img/pages/top/img_hero.webp', alt: '', width: 2732, height: 1000, sizes: '100vw', loading: 'eager', fetchPriority: 'high' });
  const {
    props: { srcSet: mobileHeroSrcSet },
  } = getImageProps({ src: '/img/pages/top/img_hero_sp.webp', alt: '', width: 750, height: 1000, sizes: '100vw', loading: 'eager', fetchPriority: 'high' });

  return (
    <>
      <div className={`p-top-hero ${caveatBrush.variable}`}>
        <div className="p-top-hero__image">
          <picture>
            <source srcSet={mobileHeroSrcSet} media="(max-width: 767px)" />
            <source srcSet={desktopHeroSrcSet} media="(min-width: 768px)" />
            <img {...desktopHeroProps} alt="" />
          </picture>
        </div>

        <div className="p-top-hero__wrap inner">
          <div className="p-top-hero__icon">
            <Image src="/img/pages/top/img_tomocan.jpg" alt="ともきゃんの似顔絵" width={200} height={200} sizes="200px" />
          </div>

          <div className="p-top-hero__text-content">
            <p className="p-top-hero__en" aria-hidden="true">
              {heroName.map((char, index) => (
                <span className="p-top-hero__en__char char" key={`${char}-${index}`}>
                  {char}
                </span>
              ))}
            </p>
            <p className="p-top-hero__ja" aria-hidden="true">
              {heroRole.map((char, index) => (
                <span className="p-top-hero__ja__char char" key={`${char}-${index}`}>
                  {char === ' ' ? '\u00a0' : char}
                </span>
              ))}
            </p>

            <h1 className="p-top-hero__title">設計・実装・改善まで担うWebエンジニア</h1>
            <p className="p-top-hero__about-text">
              Web制作会社で10年以上、200サイト以上の制作に携わってきました。WordPressを中心に、フロントエンド実装、CMS構築、UI改善、SEO、運用まで一貫して対応しています。
            </p>
            <div className="p-top-hero__actions" aria-label="主要ページ">
              <Link href="/result/" className="c-button__link">
                制作実績を見る
              </Link>
              <Link href="/about/" className="c-button__link --hero-secondary">
                プロフィール・経歴を見る
              </Link>
            </div>
          </div>
        </div>

        <a href="#main" className="p-top-hero__scroll" aria-label="主な実績へ移動">
          <span className="p-top-hero__scroll-text">Scroll</span>
          <span className="p-top-hero__scroll-line" aria-hidden="true">
            <span className="p-top-hero__scroll-circle"></span>
          </span>
        </a>
      </div>

      <main id="main">
        <section className="p-top-facts inner" aria-labelledby="facts-heading">
          <h2 id="facts-heading" className="u-visually-hidden">
            主な実績と資格
          </h2>
          <dl className="p-top-facts__list">
            <div className="p-top-facts__item fadeUpTrigger">
              <dt>Web制作経験</dt>
              <dd>
                <strong>10</strong>年以上
              </dd>
            </div>
            <div className="p-top-facts__item fadeUpTrigger">
              <dt>制作実績</dt>
              <dd>
                <strong>200</strong>サイト以上
              </dd>
            </div>
            <div className="p-top-facts__item fadeUpTrigger">
              <dt>国家資格</dt>
              <dd>1級ウェブデザイン技能士</dd>
            </div>
          </dl>
        </section>

        <section className="p-top-results inner">
          <h2 className="c-heading-lv2 fadeUpTrigger">
            <span className="c-heading-lv2-en">Result</span>
            <span className="c-heading-lv2-ja">代表的な制作実績</span>
          </h2>
          <div className="p-top-results__cont fadeUpTrigger">
            <p>コーポレートサイト、ブランドサイト、オウンドメディアなどの実績から、担当範囲・使用技術・制作期間を確認できます。</p>
          </div>
          {resultsData.contents.length > 0 && (
            <div className="p-top-results__list fadeUpTrigger">
              <ResultsSlider results={resultsData.contents} />
            </div>
          )}
          <div className="p-top-results__button fadeUpTrigger">
            <Link href="/result/" className="c-button__link">
              Web制作実績をすべて見る
            </Link>
          </div>
        </section>

        <section className="p-top-skill inner">
          <h2 className="c-heading-lv2 fadeUpTrigger">
            <span className="c-heading-lv2-en">Skill</span>
            <span className="c-heading-lv2-ja">対応領域・スキル</span>
          </h2>
          <div className="p-top-skill__cont c-row">
            <article className="p-top-skill__item col fadeUpTrigger">
              <Image src="/img/pages/top/img_programming.jpg" alt="コードを実装している画面" width={300} height={200} />
              <h3 className="p-top-skill__item-heading c-heading-lv3">実装・CMS構築</h3>
              <ul className="c-list">
                <li>HTML、CSS、JavaScript、PHPによるフロントエンド実装</li>
                <li>WordPressのテーマ開発、投稿機能、カスタムフィールド設計</li>
                <li>更新性と運用方法を考慮したCMS構築</li>
              </ul>
            </article>
            <article className="p-top-skill__item col fadeUpTrigger">
              <Image src="/img/pages/top/img_web-tool.jpg" alt="Web制作で使用するデザインツール" width={300} height={200} />
              <h3 className="p-top-skill__item-heading c-heading-lv3">設計・UI改善・品質確認</h3>
              <ul className="c-list">
                <li>デザイン意図を読み取り、レスポンシブ表示まで実装</li>
                <li>Figma、Photoshop、Illustratorを使った制作</li>
                <li>SEO、アクセシビリティ、表示速度を考慮した改善</li>
              </ul>
            </article>
            <article className="p-top-skill__item col fadeUpTrigger">
              <Image src="/img/pages/top/img_ai-tool.jpg" alt="AIツールを活用した開発環境" width={300} height={200} />
              <h3 className="p-top-skill__item-heading c-heading-lv3">個人開発・AI活用</h3>
              <ul className="c-list">
                <li>Next.js、React、TypeScript、microCMSによる個人開発</li>
                <li>要件整理、コードレビュー、テスト観点の洗い出しにAIを活用</li>
                <li>生成結果を検証し、既存処理への影響まで確認</li>
              </ul>
            </article>
          </div>
          <div className="p-top-skill__button fadeUpTrigger">
            <Link href="/skill/" className="c-button__link">
              実務・個人開発のスキルを見る
            </Link>
          </div>
        </section>

        <section className="p-top-about inner">
          <h2 className="c-heading-lv2 fadeUpTrigger">
            <span className="c-heading-lv2-en">About</span>
            <span className="c-heading-lv2-ja">プロフィール</span>
          </h2>
          <div className="p-top-about__cont">
            <div className="p-top-about__image fadeUpTrigger">
              <Image src="/img/pages/top/img_tomocan.jpg" alt="ともきゃんの似顔絵" width={200} height={200} />
            </div>
            <div className="p-top-about__text-area fadeUpTrigger">
              <div className="p-top-about__speech-bubble">
                <p>
                  Web制作会社で、実装だけでなく設計、CMS構築、UI改善、SEO、公開前の品質確認、運用まで経験してきました。
                  <br />
                  チームでは、デザインや要件の意図をくみ取り、更新する人と閲覧する人の双方にとって扱いやすい形へ落とし込む役割を担います。個人でもWebアプリ開発やブログ運営を続けています。
                </p>
              </div>
            </div>
          </div>
          <div className="p-top-about__button fadeUpTrigger">
            <Link href="/about/" className="c-button__link">
              プロフィール・経歴を見る
            </Link>
          </div>
        </section>

        <section className="p-top-diary inner">
          <h2 className="c-heading-lv2 fadeUpTrigger">
            <span className="c-heading-lv2-en">Diary</span>
            <span className="c-heading-lv2-ja">個人開発・ブログ・発信活動</span>
          </h2>
          <div className="p-top-diary__cont fadeUpTrigger">
            <p>Web制作や個人開発、ブログ運営、働き方について、試したこと・考えたこと・学んだことを継続して記録しています。</p>
          </div>
          {data.contents.length > 0 && (
            <div className="p-top-diary__list fadeUpTrigger">
              <DiarySlider blog={data.contents} />
            </div>
          )}
          <div className="p-top-diary__button fadeUpTrigger">
            <Link href="/diary/" className="c-button__link">
              活動記録を読む
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
              <Image
                src="/img/pages/top/img_contact-v2.webp"
                alt="ノートパソコンとオレンジ色の封筒を描いたお問い合わせのイメージ"
                width={620}
                height={400}
                sizes="(max-width: 767px) 100vw, 310px"
              />
            </div>
            <div className="p-top-contact__detail col-text">
              <p>採用、業務委託・協業、制作実績、ブログ・メディア運営に関するご連絡を受け付けています。現在、サイト・アプリの新規制作依頼は受け付けていません。</p>
              <div className="p-top-contact__button">
                <Link href="/contact/" className="c-button__link">
                  お問い合わせ内容を確認する
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Blog variant="home" />
    </>
  );
}
