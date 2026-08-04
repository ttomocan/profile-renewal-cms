export type TableOfContentsItem = {
  id: string;
  title: string;
  level: 2 | 3;
};

function decodeHtmlEntities(value: string) {
  const namedEntities: Record<string, string> = {
    amp: '&',
    apos: "'",
    gt: '>',
    lt: '<',
    nbsp: ' ',
    quot: '"',
  };

  return value
    .replace(/<[^>]+>/g, '')
    .replace(/&(#x?[0-9a-f]+|[a-z]+);/gi, (_, entity: string) => {
      if (entity.startsWith('#x')) return String.fromCodePoint(Number.parseInt(entity.slice(2), 16));
      if (entity.startsWith('#')) return String.fromCodePoint(Number.parseInt(entity.slice(1), 10));
      return namedEntities[entity.toLowerCase()] ?? `&${entity};`;
    })
    .replace(/\s+/g, ' ')
    .trim();
}

export function addHeadingIds(content: string): { content: string; items: TableOfContentsItem[] } {
  const items: TableOfContentsItem[] = [];
  const normalizedImages = content.replace(/<img\b([^>]*)>/gi, (tag, attributes: string) => {
    const altMatch = attributes.match(/\salt=(['"])(.*?)\1/i);
    if (!altMatch) return `<img${attributes} alt="">`;

    const alt = altMatch[2].trim();
    const isUnhelpful = /^(image|画像|img[_-]?\d*|[^/\\]+\.(?:jpe?g|png|webp|gif|svg))$/i.test(alt);
    return isUnhelpful ? tag.replace(altMatch[0], ' alt=""') : tag;
  });
  const normalizedHeadings = normalizedImages.replace(/<h1\b([^>]*)>/gi, '<h2$1>').replace(/<\/h1>/gi, '</h2>');

  const contentWithIds = normalizedHeadings.replace(/<h([23])([^>]*)>([\s\S]*?)<\/h\1>/gi, (match, levelText: string, attributes: string, innerHtml: string) => {
    const title = decodeHtmlEntities(innerHtml);
    if (!title) return match;

    const level = Number(levelText) as 2 | 3;
    const id = `section-${items.length + 1}`;
    const cleanAttributes = attributes.replace(/\s+id=(['"]).*?\1/i, '');
    items.push({ id, title, level });

    return `<h${level}${cleanAttributes} id="${id}">${innerHtml}</h${level}>`;
  });

  return { content: contentWithIds, items };
}
