import type { Blog } from '@/app/_libs/microcms';

const articleId = 'buffet-life-parenting-1yearhalf';
const originalSource = 'https://images.microcms-assets.io/assets/764831a5a2c84d3c982ee2d40033122f/7114714a07d34bcf847a410e771b45f9/img_buffet-life-parenting-1yearhalf.jpeg?w=500&amp;h=272';

// CMS media-upload permission is unavailable. This narrow presentation override
// retires automatically once the editor replaces the original image in the CMS.
export function getArticleContent(data: Pick<Blog, 'id' | 'content'>): string {
  if (data.id === 'iropon-release') return refreshIroponScreenshots(data.content);
  if (data.id !== articleId) return data.content;
  return data.content.replace(/<img\b[^>]*>/gi, (image) => {
    const source = image.match(/\bsrc="([^"]*)"/i)?.[1];
    if (source !== originalSource) return image;
    return image
      .replace(`src="${originalSource}"`, 'src="/img/diary/buffet-life-illustration.webp"')
      .replace(/\bwidth="[^"]*"/i, 'width="1697"')
      .replace(/\bheight="[^"]*"/i, 'height="927"');
  });
}

const iroponScreenshotAssets = 'https://images.microcms-assets.io/assets/764831a5a2c84d3c982ee2d40033122f/';
const iroponScreenshots = [
  {
    cmsAsset: 'c96db3ae4ab5488fa7e8a63f4c24d4df/iropon-premium-home.jpg',
    file: 'home.webp', width: 1355, height: 931,
    alt: 'マスコット、4択クイズの見本と級別メニューがある、現在のいろポンのトップ画面',
  },
  {
    cmsAsset: 'd24edc1a4067414ebfd123cb59c11b42/iropon-quiz.jpg',
    file: 'quiz.webp', width: 1363, height: 936,
    alt: '青の色見本を見て、4つの色名から答えを選ぶ3級クイズの画面',
  },
  {
    cmsAsset: '245fa6ac64d846f09c405d3bb798934c/iropon-premium-unlocked.jpg',
    file: 'premium-guide.webp', width: 1355, height: 931,
    alt: '無料版とプレミアムで学べる色数と1日の出題上限を比較するいろポンの公開画面',
    oldCaption: 'プレミアム解放後の画面',
    caption: 'プレミアムの料金・学習範囲の案内（公開画面）',
  },
] as const;

// Replace only the three original media URLs in this article. A future CMS
// replacement takes precedence automatically, including for the figure caption.
function refreshIroponScreenshots(content: string): string {
  return content.replace(/<figure\b[^>]*>[\s\S]*?<\/figure>/gi, (figure) => {
    const screenshot = iroponScreenshots.find(item =>
      figure.includes(` src="${iroponScreenshotAssets}${item.cmsAsset}"`),
    );
    if (!screenshot) return figure;

    const oldSource = iroponScreenshotAssets + screenshot.cmsAsset;
    const updated = figure.replace(/<img\b(?:"[^"]*"|'[^']*'|[^'">])*>/gi, (image) => {
      if (!image.includes(` src="${oldSource}"`)) return image;
      const withoutDimensions = image.replace(/\s+(?:alt|width|height|srcset|sizes)\s*=\s*(?:"[^"]*"|'[^']*')/gi, '');
      return withoutDimensions.replace(
        ` src="${oldSource}"`,
        ` src="/img/diary/iropon-release/${screenshot.file}" alt="${screenshot.alt}" width="${screenshot.width}" height="${screenshot.height}"`,
      );
    });
    return 'oldCaption' in screenshot
      ? updated.replace(`>${screenshot.oldCaption}</figcaption>`, `>${screenshot.caption}</figcaption>`)
      : updated;
  });
}
