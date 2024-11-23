type Props = {
  title: string;
  sub: string;
};

export default function PageTitle({ title, sub }: Props) {
  return (
    <div className="pagetitle">
      <div className="l-inner">
        <p className="pagetitle__en">{title}</p>
        <h1 className="pagetitle__ja">{sub}</h1>
      </div>
    </div>
  );
}
