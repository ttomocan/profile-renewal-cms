import '@/styles/pages/about.scss';
import PageTitle from '@/app/_components/PageTitle';
import Breadcrumb from '@/app/_components/Breadcrumb';

const pageTitle = 'ともきゃんのプロフィール・経歴｜Webエンジニア';
const description = 'Web制作会社で10年以上、200サイト以上の制作に携わってきたWebエンジニア・ともきゃんのプロフィール。担当領域、仕事で大切にしていること、資格、個人開発やブログ運営の活動を紹介します。';
const keywords = [
  'プロフィール',
  'Webエンジニア',
  'ブロガー',
  '名古屋',
  'WordPress',
  'Next.js',
  'React',
  'TypeScript',
];

export const metadata = {
  title: pageTitle,
  description,
  keywords,
  alternates: {
    canonical: 'https://www.tomocan.site/about/',
  },
  openGraph: {
    title: pageTitle,
    description,
    url: 'https://www.tomocan.site/about/',
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
    { label: 'プロフィール・経歴', active: true },
  ];

  return (
    <>
      <PageTitle title="About" sub="プロフィール・経歴" />
      <Breadcrumb items={breadcrumbItems} />
      <main>{children}</main>
    </>
  );
}
