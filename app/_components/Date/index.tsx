import styles from './index.module.css';
import { formatDate, formatDateISO } from '@/app/_libs/utils';

type Props = {
  date: string;
};

export default function Date({ date }: Props) {
  return (
    <time dateTime={formatDateISO(date)} className={styles.date}>
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
        <circle cx="12" cy="12" r="9" />
        <path d="M12 7v5l3.5 2" />
      </svg>
      {formatDate(date)}
    </time>
  );
}
