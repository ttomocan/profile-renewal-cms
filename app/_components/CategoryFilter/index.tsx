'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense } from 'react';
import { Category } from '@/app/_libs/microcms';
import styles from './index.module.css';

type CategoryFilterProps = {
  categories: Category[];
  selectedCategoryId?: string;
};

function CategoryFilterComponent({ categories, selectedCategoryId }: CategoryFilterProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleCategoryChange = (categoryId: string) => {
    const params = new URLSearchParams(searchParams.toString());

    if (categoryId === 'all') {
      params.delete('category');
    } else {
      params.set('category', categoryId);
    }

    // 検索クエリがある場合は保持
    const query = searchParams.get('q');
    if (query) {
      params.set('q', query);
    }

    const queryString = params.toString();
    const url = queryString ? `/diary/?${queryString}` : '/diary/';
    router.push(url);
  };

  return (
    <div className={styles.categoryFilter}>
      <label className={styles.label}>カテゴリー:</label>
      <div className={styles.selectWrapper}>
        <select value={selectedCategoryId || 'all'} onChange={(e) => handleCategoryChange(e.target.value)} className={styles.select} aria-label="カテゴリーで絞り込み">
          <option value="all">すべて</option>
          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>
        <svg className={styles.selectIcon} width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M2.5 4.5L6 8L9.5 4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
    </div>
  );
}

export default function CategoryFilter({ categories, selectedCategoryId }: CategoryFilterProps) {
  return (
    <Suspense>
      <CategoryFilterComponent categories={categories} selectedCategoryId={selectedCategoryId} />
    </Suspense>
  );
}
