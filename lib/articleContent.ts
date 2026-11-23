import type { Blog } from '@/app/_libs/microcms';

const articleId = 'buffet-life-parenting-1yearhalf';
const originalSource = 'https://images.microcms-assets.io/assets/764831a5a2c84d3c982ee2d40033122f/7114714a07d34bcf847a410e771b45f9/img_buffet-life-parenting-1yearhalf.jpeg?w=500&amp;h=272';

// CMS media-upload permission is unavailable. This narrow presentation override
// retires automatically once the editor replaces the original image in the CMS.
export function getArticleContent(data: Pick<Blog, 'id' | 'content'>): string {
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
