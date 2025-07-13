'use client';

import Image from 'next/image';
import { useRouter, useSearchParams } from 'next/navigation';
import styles from './index.module.css';
import { Suspense } from 'react';

type SearchFieldComponentProps = {
  defaultValue?: string;
};

function SearchFieldComponent({ defaultValue }: SearchFieldComponentProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  // デフォルト値を優先し、なければURLパラメータから取得
  const initialValue = defaultValue ?? searchParams.get('q') ?? undefined;

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const q = e.currentTarget.elements.namedItem('q');
    if (q instanceof HTMLInputElement) {
      const query = q.value.trim();

      // 空の検索クエリの場合は日記一覧ページにリダイレクト
      if (!query) {
        router.push('/diary/');
        return;
      }

      const params = new URLSearchParams();
      params.set('q', query);
      router.push(`/diary/search?${params.toString()}`);
    }
  };

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      <label className={styles.search}>
        <Image src="/img/common/search.svg" alt="検索" width={16} height={16} loading="eager" />
        <input type="text" name="q" defaultValue={initialValue} placeholder="キーワードを入力" className={styles.searchInput} aria-label="ブログ記事を検索" />
        <button type="submit" className={styles.submitButton}>
          検索
        </button>
      </label>
    </form>
  );
}

type SearchFieldProps = {
  defaultValue?: string;
};

export default function SearchField({ defaultValue }: SearchFieldProps = {}) {
  return (
    <Suspense>
      <SearchFieldComponent defaultValue={defaultValue} />
    </Suspense>
  );
}
