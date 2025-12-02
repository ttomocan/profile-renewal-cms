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
          ブログ運営に関するお悩みはありませんか？
          <br />
          5年間のブログ運営で培ったノウハウを活かして、あなたのお悩みを解決するお手伝いをします。
        </p>
        <ul className="u-mt20 c-list fadeUpTrigger">
          <li>広告を掲載してほしい</li>
          <li>ブログ運用について相談したい</li>
          <li>管理者に伝えたいことがある</li>
        </ul>
        <p className="u-mt20 u-mb20 fadeUpTrigger">
          など、あなたのお問い合わせ内容を、下記の入力フォームからお気軽にご入力ください。
          <br />
          お問い合わせ内容を確認したら、3日以内に返信します。あなたに合った最適な解決策を一緒に考えて、次のステップに進むサポートしますので、お気軽にご相談ください！
        </p>
        <p className="u-text-note fadeUpTrigger">ご返信には、必ずお名前とメールアドレスの記載をお願いします。記載がない場合やテンプレートの営業メールなど、返信できない場合がありますので、あらかじめご了承ください。</p>
        <p className="u-text-note fadeUpTrigger u-mt20"><strong>※現在、サイト・アプリ開発の依頼は承っておりません。</strong></p>
        <ContactForm />
      </section>
      <ServiceJsonLd name="ブログ運営相談サービス" description="ブログ運営、SEO対策など、ブログに関するご相談を承ります。5年間のブログ運営経験を活かして、あなたのお悩みを解決するお手伝いをします。" serviceType={['ブログ運営相談', 'SEO対策']} url="https://www.tomocan.site/contact/" />
      <BreadcrumbListJsonLd items={breadcrumbItems} />
    </>
  );
}
