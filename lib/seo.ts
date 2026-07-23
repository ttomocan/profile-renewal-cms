export function createMetaDescription(value: string | undefined, maxLength = 150): string {
  const normalized = (value ?? '')
    .replace(/<[^>]*>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

  if (normalized.length <= maxLength) return normalized;

  const candidate = normalized.slice(0, maxLength);
  const sentenceEnd = Math.max(candidate.lastIndexOf('。'), candidate.lastIndexOf('！'), candidate.lastIndexOf('？'));

  // 詳細ページの概要は、文字数を優先して文の途中で切るよりも、
  // 最初の一文だけでも自然に読み切れる形を優先する。
  if (sentenceEnd >= Math.min(30, Math.floor(maxLength * 0.25))) {
    return candidate.slice(0, sentenceEnd + 1);
  }

  return `${candidate.replace(/[、,\s]+$/, '')}…`;
}
