import TitleArea from '@/app/_components/TitleArea';
import Sheet from '@/app/_components/Sheet';

export const metadata = {
  title: 'ニュース',
};

type Props = {
  children: React.ReactNode;
};

export const revalidate = 60;

export default function NewsLayout({ children }: Props) {
  return (
    <>
      <TitleArea title="News" sub="ニュース" />
      <Sheet>{children}</Sheet>
    </>
  );
}
