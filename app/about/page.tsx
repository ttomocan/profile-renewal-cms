import Image from 'next/image';

export default async function Page() {
  return (
    <>
      <section className="greeting l-inner l-inner-s">
        <h2 className="c-heading-lv2 flipDownTrigger">
          <span className="c-heading-lv2-en">Greeting</span>
          <span className="c-heading-lv2-ja">ご挨拶</span>
        </h2>
        <div className="greeting__cont">
          <div className="greeting__image flipDownTrigger">
            <Image src="/img/pages/about/img_tomocan.jpg" alt="ともきゃんの似顔絵" width="200" height="200" priority sizes="100vw" />
            <p className="greeting__name">ともきゃん</p>
            <p className="greeting__occupation">Webエンジニア / ブロガー</p>
          </div>
          <div className="greeting__detail flipDownTrigger">
            <p>
              はじめまして、愛知在住のWebエンジニア兼ブロガーの「ともきゃん」です。妻と息子の3人で暮らしています。
              <br />
              平日はWeb制作会社で正社員として働き、Webサイト構築や運用・デザインの改善に携わっています。趣味で始めたブログも今では月間1万PVを超え、個人サービスの販売など幅広い活動を展開中です。数年前は、目的のない平凡な毎日を過ごしていましたが、ボイストレーニングとの出会いをきっかけに前向きな自分に激変。現在は、ブログを通じて多くの人に勇気を届けたいと考えています。
              <br />
              休日はブログ執筆や読書を楽しみ、時にはコワーキングスペースで作業に集中しています。
              <br />
              Webの力で一歩前に進みたい方、お気軽にご相談ください。
            </p>
          </div>
        </div>
      </section>
      <section className="profile l-inner l-inner-s">
        <h2 className="c-heading-lv2 flipDownTrigger">
          <span className="c-heading-lv2-en">Profile</span>
          <span className="c-heading-lv2-ja">プロフィール</span>
        </h2>
        <div className="profile__cont flipDownTrigger">
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
                <th>職業</th>
                <td>Webエンジニア、ブロガー</td>
              </tr>
              <tr>
                <th>趣味</th>
                <td>ブログ、読書、カラオケ</td>
              </tr>
              <tr>
                <th>座右の銘</th>
                <td>Webエンジニア、ブロガー</td>
              </tr>
              <tr>
                <th>職業</th>
                <td>遊ぶように生きる</td>
              </tr>
              <tr>
                <th>ロールモデル</th>
                <td>前田裕二氏</td>
              </tr>
              <tr>
                <th>人生のバイブル</th>
                <td>NARUTO</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>
      <section className="license l-inner l-inner-s">
        <h2 className="c-heading-lv2 flipDownTrigger">
          <span className="c-heading-lv2-en">License</span>
          <span className="c-heading-lv2-ja">資格</span>
        </h2>
        <ul className="license__cont c-list flipDownTrigger">
          <li>ウェブデザイン技能検定1級</li>
          <li>色彩検定1級</li>
          <li>Webクリエイター能力認定 エキスパート</li>
          <li>マルチメディア検定 エキスパート</li>
          <li>Webデザイナー検定 エキスパート</li>
          <li>ITパスワード</li>
        </ul>
      </section>
      <section className="result l-inner l-inner-s">
        <h2 className="c-heading-lv2 flipDownTrigger">
          <span className="c-heading-lv2-en">Result</span>
          <span className="c-heading-lv2-ja">実績</span>
        </h2>
        <ul className="result__cont c-list flipDownTrigger">
          <li>Webエンジニアとしての経験は9年間</li>
          <li>2社のWeb制作会社でWebエンジニアとして活動</li>
          <li>これまでに手掛けたWebサイトの構築数は100件以上</li>
          <li>ブログ運営での広告収益は累計100万円以上</li>
          <li>coconalaでの総売上は累計120万円以上</li>
        </ul>
      </section>
    </>
  );
}
