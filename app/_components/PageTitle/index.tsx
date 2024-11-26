import Image from 'next/image';

type Props = {
  title: string;
  sub: string;
  img: string;
};

export default function PageTitle({ title, sub, img }: Props) {
  // 文字列を1文字ずつ分割して <span> タグでラップする関数
  const wrapWithSpan = (text: string) => text.split('').map((char, index) => <span key={index}>{char}</span>);

  return (
    <div className="pagetitle">
      <div className="pagetitle__image">
        <Image src={img} alt={sub + 'のイメージ画像'} width={1366} height={400} priority sizes="(max-width: 767px) 100vw, 1366px" />
      </div>
      <div className="l-inner">
        {/* titleを1文字ずつ<span>で囲む */}
        <p className="pagetitle__en">{wrapWithSpan(title)}</p>
        {/* subを1文字ずつ<span>で囲む */}
        <h1 className="pagetitle__ja">{wrapWithSpan(sub)}</h1>
      </div>
    </div>
  );
}
