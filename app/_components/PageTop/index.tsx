import Link from 'next/link';

export default function PageTop() {
  return (
    <div className="c-pagetop">
      <div className="c-pagetop__icon"></div>
      <Link href="#" className="c-pagetop__link">
        PAGE TOP
      </Link>
    </div>
  );
}
