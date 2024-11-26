import Image from 'next/image';

type Props = {
  title: string;
  sub: string;
  img: string;
};

export default function PageTitle({ title, sub, img }: Props) {
  return (
    <div className="pagetitle">
      <div className="pagetitle__image">
        <Image src={img} alt="" width={1366} height={400} priority sizes="100vw" />
      </div>
      <div className="l-inner">
        <p className="pagetitle__en">{title}</p>
        <h1 className="pagetitle__ja">{sub}</h1>
      </div>
    </div>
  );
}
