import Image from 'next/image';

export default async function Page() {
  return (
    <>
      <section className="greeting inner inner-s">
        <h2 className="c-heading-lv2 fadeUpTrigger">
          <span className="c-heading-lv2-en">Greeting</span>
          <span className="c-heading-lv2-ja">ご挨拶</span>
        </h2>
        <div className="greeting__cont">
          <div className="greeting__image fadeUpTrigger">
            <Image src="/img/pages/about/img_tomocan.jpg" alt="ともきゃんの似顔絵" width={200} height={200} priority sizes="100vw" />
          </div>
          <div className="greeting__detail fadeUpTrigger">
            <p>
              はじめまして、名古屋在住のWebエンジニア兼ブロガーの「ともきゃん」です。妻と息子の3人家族で、毎日ゆるく暮らしています。
              <br />
              普段はWeb制作会社でWebエンジニアとして働きながら、個人でWebサイト制作やブログ運営を行っています。
              <br />
              趣味で始めたブログが思いがけず月間1万PVまで成長して、今では個人サービスの販売もやっています。
              <br />
              実は数年前までは「毎日なんとなく過ごす」だけ日々でしたが、ボイトレと出会ってから性格が180度変わりました。
              <br />
              今はブログを通じて、画面越しのあなたへ「やればできる！」って気持ちを届けられたらいいな、と思っています。
              <br />
              休日はブログ執筆や読書を楽しみ、時にはコワーキングスペースで作業に集中しています。
              <br />
              Webサイトやブログを通じて新しい一歩を踏み出したい方、お気軽にご相談ください。
            </p>
            <p className="greeting__detail__sign">
              <Image src="/img/pages/about/text_sign.svg" alt="ともきゃんのサイン" width={135} height={27} />
            </p>
          </div>
        </div>
      </section>
      <section className="profile inner inner-s">
        <h2 className="c-heading-lv2 fadeUpTrigger">
          <span className="c-heading-lv2-en">Profile</span>
          <span className="c-heading-lv2-ja">プロフィール</span>
        </h2>
        <div className="profile__cont fadeUpTrigger">
          <table className="c-table-01">
            <tbody>
              <tr>
                <th>名前</th>
                <td>ともきゃん</td>
              </tr>
              <tr>
                <th>生年月</th>
                <td>1994年1月生まれ</td>
              </tr>
              <tr>
                <th>出身地</th>
                <td>愛知県</td>
              </tr>
              <tr>
                <th>性別</th>
                <td>男性</td>
              </tr>
              <tr>
                <th>職種</th>
                <td>Webエンジニア、ブロガー</td>
              </tr>
              <tr>
                <th>趣味</th>
                <td>ブログ、読書、ゲーム</td>
              </tr>
              <tr>
                <th>座右の銘</th>
                <td>遊ぶように生きる（人生というゲームを、ワクワクしながらプレイすること）</td>
              </tr>
              <tr>
                <th>ロールモデル</th>
                <td>前田裕二氏</td>
              </tr>
              <tr>
                <th>人生のバイブル</th>
                <td>NARUTO</td>
              </tr>
              <tr>
                <th>活動拠点</th>
                <td>名古屋市</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>
      <section className="license inner inner-s">
        <h2 className="c-heading-lv2 fadeUpTrigger">
          <span className="c-heading-lv2-en">License</span>
          <span className="c-heading-lv2-ja">資格</span>
        </h2>
        <div className="license__cont c-list fadeUpTrigger">
          <div className="license__card">ウェブデザイン技能検定1級</div>
          <div className="license__card">色彩検定1級</div>
          <div className="license__card">Webクリエイター能力認定 エキスパート</div>
          <div className="license__card">マルチメディア検定 エキスパート</div>
          <div className="license__card">Webデザイナー検定 エキスパート</div>
          <div className="license__card">ITパスポート</div>
        </div>
      </section>
      <section className="result inner inner-s">
        <h2 className="c-heading-lv2 fadeUpTrigger">
          <span className="c-heading-lv2-en">Result</span>
          <span className="c-heading-lv2-ja">実績</span>
        </h2>
        <div className="result__cont c-list fadeUpTrigger">
          <div className="result__card">Webエンジニア経験9年</div>
          <div className="result__card">Web制作会社2社で実務経験あり</div>
          <div className="result__card">Webサイトの構築数200件以上</div>
          <div className="result__card">ブログの広告収益累計100万円以上</div>
          <div className="result__card">coconalaの売上累計120万円以上</div>
          <div className="result__card">ブログの月間平均PV数1万PV以上</div>
        </div>
      </section>
    </>
  );
}
