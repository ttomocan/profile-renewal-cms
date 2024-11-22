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
    <div className={styles.pagetop}>
      <div className={styles.pagetop__icon}></div>
      <Link href="#" className={styles.pagetop__link}></Link>
    </div>
    <h2 class="c-heading-lv2 flipDownTrigger">
      <span class="c-heading-lv2-en">Other</span>
      <span class="c-heading-lv2-ja">その他</span>
    </h2>
  );
}
