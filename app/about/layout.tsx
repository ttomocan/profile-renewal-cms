import '@/styles/pages/about.scss';
import PageTitle from '@/app/_components/PageTitle';
import Breadcrumb from '@/app/_components/Breadcrumb';
import { createMetadata } from '@/lib/seo';

const pageTitle = 'Webエンジニア ともきゃんのプロフィール・経歴';
const description = 'Web制作会社で10年以上の経験があり、Web制作200件以上に参画してきたWebエンジニア・ともきゃんのプロフィールです。件数は新規サイト・LP、副業を含み、改修を除きます。学歴・職歴、担当領域、資格、個人開発やブログ運営の活動を紹介します。';

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
      <PageTitle
        title="About"
        sub={<><span className="pagetitle__phrase">ともきゃんの</span><wbr /><span className="pagetitle__phrase">プロフィール・経歴</span></>}
      />
      <Breadcrumb items={breadcrumbItems} />
      <main>{children}</main>
    </>
  );
}
