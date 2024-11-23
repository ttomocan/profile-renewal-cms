'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';
import cx from 'classnames';

export default function Menu() {
  const [isOpen, setOpen] = useState<boolean>(false);
  const open = () => setOpen(true);
  const close = () => setOpen(false);

  return (
    <div className="l-header__menuBtn">
      <button className="l-header__menuBtn-button">
        <span className="top"></span>
        <span className="middle"></span>
        <span className="bottom"></span>
      </button>
    </div>
  );
}
