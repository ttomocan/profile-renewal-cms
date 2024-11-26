import PageTitle from '@/app/_components/PageTitle';

export const metadata = {
  title: 'ともきゃんができること',
};

type Props = {
  children: React.ReactNode;
};

export default function RootLayout({ children }: Props) {
  return (
    <>
      <PageTitle title="Skill" sub="ともきゃんができること" img="/img/pages/skill/img_hero.jpg" />
      <main>{children}</main>
    </>
  );
}
