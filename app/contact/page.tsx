import ContactForm from '@/app/_components/ContactForm';

export default async function Page() {
  return (
    <section className="l-inner">
      <p className="fadeUpTrigger">
        Webサイト制作のご依頼、Webデザインのご相談、ブログに関する相談など、あなたのお悩みやお困りごとをお聞かせください。下記のお問い合わせフォームからお気軽にご連絡ください。
        <br />
        お問い合わせ内容を確認したら、3日以内に返信させていただきます。あなたに合った最適な解決策を一緒に考えて、次のステップに進むサポートしますので、お気軽にご相談ください！
      </p>
      <p className="c-text-note u-mt20 fadeUpTrigger">ご返信には、必ずお名前とご所属の記載をお願いいたします。記載がない場合、返信できないことがありますので、あらかじめご了承ください。</p>
      <ContactForm />
    </section>
  );
}
