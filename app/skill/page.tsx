import Image from 'next/image';

export default async function Page() {
  return (
    <>
      <section className="first inner">
        <p className="fadeUpTrigger">
          私が実務でよく使っているスキルとサイト制作ツールを紹介します。
          <br />
          SEO対策を考慮したコーディングはもちろん、WordPressサイトの構築・カスタマイズや、ユーザビリティを考慮したデザイン調整など、Webサイトに関する活動を行っています。
          <br />
          また、ブログ運営で培ったノウハウを活かしたWebライティングやコンテンツマーケティングも得意としています。お客様の「やりたいこと」を形にし、ビジネスの成長を手助けすることが信念です。
        </p>
      </section>
      <section className="programming inner inner-s">
        <h2 className="c-heading-lv2 fadeUpTrigger">
          <span className="c-heading-lv2-en">Programming</span>
          <span className="c-heading-lv2-ja">プログラミング言語</span>
        </h2>
        <div className="programming__item fadeUpTrigger">
          <div className="programming__image">
            <Image src="/img/pages/skill/img_html5.svg" alt="HTML5" width={100} height={100} style={{ width: 'auto', height: '100px' }} />
          </div>
          <div className="programming__detail">
            <h3 className="programming__heading">HTML5</h3>
            <p>セマンティックHTMLを使用してWebサイトの構造を設計し、アクセシビリティとSEOを意識したマークアップを心がけています。また、レスポンシブ対応やパフォーマンス最適化など、モダンな実装にも対応可能です。</p>
          </div>
        </div>
        <div className="programming__item fadeUpTrigger">
          <div className="programming__image">
            <Image src="/img/pages/skill/img_css3.svg" alt="CSS3" width={100} height={100} style={{ width: 'auto', height: '100px' }} />
          </div>
          <div className="programming__detail">
            <h3 className="programming__heading">CSS3</h3>
            <p>SCSSを使用してスタイリングやレイアウトのコーディングを行います。レスポンシブデザインやアニメーションの実装に強みがあり、視覚的に魅力的で使いやすいデザインを実現します。また、BEM設計を取り入れ、保守性の高いCSSコーディングを心がけています。</p>
          </div>
        </div>
        <div className="programming__item fadeUpTrigger">
          <div className="programming__image">
            <Image src="/img/pages/skill/img_javascript.svg" alt="JS" width={100} height={100} style={{ width: 'auto', height: '100px' }} />
          </div>
          <div className="programming__detail">
            <h3 className="programming__heading">JavaScript</h3>
            <p>JavaScriptを活用し、インタラクティブな機能やアニメーションを実装します。また、Next.jsやVueなどのモダンなフレームワークを使用して、パフォーマンスの高いWebサイトを構築できます。</p>
          </div>
        </div>
        <div className="programming__item fadeUpTrigger">
          <div className="programming__image">
            <Image src="/img/pages/skill/img_php.svg" alt="PHP" width={100} height={100} style={{ width: 'auto', height: '100px' }} />
          </div>
          <div className="programming__detail">
            <h3 className="programming__heading">PHP</h3>
            <p>PHPを活用して、WordPressテーマやプラグインのカスタマイズを得意としています。お問い合わせフォームの作成や投稿機能の拡張、データベース連携など、お客様の要望に応じた機能開発が可能です。</p>
          </div>
        </div>
      </section>
      <section className="tool inner inner-s">
        <h2 className="c-heading-lv2 fadeUpTrigger">
          <span className="c-heading-lv2-en">Tool</span>
          <span className="c-heading-lv2-ja">サイト制作ツール</span>
        </h2>
        <div className="tool__item fadeUpTrigger">
          <div className="tool__image">
            <Image src="/img/pages/skill/img_vscode.svg" alt="Visual Studio Code" width="100" height="100" priority sizes="100vw" />
          </div>
          <div className="tool__detail">
            <h3 className="programming__heading">Cursor・Visual Studio Code</h3>
            <p>サイト構築時のメインエディタとして使用しています。AIアシスタントによるコード補完や、豊富な拡張機能を活用することで、開発環境を最適化し、より効率的なコーディングを実現しています。</p>
          </div>
        </div>
        <div className="tool__item fadeUpTrigger">
          <div className="tool__image">
            <Image src="/img/pages/skill/img_figma.svg" alt="Figma" width={100} height={100} style={{ width: 'auto', height: '100px' }} />
          </div>
          <div className="tool__detail">
            <h3 className="programming__heading">Figma</h3>
            <p>サイト構築時のデザイン作成や、サムネイル、バナー、図形の作成に活用しています。直感的な操作で効率的にビジュアルを制作し、クオリティを高めています。</p>
          </div>
        </div>
        <div className="tool__item fadeUpTrigger">
          <div className="tool__image">
            <Image src="/img/pages/skill/img_adobe.svg" alt="Photoshop・Illustrator" width={100} height={100} style={{ width: 'auto', height: '100px' }} />
          </div>
          <div className="tool__detail">
            <h3 className="programming__heading">Photoshop・Illustrator</h3>
            <p>画像の編集や加工、ロゴやアイコンの作成など、グラフィックデザインに関する作業全般を行います。Webサイトに最適な形式での書き出しや、デザインの微調整を行い、高品質なビジュアルを提供します。</p>
          </div>
        </div>
        <div className="tool__item fadeUpTrigger">
          <div className="tool__image">
            <Image src="/img/pages/skill/img_canva.svg" alt="Canva" width={100} height={100} style={{ width: 'auto', height: '100px' }} />
          </div>
          <div className="tool__detail">
            <h3 className="programming__heading">Canva・Adobe Express</h3>
            <p>ブログのサムネイル画像やSNS投稿用の画像作成に活用しています。豊富なテンプレートと直感的な操作で、短時間で魅力的なビジュアルを作成しています。</p>
          </div>
        </div>
        <div className="tool__item fadeUpTrigger">
          <div className="tool__image">
            <Image src="/img/pages/skill/img_chatgpt.svg" alt="ChatGPT" width={100} height={100} style={{ width: 'auto', height: '100px' }} />
          </div>
          <div className="tool__detail">
            <h3 className="programming__heading">ChatGPT・Perplexity・Canva AI</h3>
            <p>ブログや当サイトの文章作成、画像生成、アイデア出しなど、幅広い用途で活用しています。AIの特性を活かして、より質の高いコンテンツ制作や、新しい発想を得るためのツールとして重宝しています。</p>
          </div>
        </div>
      </section>
      <section className="other inner inner-s">
        <h2 className="c-heading-lv2 fadeUpTrigger">
          <span className="c-heading-lv2-en">Other</span>
          <span className="c-heading-lv2-ja">その他</span>
        </h2>
        <div className="other__cont c-list fadeUpTrigger">
          <div className="other__card">CSS設計（BEM・FLOCSS）</div>
          <div className="other__card">SEO対策（構造化マークアップ・表示速度改善）</div>
          <div className="other__card">バージョン管理（Git・Subversion）</div>
          <div className="other__card">データベース言語（SQL）</div>
          <div className="other__card">CMSサイトの構築（WP・MT）</div>
          <div className="other__card">ヘッドレスCMS（microCMS）</div>
          <div className="other__card">バナーやサムネイル画像の作成</div>
        </div>
      </section>
    </>
  );
}
