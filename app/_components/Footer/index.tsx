import Link from 'next/link';

export default function Footer() {
  return (
    <>
      <div className="c-wave">
        <canvas id="waveCanvas"></canvas>
      </div>
      <footer className="l-footer">
        <div className="l-footer__navigation" role="navigation" aria-label="グローバルナビゲーション">
          <ul className="l-navigation">
            <li className="l-navigation__item">
              <Link href="/">Top</Link>
            </li>
            <li className="l-navigation__item">
              <Link href="/about/">About</Link>
            </li>
            <li className="l-navigation__item">
              <Link href="/skill/">Skill</Link>
            </li>
            <li className="l-navigation__item">
              <Link href="/contact/">Contact</Link>
            </li>
          </ul>
        </div>
        <div className="l-footer__copyright">
          <small>&copy; 2024 ともきゃんスタイル inc.</small>
        </div>
      </footer>
    </>
  );
}
