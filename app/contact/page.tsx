import ContactForm from '@/app/_components/ContactForm';

export default async function Page() {
  return (
    <section className="l-inner">
      <p className="fadeUpTrigger">
        Webサイト制作やブログ運営に関するお悩みはありませんか？
        <br />
        9年以上のWeb制作経験と、5年間のブログ運営で培ったノウハウを活かして、あなたのお悩みを解決するお手伝いをします。
      </p>
      <ul className="u-mt20 c-list fadeUpTrigger">
        <li>Webサイト制作のご依頼</li>
        <li>Webデザインのご相談</li>
        <li>ブログに関する相談</li>
      </ul>
      <p className="u-mt20 u-mb20 fadeUpTrigger">
        など、あなたのお悩みやお困りごとを、下記のお問い合わせフォームからお気軽にご連絡ください。
        <br />
        お問い合わせ内容を確認したら、3日以内に返信します。あなたに合った最適な解決策を一緒に考えて、次のステップに進むサポートしますので、お気軽にご相談ください！
      </p>
      <p className="u-text-note fadeUpTrigger">ご返信には、必ずお名前とメールアドレスの記載をお願いいたします。記載がない場合、返信できないことがありますので、あらかじめご了承ください。</p>
      <ContactForm />
    </section>
  );
}
