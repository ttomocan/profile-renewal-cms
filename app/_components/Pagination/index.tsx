'use client';

import { DIARY_LIST_LIMIT } from '@/app/_constants';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import styles from './index.module.css';

type Props = {
  totalCount: number;
  current?: number;
  basePath?: string;
};

export default function Pagination({ totalCount, current = 1, basePath = '/diary/' }: Props) {
  const [isMobile, setIsMobile] = useState(false);
  const totalPages = Math.ceil(totalCount / DIARY_LIST_LIMIT);
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  // ページが1ページ以下の場合は何も表示しない
  if (totalPages <= 1) {
    return null;
  }

  // 画面幅に応じてモバイル判定を行う
  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkIfMobile();
    window.addEventListener('resize', checkIfMobile);
    return () => window.removeEventListener('resize', checkIfMobile);
  }, []);

  // モバイル表示用に表示するページ番号を絞り込む
  const getVisiblePages = () => {
    // ページ数が少ない場合（5以下）は全て表示
    if (totalPages <= 5) {
      return pages;
    }

    // モバイルでない場合は、ページ数が7以下なら全て表示
    if (!isMobile && totalPages <= 7) {
      return pages;
    }

    let visiblePages = [];

    // 常に最初のページを表示
    visiblePages.push(1);

    // 現在のページの周辺を表示（モバイルとデスクトップで表示数を変える）
    const adjacentCount = isMobile ? 1 : 2;

    for (let i = Math.max(2, current - adjacentCount); i <= Math.min(totalPages - 1, current + adjacentCount); i++) {
      visiblePages.push(i);
    }

    // 常に最後のページを表示
    visiblePages.push(totalPages);

    // 連続していないページの間に省略記号を挿入
    const pagesWithEllipsis = [];
    let prevPage = 0;

    visiblePages.forEach((page) => {
      if (page - prevPage > 1) {
        pagesWithEllipsis.push('ellipsis' + prevPage);
      }
      pagesWithEllipsis.push(page);
      prevPage = page;
    });

    return pagesWithEllipsis;
  };

  const visiblePages = getVisiblePages();

  return (
    <nav aria-label="ページナビゲーション" className={styles.pagination}>
      <ul className={styles.container}>
        {/* 前のページへのリンク */}
        {current > 1 && (
          <li className={styles.list}>
            <Link href={`${basePath}${current === 2 ? '' : `/p/${current - 1}`}`} className={`${styles.item} ${styles.arrow}`} aria-label="前のページへ">
              &lt;
            </Link>
          </li>
        )}

        {/* ページ番号 */}
        {visiblePages.map((p, index) => {
          if (typeof p === 'string' && p.startsWith('ellipsis')) {
            // 省略記号
            return (
              <li className={`${styles.list} ${styles.ellipsis}`} key={p}>
                <span className={styles.ellipsisItem}>...</span>
              </li>
            );
          }

          return (
            <li className={styles.list} key={p}>
              {current !== p ? (
                <Link href={p === 1 ? basePath : `${basePath}/p/${p}`} className={styles.item} aria-label={`${p}ページ目へ`}>
                  {p}
                </Link>
              ) : (
                <span className={`${styles.item} ${styles.current}`} aria-current="page">
                  {p}
                </span>
              )}
            </li>
          );
        })}

        {/* 次のページへのリンク */}
        {current < totalPages && (
          <li className={styles.list}>
            <Link href={`${basePath}/p/${current + 1}`} className={`${styles.item} ${styles.arrow}`} aria-label="次のページへ">
              &gt;
            </Link>
          </li>
        )}
      </ul>
    </nav>
  );
}
