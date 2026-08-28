import type { Category } from '@/app/_libs/microcms';
import styles from './index.module.css';

type Props = {
  category: Category;
};
export default function Category({ category }: Props) {
  return (
    <span className={styles.tag}>
      <svg
        className={styles.icon}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="M20 13 13 20l-9-9V4h7l9 9Z" />
        <circle cx="8.5" cy="8.5" r="1.25" fill="currentColor" stroke="none" />
      </svg>
      {category.name}
    </span>
  );
}
