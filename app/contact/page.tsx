import ContactForm from '@/app/_components/ContactForm';
import ServiceJsonLd from '@/app/_components/ServiceJsonLd';
import BreadcrumbListJsonLd from '@/app/_components/BreadcrumbListJsonLd';

export default async function Page() {
  const breadcrumbItems = [
    { label: 'トップ', href: '/' },
    { label: 'お問い合わせ', active: true },
  ];

  return (
    <>
      <section className="inner">
      <p className="fadeUpTrigger">
        Webサイト制作やブログ運営に関するお悩みはありませんか？
        <br />
        9年以上のWeb制作経験と、5年間のブログ運営で培ったノウハウを活かして、あなたのお悩みを解決するお手伝いをします。
      </p>
      <ul className="u-mt20 c-list fadeUpTrigger">
        <li>Webサイト制作の依頼</li>
        <li>Webデザインの相談</li>
        <li>ブログに関する相談</li>
      </ul>
      <p className="u-mt20 u-mb20 fadeUpTrigger">
        など、あなたのお悩みやお困りごとを、下記のお問い合わせフォームからお気軽にご連絡ください。
        <br />
        お問い合わせ内容を確認したら、3日以内に返信します。あなたに合った最適な解決策を一緒に考えて、次のステップに進むサポートしますので、お気軽にご相談ください！
      </p>
      <p className="u-text-note fadeUpTrigger">ご返信には、必ずお名前とメールアドレスの記載をお願いします。記載がない場合、返信できないことがありますので、あらかじめご了承ください。</p>
      <ContactForm />
    </section>
      <ServiceJsonLd
        name="Webサイト制作・ブログ運営相談サービス"
        description="Webサイト制作、ブログデザイン、UI/UX改善、SEO対策など、Webに関するご相談・ご依頼を承ります。9年以上のWeb制作経験を活かして、あなたのお悩みを解決するお手伝いをします。"
        serviceType={['Webサイト制作', 'ブログデザイン', 'UI/UX改善', 'SEO対策', 'WordPress開発', 'Web制作相談', 'ブログ運営相談']}
        url="https://www.tomocan.site/contact/"
      />
      <BreadcrumbListJsonLd items={breadcrumbItems} />
    </>
  );
}
