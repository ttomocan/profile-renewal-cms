'use client';

export default function Menu() {
  return (
    <div className="l-header__menuBtn">
      <button className="l-header__menuBtn-button" aria-label="メニューを開く">
        <span className="top"></span>
        <span className="middle"></span>
        <span className="bottom"></span>
      </button>
    </div>
  );
}
