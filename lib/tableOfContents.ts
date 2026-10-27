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

  return value.replace(/&(#x?[0-9a-f]+|[a-z]+);/gi, (_, entity: string) => {
    if (entity.startsWith('#x')) return String.fromCodePoint(Number.parseInt(entity.slice(2), 16));
    if (entity.startsWith('#')) return String.fromCodePoint(Number.parseInt(entity.slice(1), 10));
    return namedEntities[entity.toLowerCase()] ?? `&${entity};`;
  });
}

const idAttribute = /\s+id\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s"'=<>`]+))/i;
const tabIndexAttribute = /\s+tabindex\s*=\s*(?:"[^"]*"|'[^']*'|[^\s"'=<>`]+)/gi;

function getExistingId(attributes: string) {
  const match = attributes.match(idAttribute);
  return match ? decodeHtmlEntities(match[1] ?? match[2] ?? match[3]) : undefined;
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
  // 後方の見出しや本文要素のIDも予約し、既存のアンカーを生成IDで奪わない。
  const usedIds = new Set(Array.from(normalizedHeadings.matchAll(/<[a-z][^>]*>/gi), ([tag]) => getExistingId(tag)).filter(Boolean));

  const contentWithIds = normalizedHeadings.replace(/<h([23])([^>]*)>([\s\S]*?)<\/h\1>/gi, (match, levelText: string, attributes: string, innerHtml: string) => {
    const title = decodeHtmlEntities(innerHtml.replace(/<[^>]+>/g, '')).replace(/\s+/g, ' ').trim();
    if (!title) return match;

    const level = Number(levelText) as 2 | 3;
    const existingId = getExistingId(attributes);
    let id = existingId;
    if (!id) {
      let number = items.length + 1;
      do { id = `section-${number++}`; } while (usedIds.has(id));
      usedIds.add(id);
    }
    const cleanAttributes = attributes.replace(tabIndexAttribute, '');
    const attributesWithId = existingId ? cleanAttributes : `${cleanAttributes.replace(idAttribute, '')} id="${id}"`;
    items.push({ id, title, level });

    return `<h${level}${attributesWithId} tabindex="-1">${innerHtml}</h${level}>`;
  });

  return { content: contentWithIds, items };
}
