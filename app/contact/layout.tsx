import PageTitle from '@/app/_components/PageTitle';
import Breadcrumb from '@/app/_components/Breadcrumb';

const baseTitle = 'ともきゃんスタイル - プロフィールサイト';
const pageTitle = 'お問い合わせ';
const description = 'Webサイト制作、ブログデザイン、UI/UX改善、SEO対策など、Webに関するご相談・ご依頼を承ります。9年以上のWeb制作経験を活かして、あなたのお悩みを解決するお手伝いをします。お気軽にお問い合わせください。';

export const metadata = {
  title: {
    template: `%s | ${baseTitle}`,
    default: pageTitle,
  },
  description,
  alternates: {
    canonical: 'https://www.tomocan.site/contact/',
  },
  openGraph: {
    title: {
      template: `%s | ${baseTitle}`,
      default: pageTitle,
    },
    description,
    url: 'https://www.tomocan.site/contact/',
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
