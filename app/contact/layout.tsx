import PageTitle from '@/app/_components/PageTitle';
import Breadcrumb from '@/app/_components/Breadcrumb';

const pageTitle = 'お問い合わせ｜採用・業務相談｜ともきゃん';
const description = '採用、業務委託・協業、制作実績、ブログやメディア運営に関する、ともきゃんへのお問い合わせ窓口です。内容を確認し、原則3日以内に返信します。';
const keywords = ['お問い合わせ', 'Web制作', 'サイト制作', 'ブログデザイン', 'SEO対策', 'UI/UX改善', '名古屋'];

export const metadata = {
  title: pageTitle,
  description,
  keywords,
  alternates: {
    canonical: 'https://www.tomocan.site/contact/',
  },
  openGraph: {
    title: pageTitle,
    description,
    url: 'https://www.tomocan.site/contact/',
    type: 'website',
    images: ['/img/common/ogp.png'],
    siteName: 'ともきゃんスタイル',
    locale: 'ja_JP',
  },
  twitter: {
    card: 'summary_large_image',
    site: '@t_tomocan',
    title: pageTitle,
    description,
    images: ['/img/common/ogp.png'],
  },
};

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
    </>
  );
}
