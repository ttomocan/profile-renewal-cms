/**
 * サイトのファビコンURLを取得するユーティリティ関数
 */

/**
 * URLからドメインを抽出
 */
function extractDomain(url: string): string | null {
  try {
    const urlObj = new URL(url);
    return urlObj.hostname;
  } catch {
    return null;
  }
}

/**
 * Google Favicon APIを使用してファビコンURLを取得
 * フォールバック先も含めて複数のオプションを提供
 */
export function getFaviconUrl(siteUrl: string): string {
  const domain = extractDomain(siteUrl);

  if (!domain) {
    // デフォルトのファビコン（グローブアイコン）
    return 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9v-9m0-9v9m0 9c-5 0-9-4-9-9s4-9 9-9"/></svg>';
  }

  // Google Favicon APIを使用（最も確実）
  return `https://www.google.com/s2/favicons?domain=${domain}&sz=64`;
}

/**
 * 複数のファビコンオプションを取得（フォールバック用）
 */
export function getFaviconOptions(siteUrl: string): string[] {
  const domain = extractDomain(siteUrl);

  if (!domain) {
    return ['data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9v-9m0-9v9m0 9c-5 0-9-4-9-9s4-9 9-9"/></svg>'];
  }

  return [
    `https://www.google.com/s2/favicons?domain=${domain}&sz=64`,
    `https://${domain}/favicon.ico`,
    `https://${domain}/favicon.png`,
    // デフォルトフォールバック
    'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9v-9m0-9v9m0 9c-5 0-9-4-9-9s4-9 9-9"/></svg>',
  ];
}
