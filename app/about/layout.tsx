import '@/styles/pages/about.scss';
import PageTitle from '@/app/_components/PageTitle';

const baseTitle = 'ともきゃんスタイル - プロフィールサイト';
const pageTitle = 'ともきゃんはこんな人';
export const metadata = {
  title: {
    template: `%s | ${baseTitle}`,
    default: pageTitle,
  },

	openGraph: {
		title: {
			template: `%s | ${baseTitle}`,
    	default: pageTitle,
		},
		images: [`/img/common/ogp.png?timestamp=${Date.now()}`],
		siteName: baseTitle,
	},
	twitter: {
		card: 'summary_large_image',
		site: '@t_tomocan',
		title: {
			template: `%s | ${baseTitle}`,
			default: pageTitle,
		},
		images: [`/img/common/ogp.png?timestamp=${Date.now()}`],
	}
};

type Props = {
	children: React.ReactNode;
};

export default function RootLayout({ children }: Props) {
  return (
    <>
      <PageTitle title="About" sub="ともきゃんはこんな人" />
      <main>{children}</main>
    </>
  );
}
