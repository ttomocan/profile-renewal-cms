import Image from 'next/image';
import styles from '../DiaryFilterControls.module.css';

type SearchFieldProps = {
  defaultValue?: string;
};

export default function SearchField({ defaultValue }: SearchFieldProps = {}) {
  return (
    <form action="/diary/search/" method="get" className={styles.form} role="search">
      <label htmlFor="diary-search" className={styles.label}>キーワード</label>
      <div className={styles.controls}>
        <div className={styles.inputWrapper}>
          <Image src="/img/common/search.svg" alt="" width={16} height={16} />
          <input id="diary-search" type="search" name="q" defaultValue={defaultValue} placeholder="キーワードを入力" className={`${styles.field} ${styles.searchInput}`} />
        </div>
        <button type="submit" className={styles.submitButton}>
          検索
        </button>
        </div>
      </form>
    );
  }
