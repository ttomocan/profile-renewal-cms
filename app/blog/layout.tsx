import PageTitle from '@/app/_components/PageTitle';

export const metadata = {
  title: 'ブログ',
};

type Props = {
  children: React.ReactNode;
};

export const revalidate = 60;

export default function BlogLayout({ children }: Props) {
  return (
    <>
      <PageTitle title="Blog" sub="ブログ" />
      <main>{children}</main>
    </>
  );
}
