import styles from './index.module.css';

type Props = {
  href: string;
  children: React.ReactNode;
};

export default function ButtonLink({ href, children }: Props) {
  return (
    <div className={styles.pagetop}>
      <div className={styles.pagetop_icon}></div>
      <a href={href} className={styles.pagetop_link}>
        {children}
      </a>
    </div>
  );
}
