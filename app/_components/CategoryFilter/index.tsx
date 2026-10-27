'use client';

import { useRouter } from 'next/navigation';
import { Suspense } from 'react';
import type { FormEvent } from 'react';
import { Category } from '@/app/_libs/microcms';
import styles from './index.module.css';

type CategoryFilterProps = {
  categories: Category[];
  selectedCategoryId?: string;
};

function CategoryFilterComponent({ categories, selectedCategoryId }: CategoryFilterProps) {
  const router = useRouter();
  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const categoryId = new FormData(event.currentTarget).get('category');
    router.push(categoryId ? `/diary/category/${encodeURIComponent(String(categoryId))}/` : '/diary/');
  };

  return (
    <form className={styles.categoryFilter} action="/diary/" method="get" onSubmit={handleSubmit}>
      <label className={styles.label} htmlFor="diary-category">
        カテゴリー:
      </label>
      <div className={styles.selectWrapper}>
        <select id="diary-category" name="category" defaultValue={selectedCategoryId || ''} className={styles.select}>
          <option value="">すべて</option>
          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>
        <svg className={styles.selectIcon} width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false">
          <path d="M2.5 4.5L6 8L9.5 4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
      <button type="submit" className={styles.submitButton}>表示する</button>
    </form>
  );
}

export default function CategoryFilter({ categories, selectedCategoryId }: CategoryFilterProps) {
  return (
    <Suspense>
      <CategoryFilterComponent key={selectedCategoryId || ''} categories={categories} selectedCategoryId={selectedCategoryId} />
    </Suspense>
  );
}
