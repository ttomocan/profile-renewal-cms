import '@/styles/pages/contact.scss';
import PageTitle from '@/app/_components/PageTitle';

export const metadata = {
  title: 'お問い合わせ',
  openGraph: {
    title: 'お問い合わせ',
  },
  twitter: {
    title: 'お問い合わせ',
  },
};

type Props = {
  children: React.ReactNode;
};

export default function RootLayout({ children }: Props) {
  return (
    <>
      <PageTitle title="Contact" sub="お問い合わせ" />
      <main>{children}</main>
    </>
  );
}
