import Image from 'next/image';
import Link from 'next/link';
import PersonJsonLd from '@/app/_components/PersonJsonLd';
import BreadcrumbListJsonLd from '@/app/_components/BreadcrumbListJsonLd';

export default function Page() {
  const breadcrumbItems = [
    { label: 'トップ', href: '/' },
    { label: 'プロフィール・経歴', active: true },
  ];

  return (
    <>
      <section className="greeting inner inner-s">
        <h2 className="c-heading-lv2 fadeUpTrigger">
          <span className="c-heading-lv2-en">Current Work</span>
          <span className="c-heading-lv2-ja">現在の仕事</span>
        </h2>
        <div className="greeting__cont">
          <div className="greeting__image fadeUpTrigger">
            <Image src="/img/pages/about/img_tomocan.jpg" alt="Webエンジニア ともきゃんのプロフィール写真" width={200} height={200} sizes="200px" />
          </div>
          <div className="greeting__detail fadeUpTrigger">
            <p>
              名古屋在住のWebエンジニア「ともきゃん」です。Web制作会社で、WordPressを中心としたフロントエンド実装、CMS構築、UI改善、SEO、公開後の運用に携わっています。
              <br />
              デザインデータを再現するだけでなく、コンテンツを更新する人の作業や、公開前の品質確認まで考えて実装することを大切にしています。
            </p>
            <p className="greeting__detail__sign">
              <Image src="/img/pages/about/text_sign.svg" alt="" width={135} height={27} aria-hidden="true" />
            </p>
          </div>
        </div>
      </section>

      <section className="experience inner">
        <h2 className="c-heading-lv2 fadeUpTrigger">
          <span className="c-heading-lv2-en">Experience</span>
          <span className="c-heading-lv2-ja">実務経験</span>
        </h2>
        <dl className="about-facts fadeUpTrigger">
          <div className="about-facts__item">
            <dt>Webエンジニア経験</dt>
            <dd>10年以上</dd>
          </div>
          <div className="about-facts__item">
            <dt>Web制作会社</dt>
            <dd>2社で実務経験</dd>
          </div>
          <div className="about-facts__item">
            <dt>サイト構築</dt>
            <dd>200件以上</dd>
          </div>
        </dl>
        <p className="about-section-copy fadeUpTrigger">コーポレートサイト、ブランドサイト、オウンドメディアなどの制作に携わり、実装からCMS構築、レスポンシブ調整、SEO、運用・保守まで担当してきました。</p>
        <div className="about-link fadeUpTrigger">
          <Link href="/result/" className="c-button__link">
            担当範囲が分かる制作実績を見る
          </Link>
        </div>
      </section>

      <section className="strength inner">
        <h2 className="c-heading-lv2 fadeUpTrigger">
          <span className="c-heading-lv2-en">Strength</span>
          <span className="c-heading-lv2-ja">得意な領域</span>
        </h2>
        <ul className="about-cards fadeUpTrigger">
          <li>
            <strong>WordPress・CMS構築</strong>
            <span>テーマ開発、投稿機能、カスタムフィールド、既存テーマの改修に対応します。</span>
          </li>
          <li>
            <strong>フロントエンド実装</strong>
            <span>HTML、CSS、JavaScript、PHPを使い、各画面幅と運用後の変更を考慮して実装します。</span>
          </li>
          <li>
            <strong>UI改善・品質確認</strong>
            <span>情報の優先順位、操作性、アクセシビリティ、ブラウザ間の差異を確認します。</span>
          </li>
          <li>
            <strong>SEO・運用</strong>
            <span>文書構造、メタ情報、表示速度、更新のしやすさを含めて改善します。</span>
          </li>
        </ul>
        <div className="about-link fadeUpTrigger">
          <Link href="/skill/" className="c-button__link">
            経験区分ごとの対応スキルを見る
          </Link>
        </div>
      </section>

      <section className="work-style inner inner-s">
        <h2 className="c-heading-lv2 fadeUpTrigger">
          <span className="c-heading-lv2-en">Work Style</span>
          <span className="c-heading-lv2-ja">仕事で大切にしていること</span>
        </h2>
        <div className="about-section-copy fadeUpTrigger">
          <p>要件やデザインの背景を理解し、実装上の制約や運用時の注意点を早めに共有します。チームでは、デザイナーやディレクターの意図と、実装・CMSの仕様をつなぐ役割を担います。</p>
          <p>公開前には、レスポンシブ表示、キーボード操作、更新内容の反映、既存処理への影響を確認し、公開後も修正しやすい構成を意識しています。</p>
        </div>
      </section>

      <section className="license inner">
        <h2 className="c-heading-lv2 fadeUpTrigger">
          <span className="c-heading-lv2-en">License &amp; Result</span>
          <span className="c-heading-lv2-ja">資格・実績</span>
        </h2>
        <div className="license__cont c-list fadeUpTrigger" aria-label="保有資格">
          <div className="license__card">1級ウェブデザイン技能士</div>
          <div className="license__card">色彩検定1級</div>
          <div className="license__card">Webクリエイター能力認定 エキスパート</div>
          <div className="license__card">マルチメディア検定 エキスパート</div>
          <div className="license__card">Webデザイナー検定 エキスパート</div>
          <div className="license__card">ITパスポート</div>
        </div>
        <ul className="result__cont about-achievements fadeUpTrigger">
          <li className="result__card">ブログの月間平均PV数1万PV以上</li>
          <li className="result__card">ブログの広告収益累計150万円以上</li>
          <li className="result__card">coconalaの販売件数50件以上・平均評価満点</li>
          <li className="result__card">coconalaの売上累計120万円以上</li>
        </ul>
      </section>

      <section className="activity inner inner-s">
        <h2 className="c-heading-lv2 fadeUpTrigger">
          <span className="c-heading-lv2-en">Personal Work</span>
          <span className="c-heading-lv2-ja">個人開発・ブログ活動</span>
        </h2>
        <div className="about-section-copy fadeUpTrigger">
          <p>個人では、Next.js、React、TypeScript、microCMSを使ったWeb開発に取り組んでいます。ブログ運営では、企画、記事作成、デザイン、SEO、改善まで継続して行っています。</p>
          <p>発信や個人開発を通じて、実務とは異なる技術や、利用者としての視点を学び続けています。</p>
        </div>
        <div className="about-related-links fadeUpTrigger">
          <Link href="/diary/">個人開発・ブログの活動記録を読む</Link>
          <a href="https://www.newagevoice.com/" target="_blank" rel="noopener noreferrer">
            「ともきゃんのボイトレ生活」を見る（外部サイト）
          </a>
          <a href="https://www.blogdesign-mania.com/" target="_blank" rel="noopener noreferrer">
            「ブログデザインマニア」を見る（外部サイト）
          </a>
        </div>
      </section>

      <section className="profile inner inner-s">
        <h2 className="c-heading-lv2 fadeUpTrigger">
          <span className="c-heading-lv2-en">Personal</span>
          <span className="c-heading-lv2-ja">人柄・趣味</span>
        </h2>
        <div className="profile__cont fadeUpTrigger">
          <table className="c-table-01">
            <tbody>
              <tr>
                <th scope="row">名前</th>
                <td>
                  ともきゃん
                  <span className="u-text-note">本名＋英語のcan（できる）を組み合わせた造語です。</span>
                </td>
              </tr>
              <tr>
                <th scope="row">活動拠点</th>
                <td>名古屋市（リモートワーク対応可能）</td>
              </tr>
              <tr>
                <th scope="row">家族</th>
                <td>妻と幼い息子の3人家族</td>
              </tr>
              <tr>
                <th scope="row">趣味</th>
                <td>ブログ、読書、ゲーム</td>
              </tr>
              <tr>
                <th scope="row">座右の銘</th>
                <td>遊ぶように生きる（人生というゲームを、ワクワクしながらプレイすること）</td>
              </tr>
              <tr>
                <th scope="row">人生のバイブル</th>
                <td>NARUTO</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <section className="work-style inner inner-s" aria-labelledby="about-contact-heading">
        <h2 id="about-contact-heading" className="c-heading-lv2 fadeUpTrigger">
          <span className="c-heading-lv2-en">Contact</span>
          <span className="c-heading-lv2-ja">採用・協業のご相談</span>
        </h2>
        <div className="about-section-copy fadeUpTrigger">
          <p>プロフィールや経歴をご覧いただき、採用、業務委託、協業について確認したいことがありましたら、お問い合わせ内容を添えてご連絡ください。</p>
        </div>
        <div className="about-link fadeUpTrigger">
          <Link href="/contact/" className="c-button__link">
            採用・協業について問い合わせる
          </Link>
        </div>
      </section>

      <PersonJsonLd />
      <BreadcrumbListJsonLd items={breadcrumbItems} />
    </>
  );
}
