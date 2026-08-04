import Image from 'next/image';
import Link from 'next/link';
import BreadcrumbListJsonLd from '@/app/_components/BreadcrumbListJsonLd';

type SkillCardProps = {
  title: string;
  image?: string;
  imageAlt?: string;
  summary: string;
  points: string[];
  link?: {
    href: string;
    label: string;
  };
};

function SkillCard({ title, image, summary, points, link }: SkillCardProps) {
  return (
    <article className="programming__item fadeUpTrigger">
      <div className="programming__image" aria-hidden={image ? undefined : true}>
        {image ? <Image src={image} alt="" width={100} height={100} /> : <span className="programming__text-icon">{title.slice(0, 2)}</span>}
      </div>
      <div className="programming__detail">
        <h3 className="programming__heading">{title}</h3>
        <p className="programming__description">{summary}</p>
        <ul className="programming__points c-list">
          {points.map((point) => (
            <li key={point}>{point}</li>
          ))}
        </ul>
        {link && (
          <Link href={link.href} className="programming__related-link">
            {link.label}
          </Link>
        )}
      </div>
    </article>
  );
}

export default function Page() {
  const breadcrumbItems = [
    { label: 'トップ', href: '/' },
    { label: '対応スキル・技術', active: true },
  ];

  return (
    <>
      <section className="first inner inner-s">
        <p className="fadeUpTrigger">実務で継続して使ってきた技術と、個人開発・学習で扱っている技術を分けて紹介します。実装だけでなく、CMSの更新性、レスポンシブ表示、アクセシビリティ、SEO、公開前の品質確認までを担当範囲として考えています。</p>
      </section>

      <section className="programming inner">
        <h2 className="c-heading-lv2 fadeUpTrigger">
          <span className="c-heading-lv2-en">Professional</span>
          <span className="c-heading-lv2-ja">実務で使用</span>
        </h2>
        <p className="programming__note fadeUpTrigger">Web制作会社でのサイト制作・運用で使用してきた技術です。</p>
        <div className="skill-cards">
          <SkillCard title="HTML / CSS / SCSS" image="/img/pages/skill/img_html5.svg" imageAlt="HTML" summary="文書構造と更新後の保守性を考えてマークアップ・スタイリングします。" points={['セマンティックHTMLと見出し設計', 'BEM・FLOCSSを用いたCSS設計', '各画面幅に合わせたレスポンシブ実装']} />
          <SkillCard title="JavaScript" image="/img/pages/skill/img_javascript.svg" imageAlt="JavaScript" summary="UIの操作やアニメーションを、既存処理への影響を確認しながら実装します。" points={['メニュー、モーダル、スライダーなどのUI実装', 'フォームや表示切り替えの制御', 'ブラウザ間の表示・操作確認']} link={{ href: '/result/', label: 'JavaScriptを使用した制作実績を見る' }} />
          <SkillCard title="PHP / WordPress" image="/img/pages/skill/img_php.svg" imageAlt="PHP" summary="更新する人が迷わない管理画面と、運用しやすいテンプレートを構築します。" points={['オリジナルテーマ・既存テーマの改修', '投稿タイプ、投稿機能、カスタムフィールド設計', 'お問い合わせフォーム、表示速度、運用時の改修']} link={{ href: '/result/', label: 'WordPressを含む制作実績を見る' }} />
          <SkillCard title="Git" image="/img/pages/skill/img_git.svg" imageAlt="Git" summary="変更履歴を残し、チームで確認しやすい単位を意識してバージョン管理します。" points={['ブランチを使った機能開発・修正', '差分確認とレビューを前提にしたコミット', 'GitHubを使ったコード管理']} />
          <SkillCard title="Figma / Adobe" image="/img/pages/skill/img_figma.svg" imageAlt="Figma" summary="デザインの意図やコンポーネント構造を読み取り、実装へ落とし込みます。" points={['Figmaのデザインデータ確認・制作', 'Photoshopでの画像編集・書き出し', 'Illustratorでの素材調整']} />
        </div>
      </section>

      <section className="framework inner">
        <h2 className="c-heading-lv2 fadeUpTrigger">
          <span className="c-heading-lv2-en">Personal Development</span>
          <span className="c-heading-lv2-ja">個人開発で使用</span>
        </h2>
        <p className="programming__note fadeUpTrigger">個人開発やこのポートフォリオの改善を通じて使用し、継続してキャッチアップしています。</p>
        <div className="skill-cards">
          <SkillCard title="Next.js / React" summary="コンポーネント単位でUIを組み立て、App Routerを使ったWebサイト・アプリ開発に取り組んでいます。" points={['Server Componentsを含む画面構成', '状態や責務を分けたコンポーネント設計', 'メタデータ、画像、表示速度の最適化']} />
          <SkillCard title="TypeScript" summary="PropsやCMSデータに型を定義し、変更時の見落としを減らすために使用しています。" points={['コンポーネントのProps定義', 'API・CMSレスポンスの型定義', '型チェックによる実装ミスの早期発見']} />
          <SkillCard title="microCMS" summary="個人サイトで記事や制作実績を管理するヘッドレスCMSとして使用しています。" points={['一覧・詳細データの取得', '下書き表示とキャッシュ設計', 'CMSデータを使ったメタ情報生成']} link={{ href: '/diary/', label: '個人開発・サイト改善の活動記録を読む' }} />
        </div>
      </section>

      <section className="ai-tool inner">
        <h2 className="c-heading-lv2 fadeUpTrigger">
          <span className="c-heading-lv2-en">Learning &amp; Support</span>
          <span className="c-heading-lv2-ja">学習・補助的に使用</span>
        </h2>
        <div className="skill-cards">
          <SkillCard title="Tailwind CSS" image="/img/pages/skill/img_css3.svg" imageAlt="CSS" summary="ユーティリティクラスによるスタイリングを学習し、基本的なレイアウトやレスポンシブ指定を試しています。" points={['個人学習で使用', '基本的なレイアウト・余白指定', '既存案件での実務経験とは区別']} />
          <SkillCard title="ChatGPT / Claude / Gemini" image="/img/pages/skill/img_chatgpt.svg" imageAlt="AIツール" summary="要件整理、コードレビュー、テスト観点の洗い出し、ドキュメント作成の補助に活用しています。" points={['生成コードをそのまま採用せず差分と影響を確認', 'アクセシビリティとレスポンシブ表示を確認', 'ブラウザ間の差異と既存処理への影響を確認']} />
          <SkillCard title="その他の補助ツール" image="/img/pages/skill/img_vscode.svg" imageAlt="開発ツール" summary="Cursor、Visual Studio Code、NotebookLM、Canva、Adobe Express、Fireflyを目的に応じて使い分けています。" points={['コード編集・調査の補助', '資料整理とドキュメント作成', 'ブログ用画像や素材の作成']} />
        </div>
      </section>

      <section className="other inner">
        <h2 className="c-heading-lv2 fadeUpTrigger">
          <span className="c-heading-lv2-en">Quality</span>
          <span className="c-heading-lv2-ja">実装時に確認すること</span>
        </h2>
        <ul className="other__cont fadeUpTrigger">
          <li className="other__card">情報設計・見出し構造</li>
          <li className="other__card">レスポンシブ表示</li>
          <li className="other__card">Webアクセシビリティ</li>
          <li className="other__card">SEO・メタ情報</li>
          <li className="other__card">表示速度</li>
          <li className="other__card">CMSの更新性</li>
          <li className="other__card">ブラウザ間の差異</li>
          <li className="other__card">公開後の保守性</li>
        </ul>
        <div className="skill-page-links fadeUpTrigger">
          <Link href="/result/" className="c-button__link">
            担当領域が分かる制作実績を見る
          </Link>
          <Link href="/about/" className="c-button__link">
            プロフィール・経歴を見る
          </Link>
        </div>
      </section>

      <section className="other inner" aria-labelledby="skill-contact-heading">
        <h2 id="skill-contact-heading" className="c-heading-lv2 fadeUpTrigger">
          <span className="c-heading-lv2-en">Contact</span>
          <span className="c-heading-lv2-ja">技術領域について相談する</span>
        </h2>
        <p className="programming__note fadeUpTrigger">WordPress、CMS構築、フロントエンド実装、UI改善、SEOに関する採用・業務委託・協業のご相談を受け付けています。</p>
        <div className="skill-page-links fadeUpTrigger">
          <Link href="/contact/" className="c-button__link">
            対応スキルについて問い合わせる
          </Link>
        </div>
      </section>

      <BreadcrumbListJsonLd items={breadcrumbItems} />
    </>
  );
}
