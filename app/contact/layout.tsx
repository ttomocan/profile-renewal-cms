import PageTitle from '@/app/_components/PageTitle';
import Breadcrumb from '@/app/_components/Breadcrumb';
import Blog from '@/app/_components/Blog';
import { createMetadata } from '@/lib/seo';

const pageTitle = 'お問い合わせ｜採用・業務委託・協業｜ともきゃん';
const description = 'Webエンジニア・ともきゃんへのお問い合わせ窓口です。採用、業務委託、協業、制作実績、ブログ・メディア運営に関するご連絡を受け付け、原則3日以内に返信します。';

export const metadata = createMetadata({
  title: pageTitle,
  description,
  path: '/contact/',
});

type Props = {
  children: React.ReactNode;
};

export default function RootLayout({ children }: Props) {
  const breadcrumbItems = [
    { label: 'トップ', href: '/' },
    { label: 'お問い合わせ', active: true },
  ];

  return (
    <>
      <PageTitle title="Contact" sub="お問い合わせ" />
      <Breadcrumb items={breadcrumbItems} />
      <main>{children}</main>
      <Blog variant="contact" />
    </>
  );
}
