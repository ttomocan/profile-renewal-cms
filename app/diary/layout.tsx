import './globals.css';
import PageTitle from '@/app/_components/PageTitle';
import type { Metadata } from 'next';
import Blog from '@/app/_components/Blog';
import { createMetadata } from '@/lib/seo';

// メタデータの定数
const META_TITLE = 'Web開発・個人開発・ブログ運営の活動記録｜ともきゃん';

/**
 * メタデータを生成する
 */
export async function generateMetadata(): Promise<Metadata> {
  const description = 'Webエンジニア・ともきゃんの活動記録です。Web制作、Next.jsやAIを使った個人開発、ブログ運営、キャリア、育児と働き方で得た学びを発信しています。';

  return createMetadata({
    title: META_TITLE,
    description,
    path: '/diary/',
  });
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <PageTitle title="Diary" sub="ともきゃん日記" isHeading={false} />
      <main>{children}</main>
      <Blog variant="diary" />
    </>
  );
}
