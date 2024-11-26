import PageTitle from '@/app/_components/PageTitle';

export const metadata = {
  title: 'ともきゃんはこんな人',
};

type Props = {
  children: React.ReactNode;
};

export default function RootLayout({ children }: Props) {
  return (
    <>
      <PageTitle title="About" sub="ともきゃんはこんな人" img="/img/pages/about/img_hero.jpg" />
      <main>{children}</main>
    </>
  );
}
