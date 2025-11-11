import '@/styles/pages/top.scss';

import Image from 'next/image';
import Link from 'next/link';
import DiaryList from '@/app/_components/DiaryList';
import { getBlogList, getResults } from '@/app/_libs/microcms';
import { TOP_DIARY_LIMIT } from '@/app/_constants';
import ResultCard from '@/components/ResultCard';

export default async function Home() {
  // ブログデータと実績データを取得
  const [data, resultsData] = await Promise.all([
    getBlogList({
      limit: TOP_DIARY_LIMIT,
    }),
    getResults({
      limit: 3, // トップページには最大3件表示
    }),
  ]);

  return (
    <>
      <div className="p-top-hero">
        <div className="p-top-hero__image">
          <picture>
            <source srcSet="/img/pages/top/img_hero_sp.webp" type="image/webp" media="(max-width: 767px)" />
            <source srcSet="/img/pages/top/img_hero_sp.jpg" type="image/jpg" media="(max-width: 767px)" />
            <source srcSet="/img/pages/top/img_hero.webp" type="image/webp" />
            <Image src="/img/pages/top/img_hero.webp" alt="ともきゃんスタイル - 名古屋のWebエンジニア・ブロガーのプロフィールサイト" width={2732} height={1000} sizes="100vw" placeholder="blur" blurDataURL="/img/pages/top/img_hero-placeholder.jpg" priority loading="eager" />
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
        <section className="p-top-about inner">
          <h2 className="c-heading-lv2 fadeUpTrigger">
            <span className="c-heading-lv2-en">About</span>
            <span className="c-heading-lv2-ja">ともきゃんについて</span>
          </h2>
          <div className="p-top-about__cont">
            <div className="p-top-about__image fadeUpTrigger">
              <Image src="/img/pages/top/img_tomocan.jpg" alt="Webエンジニア・ブロガー ともきゃんのプロフィール画像" width={200} height={200} />
            </div>
            <div className="p-top-about__text-area fadeUpTrigger">
              <div className="p-top-about__speech-bubble">
                <p>
                  名古屋を拠点に活動しているWebエンジニアの「ともきゃん」と言います。
                  <br />
                  Web制作会社で9年以上の実務経験があり、200サイト以上の制作実績があります。ユーザー視点に立った「使いやすさ」と、ビジネス成果につながる「価値提供」を重視したWebサイト制作に取り組んでいます。
                  <br />
                  「あなたのWebサイトをもっと良くしたい」そんな想いで、お客様のお悩みに合わせた解決策を一緒に考えてカタチにしてきました。
                  <br />
                  あなたの「困った」をぜひ聞かせてください！まずは軽く話しましょう。
                </p>
              </div>
            </div>
          </div>
          <div className="p-top-about__button fadeUpTrigger">
            <Link href="/about/" className="c-button__link">
              ともきゃんについて知る
            </Link>
          </div>
        </section>
        <section className="p-top-skill inner">
          <h2 className="c-heading-lv2 fadeUpTrigger">
            <span className="c-heading-lv2-en">Skill</span>
            <span className="c-heading-lv2-ja">ともきゃんができること</span>
          </h2>
          <div className="p-top-skill__cont c-row">
            <div className="p-top-skill__item col fadeUpTrigger">
              <Image src="/img/pages/top/img_programming.jpg" alt="HTML/CSS/JavaScript/PHPなどのプログラミング言語を使ったWeb制作" width={300} height={200} />
              <h3 className="p-top-skill__item-heading c-heading-lv3">プログラミング</h3>
              <p>HTML、CSS、JavaScript、PHPを用いたWebサイト構築が得意です。特にWordPressのカスタマイズに強みを持ち、独自のテーマを作成します。お客様のご要望に合わせて、管理画面の更新機能やサイトのレイアウトを自在に調整し、ユーザビリティを向上させます。また、SEOに配慮したコーディングも行い、検索エンジンでの集客力アップをサポートします。</p>
            </div>
            <div className="p-top-skill__item col fadeUpTrigger">
              <Image src="/img/pages/top/img_web-tool.jpg" alt="Figma、Photoshop、IllustratorなどのWeb制作ツール" width={300} height={200} />
              <h3 className="p-top-skill__item-heading c-heading-lv3">Web制作ツール</h3>
              <p>Cursor、Figma、Photoshop、Illustratorを使いこなし、効率的かつ美しいデザインを実現します。さらに、CanvaやAdobe Expressといったオンラインツールも活用し、短時間で効果的なビジュアルを作成。プロジェクトの進行スピードを速めつつ、クオリティを保つことができます。各ツールの特性を活かして、ユーザーにとってわかりやすく魅力的なデザインを提供します。</p>
            </div>
            <div className="p-top-skill__item col fadeUpTrigger">
              <Image src="/img/pages/top/img_ai-tool.jpg" alt="ChatGPT、Claude、GeminiなどのAIツールを活用したWeb制作" width={300} height={200} />
              <h3 className="p-top-skill__item-heading c-heading-lv3">AIツール</h3>
              <p>ChatGPT、Claude、Geminiなどの最新AIツールを積極的に活用し、コーディングやデザイン、SEO対策、コンテンツ作成まで幅広く対応しています。AIの力を取り入れることで、作業効率とクオリティの両立を実現し、短期間で高品質なWebサイトや成果物を提供します。常に新しい技術を取り入れ、お客様のご要望に柔軟かつスピーディーに応えます。</p>
            </div>
          </div>
          <div className="p-top-skill__button fadeUpTrigger">
            <Link href="/skill/" className="c-button__link">
              ともきゃんができることを見る
            </Link>
          </div>
        </section>
        <section className="p-top-results inner">
          <h2 className="c-heading-lv2 fadeUpTrigger">
            <span className="c-heading-lv2-en">Result</span>
            <span className="c-heading-lv2-ja">実績紹介</span>
          </h2>
          <div className="p-top-results__cont fadeUpTrigger">
            <p>
              これまでに手がけた制作実績をいくつか紹介します。Webサイト制作はもちろん、ブログのカスタマイズやSEOを意識したサイト構築、デザインのリニューアルなど、幅広いプロジェクトに携わってきました。
              <br />
              「こんなサイトを作りたい」「ブログをもっと使いやすくしたい」「集客を伸ばしたい」など、お客様のご要望や課題に合わせて、柔軟に対応しています。
              <br />
              実際にどんなことができるのか、ぜひ実績をチェックしてみてください！
            </p>
          </div>
          {resultsData.contents.length > 0 && (
            <div className="p-top-results__list fadeUpTrigger">
              <div className="results-grid">
                {resultsData.contents.slice(0, 3).map((result, index) => (
                  <ResultCard
                    key={`${result.id}-${index}`}
                    result={result}
                    priority={index === 0} // 最初の画像のみ優先読み込み
                  />
                ))}
              </div>
            </div>
          )}
          <div className="p-top-results__button fadeUpTrigger">
            <Link href="/result/" className="c-button__link">
              実績をもっと見る
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
              <Image src="/img/pages/top/img_contact.jpg" alt="Webサイト制作やブログ運営のお問い合わせ・ご相談" width={310} height={200} />
            </div>
            <div className="p-top-contact__detail col-text">
              <p>Webサイト制作やブログデザイン、UI/UX改善、SEO対策など、Webに関するご相談・ご依頼を承っています。ご要望やご予算に合わせて、最適なご提案・サポートをいたします。ご興味をお持ちいただけましたら、お気軽にお問い合わせフォームよりご連絡ください！</p>
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
