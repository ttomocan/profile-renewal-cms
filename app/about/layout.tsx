import PageTitle from '@/app/_components/PageTitle';
import Sheet from '@/app/_components/Sheet';

export const metadata = {
  title: 'ともきゃんはこんな人',
};

type Props = {
  children: React.ReactNode;
};

export default function RootLayout({ children }: Props) {
  return (
    <>
      <PageTitle title="About" sub="ともきゃんはこんな人" />
      <Sheet>{children}</Sheet>
    </>
  );
}
