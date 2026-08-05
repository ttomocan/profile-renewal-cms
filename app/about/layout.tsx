import '@/styles/pages/about.scss';
import PageTitle from '@/app/_components/PageTitle';
import Breadcrumb from '@/app/_components/Breadcrumb';
import Blog from '@/app/_components/Blog';
import { createMetadata } from '@/lib/seo';

const pageTitle = 'Webエンジニア ともきゃんのプロフィール・経歴';
const description = 'Web制作会社で10年以上、200サイト以上の制作に携わってきたWebエンジニア・ともきゃんのプロフィールです。担当領域、資格、仕事で大切にしている考え方、個人開発やブログ運営の活動を紹介します。';

export const metadata = createMetadata({
  title: pageTitle,
  description,
  path: '/about/',
});

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
      <PageTitle title="About" sub="ともきゃんのプロフィール・経歴" />
      <Breadcrumb items={breadcrumbItems} />
      <main>{children}</main>
      <Blog variant="about" />
    </>
  );
}
