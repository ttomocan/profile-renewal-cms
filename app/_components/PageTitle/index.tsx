import Image from 'next/image';

type Props = {
  title: string;
  sub: string;
};

export default function PageTitle({ title, sub }: Props) {
  // 文字列を1文字ずつ分割して <span> タグでラップする関数
  const wrapWithSpan = (text: string) => text.split('').map((char, index) => <span key={index}>{char}</span>);

  // title を小文字に変換
  const lowerCaseTitle = title.toLowerCase();

  return (
    <div className="pagetitle">
      <div className="pagetitle__image">
        <picture>
          <source srcSet={'/img/pages/' + lowerCaseTitle + '/img_hero.webp'} type="image/webp" />
          <Image src={'/img/pages/' + lowerCaseTitle + '/img_hero.jpg'} alt={sub + 'のイメージ画像'} width={1366} height={400} sizes="100vw" />
        </picture>
      </div>
      <div className="inner">
        <p className="pagetitle__en">{wrapWithSpan(title)}</p>
        <h1 className="pagetitle__ja">{wrapWithSpan(sub)}</h1>
      </div>
    </div>
  );
}
