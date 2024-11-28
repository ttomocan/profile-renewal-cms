import Image from 'next/image';
import Link from 'next/link';
import MenuNav from '../MenuNav';
import { useState } from 'react';

export default function Header() {
  const [isOpen, setOpen] = useState<boolean>(false);
  const open = () => setOpen(true);
  const close = () => setOpen(false);
  return (
    <header className="l-header">
      <h1 className="l-header__logo">
        <Link href="/">
          <Image src="/img/common/h_logo.png" alt="ともきゃんスタイル" width={400} height={33} priority sizes="(max-width: 767px) 60vw, 400px" />
        </Link>
      </h1>
      <div className="l-header__menuBtn">
        <button className="l-header__menuBtn-button" aria-label="メニューを開く" onClick={open}>
          <span className="top"></span>
          <span className="middle"></span>
          <span className="bottom"></span>
        </button>
      </div>
      <MenuNav />
    </header>
  );
}
