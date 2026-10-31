import type { ResultItem } from '@/types/results';
import { compareContentNewest } from '@/lib/contentOrder';

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
  const selected: ResultItem[] = [];
  const seen = new Set<string>();
  for (const item of [...results].sort(compareContentNewest)) {
    if (!seen.has(item.id)) {
      selected.push(item);
      seen.add(item.id);
    }
  }
  return selected.slice(0, 6);
}
