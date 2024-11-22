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
    <div className={cx(styles.header_menuBtn, isOpen && styles.open)}>
      <button className={cx(styles.header_menuBtn_button, styles.close)} onClick={close}>
        <span className={styles.top}></span>
        <span className={styles.middle}></span>
        <span className={styles.bottom}></span>
      </button>
    </div>
  );
}
