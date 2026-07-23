import ContactForm from '@/app/_components/ContactForm';
import BreadcrumbListJsonLd from '@/app/_components/BreadcrumbListJsonLd';

export default function Page() {
  const breadcrumbItems = [
    { label: 'トップ', href: '/' },
    { label: 'お問い合わせ', active: true },
  ];

  return (
    <>
      <section className="inner inner-s">
        <p className="fadeUpTrigger">採用、業務委託・協業、制作実績、ブログ・メディア運営に関するお問い合わせを受け付けています。</p>
        <ul className="u-mt20 c-list fadeUpTrigger">
          <li>採用に関するご連絡</li>
          <li>業務委託・協業のご相談</li>
          <li>制作実績に関するお問い合わせ</li>
          <li>ブログ・メディアに関するお問い合わせ</li>
        </ul>
        <p className="u-mt20 u-mb20 fadeUpTrigger">内容を確認のうえ、原則3日以内に返信します。現在、サイト・アプリの新規制作依頼は受け付けていません。</p>
        <p className="u-text-note fadeUpTrigger">テンプレートによる営業連絡や、返信先を確認できないお問い合わせには返信できない場合があります。添付ファイルは受け付けていないため、必要な資料がある場合は本文にその旨をご記載ください。</p>
        <ContactForm />
      </section>
      <BreadcrumbListJsonLd items={breadcrumbItems} />
    </>
  );
}
