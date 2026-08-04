import '@/styles/pages/skill.scss';
import PageTitle from '@/app/_components/PageTitle';
import Breadcrumb from '@/app/_components/Breadcrumb';
import Blog from '@/app/_components/Blog';
import { createMetadata } from '@/lib/seo';

const pageTitle = 'Web制作の対応スキル｜WordPress・Next.js・SEO｜ともきゃん';
const description = 'WordPress、HTML、CSS、JavaScript、PHPによる実務経験と、Next.js、React、TypeScriptを使った個人開発、SEO、UI改善、AI活用の対応範囲を紹介します。';

export const metadata = createMetadata({
  title: pageTitle,
  description,
  path: '/skill/',
});

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
      <PageTitle title="Skill" sub="Web制作の対応スキル" />
      <Breadcrumb items={breadcrumbItems} />
      <main>{children}</main>
      <Blog variant="skill" />
    </>
  );
}
