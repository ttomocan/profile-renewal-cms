import '@/styles/pages/about.scss';
import PageTitle from '@/app/_components/PageTitle';
import Breadcrumb from '@/app/_components/Breadcrumb';

const baseTitle = 'ともきゃんスタイル - プロフィールサイト';
const pageTitle = 'ともきゃんはこんな人';
const description = '名古屋在住のWebエンジニア兼ブロガー「ともきゃん」のプロフィール。Web制作経験9年、サイト構築200件以上の実績。ウェブデザイン技能検定1級、色彩検定1級保有。WordPress、Next.js、React、TypeScriptを使ったWeb制作が得意です。';

export const metadata = {
  title: {
    template: `%s | ${baseTitle}`,
    default: pageTitle,
  },
  description,
  alternates: {
    canonical: 'https://www.tomocan.site/about/',
  },
  openGraph: {
    title: {
      template: `%s | ${baseTitle}`,
      default: pageTitle,
    },
    description,
    url: 'https://www.tomocan.site/about/',
    images: [`/img/common/ogp.png?timestamp=${Date.now()}`],
    siteName: baseTitle,
  },
  twitter: {
    card: 'summary_large_image',
    site: '@t_tomocan',
    title: {
      template: `%s | ${baseTitle}`,
      default: pageTitle,
    },
    description,
    images: [`/img/common/ogp.png?timestamp=${Date.now()}`],
  },
};

type Props = {
  children: React.ReactNode;
};

export default function RootLayout({ children }: Props) {
  const breadcrumbItems = [
    { label: 'ホーム', href: '/' },
    { label: 'ともきゃんについて', active: true },
  ];

  return (
    <>
      <PageTitle title="About" sub="ともきゃんはこんな人" />
      <Breadcrumb items={breadcrumbItems} />
      <main>{children}</main>
    </>
  );
}
