import Image from 'next/image';
import PersonJsonLd from '@/app/_components/PersonJsonLd';

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
            <Image src="/img/pages/about/img_tomocan.jpg" alt="ともきゃんの似顔絵" width={200} height={200} sizes="100vw" />
          </div>
          <div className="greeting__detail fadeUpTrigger">
            <p>
              はじめまして、名古屋在住のWebエンジニア兼ブロガーの「ともきゃん」です。妻と息子の3人家族で、ゆるく暮らしています。
              <br />
              普段はWeb制作会社でWebエンジニアとして働きながら、個人でWebサイト制作やブログ運営を行っています。
              <br />
              趣味で始めたブログが思いがけず月間1万PVまで成長し、個人サービスの販売もやってきました。
              <br />
              実は数年前までは「毎日なんとなく過ごす」だけ日々でしたが、ボイトレと出会い、ブログを始めてから価値観が180度変わりました。
              <br />
              今ではブログを通じて、画面越しのあなたへ「やればできる！」って気持ちを届けたいと思っています。
              <br />
              休日は家族の時間を大切に過ごしながら、ブログ執筆や読書を楽しみ、時にはコメダ珈琲やコワーキングスペースで作業に集中しています。
              <br />
              Webサイトやブログで「何か始めてみたいな」と思ったら、気軽にお声がけください！
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
              <tr className="c-profile-table__row">
                <th className="c-profile-table__th">名前</th>
                <td className="c-profile-table__td">
                  ともきゃん
                  <span className="u-text-note">本名＋英語の「can（できる）」を組み合わせた造語。「自分ならできる！」という意味を込めました。</span>
                </td>
              </tr>
              <tr className="c-profile-table__row">
                <th className="c-profile-table__th">生年月</th>
                <td className="c-profile-table__td">1994年1月生まれ</td>
              </tr>
              <tr className="c-profile-table__row">
                <th className="c-profile-table__th">出身地</th>
                <td className="c-profile-table__td">愛知県</td>
              </tr>
              <tr className="c-profile-table__row">
                <th className="c-profile-table__th">性別</th>
                <td className="c-profile-table__td">男性</td>
              </tr>
              <tr className="c-profile-table__row">
                <th className="c-profile-table__th">職種</th>
                <td className="c-profile-table__td">Webエンジニア、ブロガー</td>
              </tr>
              <tr className="c-profile-table__row">
                <th className="c-profile-table__th">趣味</th>
                <td className="c-profile-table__td">ブログ、読書、ゲーム</td>
              </tr>
              <tr className="c-profile-table__row">
                <th className="c-profile-table__th">座右の銘</th>
                <td className="c-profile-table__td">遊ぶように生きる（人生というゲームを、ワクワクしながらプレイすること）</td>
              </tr>
              <tr className="c-profile-table__row">
                <th className="c-profile-table__th">ロールモデル</th>
                <td className="c-profile-table__td">前田裕二氏</td>
              </tr>
              <tr className="c-profile-table__row">
                <th className="c-profile-table__th">人生のバイブル</th>
                <td className="c-profile-table__td">NARUTO</td>
              </tr>
              <tr className="c-profile-table__row">
                <th className="c-profile-table__th">ブログ実績</th>
                <td className="c-profile-table__td">月間PV 10,000以上、月間収益 約5万円</td>
              </tr>
              <tr className="c-profile-table__row">
                <th className="c-profile-table__th">活動拠点</th>
                <td className="c-profile-table__td">名古屋市（リモートワーク対応可能）</td>
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
      <section className="result inner">
        <h2 className="c-heading-lv2 fadeUpTrigger">
          <span className="c-heading-lv2-en">Result</span>
          <span className="c-heading-lv2-ja">実績</span>
        </h2>
        <div className="result__cont c-list fadeUpTrigger">
          <div className="result__card">Webエンジニア経験9年</div>
          <div className="result__card">Web制作会社2社で実務経験あり</div>
          <div className="result__card">Webサイトの構築数200件以上</div>
          <div className="result__card">ブログの広告収益累計150万円以上</div>
          <div className="result__card">coconalaの売上累計120万円以上</div>
          <div className="result__card">ブログの月間平均PV数1万PV以上</div>
        </div>
      </section>
      <PersonJsonLd />
    </>
  );
}
