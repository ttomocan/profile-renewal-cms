import Image from 'next/image';
import Link from 'next/link';
import MenuBtn from '../MenuBtn';
import MenuNav from '../MenuNav';

export default function Header() {
  return (
    <header className="l-header">
      <h1 className="l-header__logo">
        <Link href="/">
          <Image src="/img/common/h_logo.svg" alt="ともきゃんスタイル" width={400} height={33} priority />
        </Link>
      </h1>
      <MenuBtn />
      <MenuNav />
    </header>
  );
}
