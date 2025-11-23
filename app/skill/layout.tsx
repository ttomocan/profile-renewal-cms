import '@/styles/pages/skill.scss';
import PageTitle from '@/app/_components/PageTitle';
import Breadcrumb from '@/app/_components/Breadcrumb';

const baseTitle = 'ともきゃんスタイル - プロフィールサイト';
const pageTitle = 'ともきゃんができること';
const description = 'HTML/CSS/JavaScript、PHP、WordPress、Next.js、React、TypeScriptを使ったWeb制作スキル。Figma、Photoshop、Illustratorでのデザイン制作。ChatGPT、Claude、GeminiなどAIツールを活用した効率的なWeb開発が可能です。';

export const metadata = {
  title: {
    template: `%s | ${baseTitle}`,
    default: pageTitle,
  },
  description,
  alternates: {
    canonical: 'https://www.tomocan.site/skill/',
  },
  openGraph: {
    title: {
      template: `%s | ${baseTitle}`,
      default: pageTitle,
    },
    description,
    url: 'https://www.tomocan.site/skill/',
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
    { label: 'トップ', href: '/' },
    { label: 'ともきゃんができること', active: true },
  ];

  return (
    <>
      <PageTitle title="Skill" sub="ともきゃんができること" />
      <Breadcrumb items={breadcrumbItems} />
      <main>{children}</main>
    </>
  );
}
