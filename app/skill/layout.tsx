import '@/styles/pages/skill.scss';
import PageTitle from '@/app/_components/PageTitle';
import Breadcrumb from '@/app/_components/Breadcrumb';

const pageTitle = '対応スキル・技術｜WordPress・JavaScript・Next.js';
const description = 'WordPress、HTML、CSS、JavaScript、PHPを中心とした実務スキルと、Next.js、React、TypeScriptを使った個人開発、AIツールの活用範囲を経験区分ごとに紹介します。';
const keywords = ['Web制作スキル', 'WordPress開発', 'Next.js開発', 'React開発', 'SEO対策', 'UI/UX改善'];

export const metadata = {
  title: pageTitle,
  description,
  keywords,
  alternates: {
    canonical: 'https://www.tomocan.site/skill/',
  },
  openGraph: {
    title: pageTitle,
    description,
    url: 'https://www.tomocan.site/skill/',
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
    { label: '対応スキル・技術', active: true },
  ];

  return (
    <>
      <PageTitle title="Skill" sub="対応スキル・技術" />
      <Breadcrumb items={breadcrumbItems} />
      <main>{children}</main>
    </>
  );
}
