import Image from 'next/image';
import styles from './index.module.css';

type SearchFieldProps = {
  defaultValue?: string;
};

export default function SearchField({ defaultValue }: SearchFieldProps = {}) {
  return (
    <form action="/diary/search/" method="get" className={styles.form} role="search">
      <div className={styles.search}>
        <Image src="/img/common/search.svg" alt="" width={16} height={16} />
        <label htmlFor="diary-search" className="u-visually-hidden">
          活動記録の記事を検索
        </label>
        <input id="diary-search" type="search" name="q" defaultValue={defaultValue} placeholder="キーワードを入力" className={styles.searchInput} />
        <button type="submit" className={styles.submitButton}>
          検索
        </button>
      </div>
    </form>
  );
}
