import Image from 'next/image';

export default async function Page() {
  return (
    <>
      <section className="first inner">
        <p className="fadeUpTrigger">
          私が実務でよく使っているスキルとサイト制作ツールを紹介します。
          <br />
          モダンなフロントエンド技術（Next.js、React、TypeScript）を活用した高パフォーマンスなWebアプリケーション開発から、SEO対策を考慮したコーディング、WordPressサイトの構築・カスタマイズまで幅広く対応しています。
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
            <p>SCSSを使用してスタイリングやレイアウトのコーディングを行います。レスポンシブデザインやアニメーションの実装に強みがあり、視覚的に魅力的で使いやすいデザインを実現します。また、BEM・FLOCSSを用いたCSS設計を取り入れ、保守性の高いコーディングを心がけています。</p>
          </div>
        </div>
        <div className="programming__item fadeUpTrigger">
          <div className="programming__image">
            <Image src="/img/pages/skill/img_javascript.svg" alt="JS" width={100} height={100} style={{ width: 'auto', height: '100px' }} />
          </div>
          <div className="programming__detail">
            <h3 className="programming__heading">JavaScript</h3>
            <p>JavaScriptを活用し、インタラクティブな機能やアニメーションを実装します。ES6+の最新構文やモジュールシステムを活用した効率的なコード開発を行い、パフォーマンスとユーザビリティの高いWebサイトを構築します。</p>
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
      <section className="framework inner inner-s">
        <h2 className="c-heading-lv2 fadeUpTrigger">
          <span className="c-heading-lv2-en">Modern Frontend</span>
          <span className="c-heading-lv2-ja">モダンフロントエンド</span>
        </h2>
        <p className="programming__note">
          ※以下は主に個人開発や学習を通じて身につけたスキルです。
        </p>
        <div className="programming__item fadeUpTrigger">
          <div className="programming__image">
            <svg width="100" height="100" viewBox="0 0 256 256" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid">
              <defs>
                <linearGradient x1="55.633%" y1="56.385%" x2="83.228%" y2="96.08%" id="a">
                  <stop stopColor="#FFF" offset="0%" />
                  <stop stopColor="#FFF" stopOpacity="0" offset="100%" />
                </linearGradient>
              </defs>
              <g fill="none">
                <circle fill="#000" cx="128" cy="128" r="128" />
                <path d="M212.634 224.028 98.335 76.8H76.8v102.357h17.228V98.68L199.11 234.446a128.433 128.433 0 0 0 13.524-10.418Z" fill="#FFF" />
                <path d="M163.556 76.8h17.067v102.4h-17.067z" fill="#FFF" />
                <path d="M30 204.8a127.97 127.97 0 0 0 14.347 12.267L198.888 19.2a128.433 128.433 0 0 0-13.523-10.418L30 204.8Z" fill="url(#a)" opacity=".5" />
              </g>
            </svg>
          </div>
          <div className="programming__detail">
            <h3 className="programming__heading">Next.js</h3>
            <p>
              個人開発や学習を通じて、Next.jsを使ったモダンなWebアプリケーション開発に取り組んでいます。App RouterやServer Componentsなどの最新機能も積極的に試し、SEOやパフォーマンスを意識したサイト構築を実践しています。静的生成（SSG）やサーバーサイドレンダリング（SSR）も用途に応じて使い分けています。
            </p>
          </div>
        </div>
        <div className="programming__item fadeUpTrigger">
          <div className="programming__image">
            <svg width="100" height="100" viewBox="0 0 256 228" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid">
              <path
                d="M210.483 73.824a171.49 171.49 0 0 0-8.24-2.597c.465-1.9.893-3.777 1.273-5.621 6.238-30.281 2.16-54.676-11.769-62.708-13.355-7.7-35.196.329-57.254 19.526a171.23 171.23 0 0 0-6.375 5.848 155.866 155.866 0 0 0-4.241-3.917C100.759 3.829 77.587-4.822 63.673 3.233 50.33 10.957 46.379 33.89 51.995 62.588a170.974 170.974 0 0 0 1.892 8.48c-3.28.932-6.445 1.924-9.474 2.98C17.309 83.498 0 98.307 0 113.668c0 15.865 18.582 31.778 46.812 41.427a145.52 145.52 0 0 0 6.921 2.165 167.467 167.467 0 0 0-2.01 9.138c-5.354 28.2-1.173 50.591 12.134 58.266 13.744 7.926 36.812-.22 59.273-19.855a145.567 145.567 0 0 0 5.342-4.923 168.064 168.064 0 0 0 6.92 6.314c21.758 18.722 43.246 26.282 56.54 18.586 13.731-7.949 18.194-32.003 12.4-61.268a145.016 145.016 0 0 0-1.535-6.842c1.62-.48 3.21-.974 4.76-1.488 29.348-9.723 48.443-25.443 48.443-41.52 0-15.417-17.868-30.326-45.517-39.844Zm-6.365 70.984c-1.4.463-2.836.91-4.3 1.345-3.24-10.257-7.612-21.163-12.963-32.432 5.106-11 9.31-21.767 12.459-31.957 2.619.758 5.16 1.557 7.61 2.4 23.69 8.156 38.14 20.213 38.14 29.504 0 9.896-15.606 22.743-40.946 31.14Zm-10.514 20.834c2.562 12.94 2.927 24.64 1.23 33.787-1.524 8.219-4.59 13.698-8.382 15.893-8.067 4.67-25.32-1.4-43.927-17.412a156.726 156.726 0 0 1-6.437-5.87c7.214-7.889 14.423-17.06 21.459-27.246 12.376-1.098 24.068-2.894 34.671-5.345.522 2.107.986 4.173 1.386 6.193ZM87.276 214.515c-7.882 2.783-14.16 2.863-17.955.675-8.075-4.657-11.432-22.636-6.853-46.752a156.923 156.923 0 0 1 1.869-8.499c10.486 2.32 22.093 3.988 34.498 4.994 7.084 9.967 14.501 19.128 21.976 27.15a134.668 134.668 0 0 1-4.877 4.492c-9.933 8.682-19.886 14.842-28.658 17.94ZM50.35 144.747c-12.483-4.267-22.792-9.812-29.858-15.863-6.35-5.437-9.555-10.836-9.555-15.216 0-9.322 13.897-21.212 37.076-29.293 2.813-.98 5.757-1.905 8.812-2.773 3.204 10.42 7.406 21.315 12.477 32.332-5.137 11.18-9.399 22.249-12.634 32.792a134.718 134.718 0 0 1-6.318-1.979Zm12.378-84.26c-4.811-24.587-1.616-43.134 6.425-47.789 8.564-4.958 27.502 2.111 47.463 19.835a144.318 144.318 0 0 1 3.841 3.545c-7.438 7.987-14.787 17.08-21.808 26.988-12.04 1.116-23.565 2.908-34.161 5.309a160.342 160.342 0 0 1-1.76-7.887Zm110.427 27.268a347.8 347.8 0 0 0-7.785-12.803c8.168 1.033 15.994 2.404 23.343 4.08-2.206 7.072-4.956 14.465-8.193 22.045a381.151 381.151 0 0 0-7.365-13.322Zm-45.032-43.861c5.044 5.465 10.096 11.566 15.065 18.186a322.04 322.04 0 0 0-30.257-.006c4.974-6.559 10.069-12.652 15.192-18.18ZM82.802 87.83a323.167 323.167 0 0 0-7.227 13.238c-3.184-7.553-5.909-14.98-8.134-22.152 7.304-1.634 15.093-2.97 23.209-3.984a321.524 321.524 0 0 0-7.848 12.897Zm8.081 65.352c-8.385-.936-16.291-2.203-23.593-3.793 2.26-7.3 5.045-14.885 8.298-22.6a321.187 321.187 0 0 0 7.257 13.246c2.594 4.48 5.28 8.868 8.038 13.147Zm37.542 31.03c-5.184-5.592-10.354-11.779-15.403-18.433 4.902.192 9.899.29 14.978.29 5.218 0 10.376-.117 15.453-.343-4.985 6.774-10.018 12.97-15.028 18.486Zm52.198-57.817c3.422 7.8 6.306 15.345 8.596 22.52-7.422 1.694-15.436 3.058-23.88 4.071a382.417 382.417 0 0 0 7.859-13.026 347.403 347.403 0 0 0 7.425-13.565Zm-16.898 8.101a358.557 358.557 0 0 1-12.281 19.815 329.4 329.4 0 0 1-23.444.823c-7.967 0-15.716-.248-23.178-.732a310.202 310.202 0 0 1-12.513-19.846h.001a307.41 307.41 0 0 1-10.923-20.627 310.278 310.278 0 0 1 10.89-20.637l-.001.001a307.318 307.318 0 0 1 12.413-19.761c7.613-.576 15.42-.876 23.31-.876H128c7.926 0 15.743.303 23.354.883a329.357 329.357 0 0 1 12.335 19.695 358.489 358.489 0 0 1 11.036 20.54 329.472 329.472 0 0 1-11 20.722Zm22.56-122.124c8.572 4.944 11.906 24.881 6.52 51.026-.344 1.668-.73 3.367-1.15 5.09-10.622-2.452-22.155-4.275-34.23-5.408-7.034-10.017-14.323-19.124-21.64-27.008a160.789 160.789 0 0 1 5.888-5.4c18.9-16.447 36.564-22.941 44.612-18.3ZM128 90.808c12.625 0 22.86 10.235 22.86 22.86s-10.235 22.86-22.86 22.86-22.86-10.235-22.86-22.86 10.235-22.86 22.86-22.86Z"
                fill="#00D8FF"
              />
            </svg>
          </div>
          <div className="programming__detail">
            <h3 className="programming__heading">React</h3>
            <p>
            <p>Reactを使用したコンポーネント設計とステート管理を得意としています。Hooksを活用した関数コンポーネントの実装や、Context APIやReduxによる状態管理など、モダンなReact開発手法を実践しています。また、パフォーマンス最適化やコンポーネントの再利用性を考慮した設計を心がけています。</p>
          </div>
        </div>
        <div className="programming__item fadeUpTrigger">
          <div className="programming__image">
            <svg width="100" height="100" viewBox="0 0 256 256" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid">
              <path fill="#3178C6" d="M20 0h216c11.046 0 20 8.954 20 20v216c0 11.046-8.954 20-20 20H20c-11.046 0-20-8.954-20-20V20C0 8.954 8.954 0 20 0Z" />
              <path
                fill="#FFF"
                d="M150.518 200.475v27.62c4.492 2.302 9.805 4.028 15.938 5.179 6.133 1.151 12.597 1.726 19.393 1.726 6.622 0 12.914-.633 18.874-1.899 5.96-1.266 11.187-3.352 15.678-6.257 4.492-2.906 8.048-6.704 10.669-11.394 2.62-4.689 3.93-10.486 3.93-17.391 0-5.006-.749-9.394-2.246-13.163-1.497-3.77-3.708-7.138-6.633-10.103-2.925-2.964-6.551-5.67-10.879-8.115-4.328-2.446-9.298-4.847-14.91-7.202-4.076-1.726-7.71-3.4-10.9-5.023-3.19-1.623-5.905-3.237-8.143-4.847-2.239-1.609-3.947-3.27-5.125-4.982-1.178-1.713-1.767-3.633-1.767-5.761 0-1.969.345-3.729 1.036-5.28.691-1.55 1.767-2.863 3.228-3.938 1.46-1.075 3.362-1.899 5.704-2.473 2.342-.575 5.125-.863 8.35-.863 2.239 0 4.64.151 7.202.454 2.563.303 5.146.765 7.751 1.388 2.604.622 5.146 1.417 7.625 2.383 2.478.967 4.794 2.099 6.948 3.4v-25.456c-4.164-1.593-8.773-2.776-13.827-3.55-5.054-.773-10.92-1.16-17.599-1.16-6.565 0-12.784.69-18.657 2.069-5.874 1.38-11.04 3.585-15.498 6.617-4.459 3.032-7.984 6.909-10.577 11.631-2.593 4.721-3.889 10.445-3.889 17.171 0 8.513 2.445 15.651 7.336 21.415 4.89 5.763 12.601 10.77 23.133 15.02 4.02 1.623 7.69 3.237 11.01 4.846 3.32 1.61 6.156 3.293 8.507 5.052 2.352 1.758 4.187 3.634 5.506 5.629 1.32 1.994 1.98 4.263 1.98 6.805 0 1.865-.345 3.57-1.036 5.118-.691 1.55-1.79 2.872-3.29 3.97-1.498 1.095-3.432 1.947-5.799 2.553-2.367.605-5.235.908-8.603.908-5.412 0-10.805-.908-16.18-2.725-5.374-1.817-10.394-4.542-15.058-8.176Zm-46.683-84.095h29.9v94.568h-29.9v-94.568Zm0-39.35h29.9v23.729h-29.9V77.03Z"
              />
            </svg>
          </div>
          <div className="programming__detail">
            <h3 className="programming__heading">TypeScript</h3>
            <p>個人開発を通じて、TypeScriptによる型安全なコーディングに取り組んでいます。インターフェースやジェネリクス、型推論などの機能を活用し、可読性と保守性の高いコードを意識しています。特にReactとの併用による型定義付きコンポーネント設計に注力しており、今後も実務レベルで活用できるよう学習を続けています。</p>
          </div>
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
            <Image src="/img/pages/skill/img_cursor.svg" alt="Cursor" width="100" height="100" priority sizes="100vw" />
          </div>
          <div className="tool__detail">
            <h3 className="programming__heading">Cursor・Visual Studio Code・Git</h3>
            <p>サイト構築時のメインエディタとして使用しています。AIアシスタントによるコード補完や、豊富な拡張機能を活用することで、開発環境を最適化し、より効率的なコーディングを実現しています。また、Gitを用いたバージョン管理も行っています。</p>
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
            <h3 className="programming__heading">ChatGPT・Perplexity・Gemini・NotebookLM</h3>
            <p>ブログやサイトの文章を考えたり、画像を作ったり、アイデアを出したりと、いろんな場面でAIツールを使っています。コンテンツのクオリティアップや作業の時短、新しい発想をもらうのにもすごく便利です。</p>
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
          <div className="other__card">バージョン管理（Git・GitHub）</div>
          <div className="other__card">データベース言語（SQL）</div>
          <div className="other__card">CMSサイトの構築（WP・MT）</div>
          <div className="other__card">ヘッドレスCMS（microCMS）</div>
          <div className="other__card">バナーやサムネイル画像の作成</div>
          <div className="other__card">JSON-LD構造化データ</div>
          <div className="other__card">ウェブアクセシビリティ</div>
        </div>
      </section>
    </>
  );
}
