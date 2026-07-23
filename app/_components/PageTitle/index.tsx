import Image from 'next/image';

type Props = {
  title: string;
  sub: string;
  /** 詳細ページなど、本文側に主見出しがある場合は false */
  isHeading?: boolean;
};

export default function PageTitle({ title, sub, isHeading = true }: Props) {
  // 文字列を1文字ずつ分割して <span> タグでラップする関数
  const wrapWithSpan = (text: string) => text.split('').map((char, index) => <span key={index}>{char}</span>);

  // titleをサニタイズして安全なファイルパスに変換
  const sanitizeTitle = (title: string) => {
    return title.toLowerCase().replace(/[^a-z0-9-_]/g, '');
  };
  const lowerCaseTitle = sanitizeTitle(title);

  return (
    <div className="pagetitle">
      <div className="pagetitle__image">
        <picture>
          <source srcSet={`/img/pages/${lowerCaseTitle}/img_hero.webp`} type="image/webp" />
          <source srcSet={`/img/pages/${lowerCaseTitle}/img_hero.jpg`} type="image/jpg" />
          <Image src={`/img/pages/${lowerCaseTitle}/img_hero.webp`} alt="" width={1366} height={400} sizes="100vw" loading="eager" />
        </picture>
      </div>
      <div className="inner">
        <p className="pagetitle__en" aria-hidden="true">
          {wrapWithSpan(title)}
        </p>
        {isHeading ? <h1 className="pagetitle__ja">{sub}</h1> : <p className="pagetitle__ja">{sub}</p>}
      </div>
    </div>
  );
}
