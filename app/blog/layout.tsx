import '../globals.css';
import PageTitle from '@/app/_components/PageTitle';

export const metadata = {
  title: '日記',
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
