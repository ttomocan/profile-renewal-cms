// ラベルの文字を残し、アイコンは読み上げが重複しない装飾として扱う。
const categoryPaths: Record<string, string> = {
  'サービスサイト': 'M4 4h16v16H4z M4 9h16 M8 6.5h.01 M11 6.5h.01 M9 13h6 M9 16h4',
  'コーポレートサイト': 'M5 21V3h14v18 M3 21h18 M9 7h1 M14 7h1 M9 11h1 M14 11h1 M10 21v-6h4v6',
  'ECサイト': 'M3 3h2l3 12h11l2-8H6 M9 20h.01 M18 20h.01',
  'ランディングページ': 'M5 3h14v18H5z M8 7h8 M8 11h8 M8 15h5 M8 18h8',
  'Webアプリ': 'M3 3h7v7H3z M14 3h7v7h-7z M3 14h7v7H3z M14 14h7v7h-7z',
  'ブログ': 'M4 4h16v16H4z M8 8h8 M8 12h8 M8 16h5',
  '採用サイト': 'M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2 M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8 M16 11h6 M19 8v6',
};
categoryPaths['スポーツチームサイト'] = 'M7 3h10v7a5 5 0 0 1-10 0V3 M7 5H3v3a4 4 0 0 0 4 4 M17 5h4v3a4 4 0 0 1-4 4 M12 15v6 M8 21h8';
categoryPaths['ブランドサイト'] = 'M3 3h8l10 10-8 8L3 11V3 M7 7h.01';
categoryPaths['メディア'] = 'M4 4h16v16H4z M7 7h4v5H7z M14 7h3 M14 10h3 M7 15h10 M7 18h7';
categoryPaths['LP（ランディングページ）'] = categoryPaths['ランディングページ'];
categoryPaths['LP'] = categoryPaths['ランディングページ'];
categoryPaths['メディアサイト'] = categoryPaths['ブログ'];

export default function ResultCategoryIcon({ category }: { category: string }) {
  return (
    <svg className="result-card__category-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">
      <path d={categoryPaths[category] ?? 'M3 5h18v14H3z M3 9h18 M7 7h.01'} />
    </svg>
  );
}
