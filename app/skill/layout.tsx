import '@/styles/pages/skill.scss';
import PageTitle from '@/app/_components/PageTitle';


const baseTitle = 'ともきゃんスタイル - プロフィールサイト';
export const metadata = {
  title: 'ともきゃんができること',

	openGraph: {
		title: {
			template: `%s | ${baseTitle}`,
			default: baseTitle,
		},
		images: [`/img/common/ogp.png?timestamp=${Date.now()}`],
		siteName: baseTitle,
	},
	twitter: {
		card: 'summary_large_image',
		site: '@t_tomocan',
		title: {
			template: `%s | ${baseTitle}`,
			default: baseTitle,
		},
		images: [`/img/common/ogp.png?timestamp=${Date.now()}`],
	},
};

type Props = {
  children: React.ReactNode;
};

export default function RootLayout({ children }: Props) {
  return (
    <>
      <PageTitle title="Skill" sub="ともきゃんができること" />
      <main>{children}</main>
    </>
  );
}
