export const NEWEST_CONTENT_ORDER = '-publishedAt,-createdAt,system:default';

type DatedContent = {
  id: string;
  publishedAt?: string | null;
  createdAt?: string | null;
};

function timestamp(value?: string | null): number {
  const parsed = value ? Date.parse(value) : NaN;
  return Number.isFinite(parsed) ? parsed : Number.NEGATIVE_INFINITY;
}

export function compareContentNewest(a: DatedContent, b: DatedContent): number {
  // 更新日では順位を変えず、公開日がない旧データだけ作成日で補う。
  const aPublished = timestamp(a.publishedAt);
  const bPublished = timestamp(b.publishedAt);
  const aDate = Number.isFinite(aPublished) ? aPublished : timestamp(a.createdAt);
  const bDate = Number.isFinite(bPublished) ? bPublished : timestamp(b.createdAt);
  if (aDate !== bDate) return aDate > bDate ? -1 : 1;
  const aCreated = timestamp(a.createdAt);
  const bCreated = timestamp(b.createdAt);
  if (aCreated !== bCreated) return aCreated > bCreated ? -1 : 1;
  return a.id < b.id ? -1 : a.id > b.id ? 1 : 0;
}
