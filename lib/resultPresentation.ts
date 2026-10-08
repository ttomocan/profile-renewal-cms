import type { ResultItem } from '@/types/results';

export function groupProjectTechnologies(value?: string): { technologies: string[]; tools: string[] } {
  const tools = new Set(['vscode', 'visual studio code', 'photoshop', 'illustrator', 'figma', 'xd', 'canva', 'cursor']);
  const grouped: { technologies: string[]; tools: string[] } = { technologies: [], tools: [] };
  for (const item of (value ?? '').split(',').map(item => item.trim()).filter(item => item && item !== '未分類')) {
    const group = tools.has(item.toLowerCase().replace(/^vs code$/, 'vscode')) ? grouped.tools : grouped.technologies;
    if (!group.includes(item)) group.push(item);
  }
  return grouped;
}

export function selectFeaturedResults(results: ResultItem[]): ResultItem[] {
  // 代表枠の選定だけを行い、本文・担当タグ・一覧データは変更しない。
  const ids = ['corporate-handball-team-01', 'risk-management-corporate-01', 'social-entrepreneurship-program-01', 'career-media-01'];
  const selected = ids.flatMap(id => {
    const item = results.find(result => result.id === id);
    return item ? [item] : [];
  });
  return selected.length > 0 ? selected : results.slice(0, 6);
}
