import Image from 'next/image';
import type { ReactNode } from 'react';

type Props = {
  title: string;
  sub: ReactNode;
  /** 詳細ページなど、本文側に主見出しがある場合は false */
  isHeading?: boolean;
};

type GraphicPage = 'about' | 'result' | 'contact';

const graphicPages = new Set<GraphicPage>(['about', 'result', 'contact']);

function PageGraphic({ page }: { page: GraphicPage }) {
  if (page === 'about') {
    return (
      <div className="pagetitle__graphic" aria-hidden="true">
        <span className="pagetitle__portrait-ring" />
        <span className="pagetitle__portrait">
          <Image src="/img/pages/top/img_tomocan.jpg" alt="" width={200} height={200} sizes="(max-width: 767px) 140px, 220px" priority />
        </span>
      </div>
    );
  }

  if (page === 'result') {
    return (
      <div className="pagetitle__graphic" aria-hidden="true">
        <svg viewBox="0 0 520 280" focusable="false">
          <rect className="pagetitle__window" x="20" y="20" width="480" height="240" rx="18" />
          <circle cx="50" cy="50" r="6" />
          <circle cx="72" cy="50" r="6" />
          <circle cx="94" cy="50" r="6" />
          <path d="M20 76H500" />
          <rect x="52" y="106" width="188" height="112" rx="10" />
          <rect x="264" y="106" width="204" height="18" rx="9" />
          <rect x="264" y="140" width="164" height="12" rx="6" />
          <rect x="264" y="168" width="190" height="12" rx="6" />
          <rect x="264" y="196" width="118" height="22" rx="11" />
        </svg>
      </div>
    );
  }

  return (
    <div className="pagetitle__graphic" aria-hidden="true">
      <svg viewBox="0 0 520 280" focusable="false">
        <rect className="pagetitle__envelope" x="46" y="54" width="428" height="172" rx="22" />
        <path d="M64 78L260 174L456 78" />
        <path d="M64 206L196 142" />
        <path d="M456 206L324 142" />
      </svg>
    </div>
  );
}

export default function PageTitle({ title, sub, isHeading = true }: Props) {
  // titleをサニタイズして安全なファイルパスに変換
  const sanitizeTitle = (title: string) => {
    return title.toLowerCase().replace(/[^a-z0-9-_]/g, '');
  };
  const lowerCaseTitle = sanitizeTitle(title);
  const graphicPage = graphicPages.has(lowerCaseTitle as GraphicPage) ? (lowerCaseTitle as GraphicPage) : null;

  return (
    <div className={`pagetitle pagetitle--${lowerCaseTitle}`}>
      <div className="pagetitle__visual">
        {graphicPage ? (
          <PageGraphic page={graphicPage} />
        ) : (
          <Image src={`/img/pages/${lowerCaseTitle}/img_hero.webp`} alt="" width={1366} height={400} sizes="100vw" priority />
        )}
      </div>
      <div className="pagetitle__content inner">
        <p className="pagetitle__en" aria-hidden="true">{title}</p>
        {isHeading ? <h1 className="pagetitle__ja">{sub}</h1> : <p className="pagetitle__ja">{sub}</p>}
      </div>
    </div>
  );
}
