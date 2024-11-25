import ContactForm from '@/app/_components/ContactForm';

export default async function Page() {
  return (
    <section className="l-inner">
      <p className="flipDownTrigger">
        Webサイト制作のご依頼、Webデザインのご相談、個人ブログに関する相談など、あなたのお悩みやお困りごとをお聞かせください。下記のお問い合わせフォームからお気軽にご連絡いただけます。
        <br />
        お問い合わせ内容を確認次第、3日以内に返信いたします。お客様にとって最適な解決策をご提案し、一歩前に進むお手伝いをさせていただきます。ぜひご相談ください。
      </p>
      <p className="c-text-note u-mt20 flipDownTrigger">ご返信には、必ずお名前とご所属の記載をお願いいたします。記載がない場合、返信できないことがありますので、あらかじめご了承ください。</p>
      <ContactForm />
    </section>
  );
}
