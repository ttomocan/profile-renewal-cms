import Image from 'next/image';
import Link from 'next/link';
import type { ReactNode } from 'react';

type SkillCardProps = {
  title: string | [string, string];
  image?: string;
  imageAlt?: string;
  icon?: ReactNode;
  summary: string;
  points: string[];
  link?: {
    href: string;
    label: string;
  };
};

function SkillCard({ title, image, icon, summary, points, link }: SkillCardProps) {
  const splitTitle = typeof title !== 'string';
  return (
    <article className="programming__item fadeUpTrigger">
      <div className="programming__image" aria-hidden={image ? undefined : true}>
        {image ? <Image src={image} alt="" width={100} height={100} /> : icon ?? <span className="programming__text-icon">{(splitTitle ? title[0] : title).slice(0, 2)}</span>}
      </div>
      <h3 className={splitTitle ? 'programming__heading programming__heading--split' : 'programming__heading'}>
        {splitTitle ? <><span>{title[0]}</span><wbr /><span>{title[1]}</span></> : title}
      </h3>
      <div className="programming__detail">
        <p className="programming__description">{summary}</p>
        {points.length > 0 && (
          <ul className="programming__points c-list">
            {points.map((point) => (
              <li key={point}>{point}</li>
            ))}
          </ul>
        )}
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
  return (
    <>
      <section className="first inner">
        <p className="fadeUpTrigger">実務での対応領域と、個人開発・学習で扱っている技術を分けて紹介します。実装に加え、仕様確認や制作進行、公開対応も行っています。WordPressの実装・改修では、画面表示とともに更新する人の作業や保守性を考えます。案件ごとの担当範囲は制作実績に掲載しています。</p>
      </section>

      <section className="programming inner">
        <h2 className="c-heading-lv2 fadeUpTrigger">
          <span className="c-heading-lv2-en">Professional</span>
          <span className="c-heading-lv2-ja">実務での対応領域</span>
        </h2>
        <p className="programming__note fadeUpTrigger">Web制作会社でのサイト制作・運用で対応してきた技術と制作進行を紹介します。</p>
        <div className="skill-cards">
          <SkillCard title="HTML / CSS / SCSS" image="/img/pages/skill/img_html5.svg" imageAlt="HTML" summary="文書構造と更新後の保守性を考えてマークアップ・スタイリングします。" points={['セマンティックHTMLと見出し設計', 'BEM・FLOCSSを用いたCSS設計', '各画面幅に合わせたレスポンシブ実装']} />
          <SkillCard title="JavaScript" image="/img/pages/skill/img_javascript.svg" imageAlt="JavaScript" summary="UIの操作やアニメーションを、既存処理への影響を確認しながら実装します。" points={['メニュー、モーダル、スライダーなどのUI実装', 'フォームや表示切り替えの制御', 'ブラウザ間の表示・操作確認']} />
          <SkillCard title="PHP" image="/img/pages/skill/img_php.svg" imageAlt="PHP" summary="PHPを用いたお問い合わせフォームやログイン機能の実装に対応しています。WordPressのカスタマイズにも活用しています。" points={['テンプレート内の表示処理の実装', '既存コードの改修・保守']} />
          <SkillCard title="CMS" image="/img/pages/skill/wordpress-official.svg" imageAlt="WordPress" summary="WordPressを中心にCMSを使用し、サイトの構築・カスタマイズ・運用保守を担当してきました。Movable TypeとRCMSにも触れた経験があります。" points={['WordPressのオリジナルテーマ開発・既存テーマの改修', '投稿機能、カスタムブロック、カスタムフィールドを使った更新機能の実装', 'お問い合わせフォームの実装、運用時の改修']} />
          <SkillCard title="Git" image="/img/pages/skill/img_git.svg" imageAlt="Git" summary="変更履歴を残し、Git Flowに沿って開発・リリース・緊急修正のブランチを使い分けます。" points={['ブランチを使った機能開発・修正', '差分確認とレビューを前提にしたコミット', 'GitHubを使ったコード管理']} />
          <SkillCard
            title={['Webディレクション・', '進行管理']}
            icon={
              <svg viewBox="0 0 64 64" width={80} height={80} fill="#f36b0a" aria-hidden="true" focusable="false">
                <rect x={3} y={6} width={38} height={14} rx={2} />
                <rect x={15} y={25} width={44} height={14} rx={2} />
                <rect x={27} y={44} width={34} height={14} rx={2} />
              </svg>
            }
            summary="実装経験を活かし、お客様との仕様確認や制作チームとの調整を行い、制作から公開まで進めます。"
            points={['お客様との調整、要件・仕様の確認', '制作チームへの作業指示、進捗確認・スケジュール調整', 'テスト環境への反映、品質確認・公開対応']}
          />
        </div>
      </section>

      <section className="framework inner">
        <h2 className="c-heading-lv2 fadeUpTrigger">
          <span className="c-heading-lv2-en">Personal Development</span>
          <span className="c-heading-lv2-ja">個人開発で使用</span>
        </h2>
        <p className="programming__note fadeUpTrigger">個人開発の「いろポン！」や、このポートフォリオの制作・改修で使っている技術です。</p>
        <div className="skill-cards">
          <SkillCard title="Next.js / React" image="/img/pages/skill/react-official.svg" summary="コンポーネント単位でUIを組み立て、App Routerを使ったWebサイト・アプリ開発に取り組んでいます。" points={['記事・制作実績の一覧と詳細ページの実装', 'クイズの出題・回答・結果画面の実装', 'いろポン！の画面スタイルにTailwind CSSを使用']} />
          <SkillCard title="TypeScript" image="/img/pages/skill/img_typescript.svg" imageAlt="TypeScript" summary="PropsやCMSデータに型を定義し、変更時の見落としを減らすために使用しています。" points={['コンポーネントのProps定義', 'API・CMSレスポンスの型定義', '型チェックによる実装ミスの早期発見']} />
          <SkillCard title="microCMS" image="/img/pages/skill/img_microcms.svg" imageAlt="microCMS" summary="個人サイトで記事や制作実績を管理するヘッドレスCMSとして使用しています。" points={['一覧・詳細データの取得', '公開データの取得間隔の設定', 'CMSデータを使ったメタ情報生成']} />
        </div>
      </section>

      <section className="ai-tool inner">
        <h2 className="c-heading-lv2 fadeUpTrigger">
          <span className="c-heading-lv2-en">AI-Assisted Development</span>
          <span className="c-heading-lv2-ja">AIを活用した開発フロー</span>
        </h2>
        <div className="skill-cards">
          <SkillCard
            title="AIを使った開発補助"
            image="/img/pages/skill/img_chatgpt.svg"
            summary="仕様整理から実装、差分レビューまで、工程に応じてAIツールを使い分けています。"
            points={[
              'ChatGPTで要件と仕様を整理',
              'Cursorで初回実装',
              'Codexで変更差分をレビュー',
              '仕様との一致、表示・動作、既存機能への影響は最後に自分で確認',
            ]}
          />
          <SkillCard
            title="仕様・資料の作成と整理"
            icon={
              <svg viewBox="0 0 64 64" width={80} height={80} fill="none" stroke="#f36b0a" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">
                <path d="M16 8h21l11 11v37H16zM37 8v11h11M24 31h16M24 40h16M24 48h10" />
              </svg>
            }
            summary="業務ではGemini Notebook（旧NotebookLM）を使い、仕様や資料の作成・整理を行っています。"
            points={[]}
          />
        </div>
      </section>

      <section className="programming inner">
        <h2 className="c-heading-lv2 fadeUpTrigger"><span className="c-heading-lv2-en">Tools</span><span className="c-heading-lv2-ja">制作・開発のツール</span></h2>
        <p className="programming__note fadeUpTrigger">使用技術とは分けて、デザイン確認・画像編集・コード編集のツールを紹介します。</p>
        <div className="skill-cards">
          <SkillCard title="Figma / Adobe" image="/img/pages/skill/img_figma.svg" imageAlt="Figma" summary="デザインの意図やコンポーネント構造を読み取り、実装へ落とし込みます。" points={['Figmaのデザインデータ確認・制作', 'Adobe XD・Illustrator・Photoshopのデザインデータにも対応可能', 'Photoshopでの画像編集・書き出し', 'Illustratorでの素材調整']} />
          <SkillCard title="その他の補助ツール" image="/img/pages/skill/img_cursor.svg" imageAlt="開発ツール" summary="コードの編集、資料整理、ブログ用の素材作成に使うツールです。" points={['コード編集・調査の補助', '資料整理とドキュメント作成', 'ブログ用画像や素材の作成']} />
        </div>
      </section>

      <section className="other inner">
        <h2 className="c-heading-lv2 fadeUpTrigger">
          <span className="c-heading-lv2-en">Quality</span>
          <span className="c-heading-lv2-ja">実装時に重視する観点</span>
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
    </>
  );
}
