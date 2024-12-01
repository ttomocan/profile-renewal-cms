import Image from 'next/image';

export default async function Page() {
  return (
    <>
      <section className="first l-inner">
        <p className="fadeUp">
          私が実務でよく使っているスキルとサイト制作ツールを紹介します。
          <br />
          SEO対策を考慮したコーディングはもちろん、WordPressサイトの構築・カスタマイズや、ユーザビリティを考慮したデザイン調整など、Webサイトに関する幅広いサポートを行っています。
          <br />
          また、ブログ運営で培ったノウハウを活かしたWebライティングやコンテンツマーケティングも得意としています。お客様の「やりたいこと」を形にし、ビジネスの成長を手助けすることが信念です。
        </p>
      </section>
      <section className="programming l-inner l-inner-s">
        <h2 className="c-heading-lv2 fadeUp">
          <span className="c-heading-lv2-en">Programming</span>
          <span className="c-heading-lv2-ja">プログラミング言語</span>
        </h2>
        <div className="programming__item fadeUp">
          <div className="programming__image">
            <Image src="/img/pages/skill/img_html5.svg" alt="HTML5" width={100} height={100} style={{ width: 'auto', height: '100px' }} />
          </div>
          <div className="programming__detail">
            <h3 className="programming__heading">HTML5</h3>
            <p>HTMLを使って、Webサイトの構造を設計し、ユーザビリティとSEOに配慮したコードを書くことが得意です。お客様のニーズに合わせた柔軟な対応が可能です。</p>
          </div>
        </div>
        <div className="programming__item fadeUp">
          <div className="programming__image">
            <Image src="/img/pages/skill/img_css3.svg" alt="CSS3" width={100} height={100} style={{ width: 'auto', height: '100px' }} />
          </div>
          <div className="programming__detail">
            <h3 className="programming__heading">CSS3</h3>
            <p>普段は、スタイリングやレイアウトのコーディングにSCSSを使用しています。アニメーションの実装に強みがあり、視覚的に魅力的で動きのあるデザインを実装します。</p>
          </div>
        </div>
        <div className="programming__item fadeUp">
          <div className="programming__image">
            <Image src="/img/pages/skill/img_javascript.svg" alt="JS" width={100} height={100} style={{ width: 'auto', height: '100px' }} />
          </div>
          <div className="programming__detail">
            <h3 className="programming__heading">JavaScript</h3>
            <p>JavaScriptを駆使し、jQueryやVue、Next.jsなどのフレームワークを活用して、インタラクティブで動的なWebサイトを構築します。</p>
          </div>
        </div>
        <div className="programming__item fadeUp">
          <div className="programming__image">
            <Image src="/img/pages/skill/img_php.svg" alt="PHP" width={100} height={100} style={{ width: 'auto', height: '100px' }} />
          </div>
          <div className="programming__detail">
            <h3 className="programming__heading">PHP</h3>
            <p>PHPを使用し、お問い合わせフォームやWordPressの検索・更新機能など、柔軟にカスタマイズします。お客様のニーズに合わせた機能追加や最適化が可能です。</p>
          </div>
        </div>
      </section>
      <section className="tool l-inner l-inner-s">
        <h2 className="c-heading-lv2 fadeUp">
          <span className="c-heading-lv2-en">Tool</span>
          <span className="c-heading-lv2-ja">サイト制作ツール</span>
        </h2>
        <div className="tool__item fadeUp">
          <div className="tool__image">
            <Image src="/img/pages/skill/img_vscode.svg" alt="Visual Studio Code" width="100" height="100" priority sizes="100vw" />
          </div>
          <div className="tool__detail">
            <h3 className="programming__heading">Visual Studio Code</h3>
            <p>サイト構築時に使用するエディタ。拡張機能を活用し、開発環境を最適化して、コーディングの効率を高めています。</p>
          </div>
        </div>
        <div className="tool__item fadeUp">
          <div className="tool__image">
            <Image src="/img/pages/skill/img_figma.svg" alt="Figma" width={100} height={100} style={{ width: 'auto', height: '100px' }} />
          </div>
          <div className="tool__detail">
            <h3 className="programming__heading">Figma</h3>
            <p>サイト構築時のデザイン作成や、サムネイル、バナー、図形の作成に活用しています。直感的な操作で効率的にビジュアルを制作し、クオリティを高めています。</p>
          </div>
        </div>
        <div className="tool__item fadeUp">
          <div className="tool__image">
            <Image src="/img/pages/skill/img_adobe.svg" alt="Photoshop・Illustrator" width={100} height={100} style={{ width: 'auto', height: '100px' }} />
          </div>
          <div className="tool__detail">
            <h3 className="programming__heading">Photoshop・Illustrator</h3>
            <p>コーディング時の画像書き出しや編集に使用します。デザインの微調整や最適化を行い、Webサイトに最適なビジュアルを作成します。</p>
          </div>
        </div>
        <div className="tool__item fadeUp">
          <div className="tool__image">
            <Image src="/img/pages/skill/img_canva.svg" alt="Canva" width={100} height={100} style={{ width: 'auto', height: '100px' }} />
          </div>
          <div className="tool__detail">
            <h3 className="programming__heading">Canva・Adobe Express</h3>
            <p>ブログ用の画像作成に活用しています。手軽にデザインができ、視覚的に魅力あるコンテンツを作成するためのツールとして活用しています。</p>
          </div>
        </div>
        <div className="tool__item fadeUp">
          <div className="tool__image">
            <Image src="/img/pages/skill/img_chatgpt.svg" alt="ChatGPT" width={100} height={100} style={{ width: 'auto', height: '100px' }} />
          </div>
          <div className="tool__detail">
            <h3 className="programming__heading">ChatGPT・Adobe Firefly</h3>
            <p>ブログや当サイトの文章、画像生成、ビジネスのアイデア出しに活用しています。効率的なコンテンツ作成やクリエイティブな発想を支援するAIツールとして役立てています。</p>
          </div>
        </div>
      </section>
      <section className="other l-inner l-inner-s">
        <h2 className="c-heading-lv2 fadeUp">
          <span className="c-heading-lv2-en">Other</span>
          <span className="c-heading-lv2-ja">その他</span>
        </h2>
        <ul className="other__cont c-list fadeUp">
          <li>CSS設計（BEM・FLOCSS）</li>
          <li>SEO対策（構造化マークアップ・内部設計・表示速度改善）</li>
          <li>バージョン管理（Git・Subversion）</li>
          <li>データベース言語（SQL）</li>
          <li>Webライティング</li>
          <li>CMSサイトの構築（WP・MT）</li>
          <li>ヘッドレスCMS（microCMS）</li>
          <li>バナーやサムネイル画像の作成</li>
        </ul>
      </section>
    </>
  );
}
