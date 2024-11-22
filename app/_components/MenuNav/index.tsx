'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';
import cx from 'classnames';
import styles from './index.module.css';

export default function Menu() {
  const [isOpen, setOpen] = useState<boolean>(false);
  const open = () => setOpen(true);
  const close = () => setOpen(false);

  return (
    <div className={styles.header_link}>
      <ul className={styles.header_blog}>
        <li className={styles.header_blog_item}>
          <Link href="https://www.newagevoice.com/" target="_blank" className={styles.link_external}>
            ともきゃんのボイトレ生活
          </Link>
        </li>
        <li className={styles.header_blog_item}>
          <Link href="https://www.blogdesign-mania.com/" target="_blank" className={styles.link_external}>
            ブログデザインマニア
          </Link>
        </li>
      </ul>
      <nav className={cx(styles.nav, isOpen && styles.open, styles.header_navigation)} role="navigation" aria-label="グローバルナビゲーション">
        <ul className={styles.navigation}>
          <li className={styles.navigation_item}>
            <Link href="/">Top</Link>
          </li>
          <li className={styles.navigation_item}>
            <Link href="/about/">About</Link>
          </li>
          <li className={styles.navigation_item}>
            <Link href="/skill/">Skill</Link>
          </li>
          <li className={styles.navigation_item}>
            <Link href="/contact/">Contact</Link>
          </li>
        </ul>
      </nav>
      <div className={styles.header_sns}>
        <a href="https://x.com/t_tomocan" className={cx(styles.header_sns_item, styles._x)} target="_blank">
          <Image src="/common/icon_x.svg" alt="coconala" width={30} height={31} priority />
        </a>
        <a href="https://coconala.com/users/1531202" className={cx(styles.header_sns_item, styles._x)} target="_blank">
          <Image src="/common/icon_coconala.svg" alt="coconala" width={40} height={41} priority />
        </a>
      </div>
    </div>
  );
}
