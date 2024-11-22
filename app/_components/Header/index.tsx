import Image from 'next/image';
import Link from 'next/link';
import styles from './index.module.css';
import MenuBtn from '../MenuBtn';
import MenuNav from '../MenuNav';

export default function Header() {
  return (
    <header className={styles.header}>
      <h1 className={styles.header_logo}>
        <Link href="/" className={styles.header_logo_link}>
          <Image src="/common/h_logo.svg" alt="ともきゃんスタイル" className={styles.logo} width={400} height={33} priority />
        </Link>
      </h1>
      <MenuBtn />
      <MenuNav />
    </header>
  );
}
