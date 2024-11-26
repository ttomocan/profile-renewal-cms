import Image from 'next/image';
import Link from 'next/link';
import MenuNav from '../MenuNav';

export default function Header() {
  return (
    <header className="l-header">
      <h1 className="l-header__logo">
        <Link href="/">
          <Image src="/img/common/h_logo.svg" alt="ともきゃんスタイル" width={400} height={33} priority sizes="(max-width: 767px) 60vw, 400px" />
        </Link>
      </h1>
      <div className="l-header__menuBtn">
        <button className="l-header__menuBtn-button" aria-label="メニューを開く">
          <span className="top"></span>
          <span className="middle"></span>
          <span className="bottom"></span>
        </button>
      </div>
      <MenuNav />
    </header>
  );
}
