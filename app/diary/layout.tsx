import './globals.css';
import '@/styles/pages/diary.scss';
import PageTitle from '@/app/_components/PageTitle';

export const metadata = {
  title: '日記',
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

export const revalidate = 60;

export default function BlogLayout({ children }: Props) {
  return (
    <>
      <PageTitle title="Diary" sub="日記" />
      <main>{children}</main>
    </>
  );
}
