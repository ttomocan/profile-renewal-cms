'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useCallback } from 'react';
import type { WorkType, ProjectType, Role } from '@/types/results';
import { sortOptions } from '@/types/results';
import { updateSearchParams } from '@/lib/parse';

interface FiltersProps {
  workTypes: WorkType[];
  projectTypes: ProjectType[];
  roles: Role[];
}

export default function Filters({ workTypes, projectTypes, roles }: FiltersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  // フィルタの値を更新する共通関数
  const updateFilter = useCallback(
    (key: string, value: string | null) => {
      const newParams = updateSearchParams(new URLSearchParams(searchParams.toString()), {
        [key]: value,
        page: null, // フィルタ変更時はページをリセット
      });

      const newUrl = `/results?${newParams.toString()}`;
      router.push(newUrl);
    },
    [router, searchParams]
  );

  // 複数のフィルタを同時に更新
  const updateMultipleFilters = useCallback(
    (updates: Record<string, string | null>) => {
      const newParams = updateSearchParams(new URLSearchParams(searchParams.toString()), {
        ...updates,
        page: null, // フィルタ変更時はページをリセット
      });

      const newUrl = `/results?${newParams.toString()}`;
      router.push(newUrl);
    },
    [router, searchParams]
  );

  // リセット処理
  const resetFilters = useCallback(() => {
    router.push('/results');
  }, [router]);

  const currentWorkType = searchParams.get('workType');
  const currentProjectType = searchParams.get('result-project-type');
  const currentRole = searchParams.get('result-role');
  const currentQ = searchParams.get('q') || '';
  const currentSort = searchParams.get('sort') || 'new';

  return (
    <div className="results-filters">
      <h2 className="results-filters__title">実績を絞り込む</h2>

      <div className="results-filters__grid">
        {/* 案件区分 */}
        <div className="results-filters__field">
          <label htmlFor="workType" className="results-filters__label">
            💼 案件区分
          </label>
          <select id="workType" value={currentWorkType || ''} onChange={(e) => updateFilter('workType', e.target.value || null)} className="results-filters__select">
            <option value="">すべて</option>
            {workTypes.map((workType) => (
              <option key={workType.id} value={workType.id}>
                {workType.name}
              </option>
            ))}
          </select>
        </div>

        {/* プロジェクトタイプ */}
        <div className="results-filters__field">
          <label htmlFor="result-project-type" className="results-filters__label">
            📁 案件種別
          </label>
          <select id="result-project-type" value={currentProjectType || ''} onChange={(e) => updateFilter('result-project-type', e.target.value || null)} className="results-filters__select">
            <option value="">すべて</option>
            {projectTypes.map((projectType) => (
              <option key={projectType.id} value={projectType.id}>
                {projectType.name}
              </option>
            ))}
          </select>
        </div>

        {/* 役割 */}
        <div className="results-filters__field">
          <label htmlFor="result-role" className="results-filters__label">
            🎯 担当範囲
          </label>
          <select id="result-role" value={currentRole || ''} onChange={(e) => updateFilter('result-role', e.target.value || null)} className="results-filters__select">
            <option value="">すべて</option>
            {roles.map((role) => (
              <option key={role.id} value={role.id}>
                {role.name}
              </option>
            ))}
          </select>
        </div>

        {/* ソート */}
        <div className="results-filters__field">
          <label htmlFor="sort" className="results-filters__label">
            📊 並び順
          </label>
          <select id="sort" value={currentSort} onChange={(e) => updateFilter('sort', e.target.value)} className="results-filters__select">
            {sortOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        {/* フリーワード検索 */}
        <div className="results-filters__field">
          <label htmlFor="search" className="results-filters__label">
            🔍 フリーワード
          </label>
          <input id="search" type="text" value={currentQ} onChange={(e) => updateFilter('q', e.target.value || null)} placeholder="タイトルで検索" className="results-filters__input" />
        </div>
      </div>

      {/* リセットボタン */}
      <div className="results-filters__reset">
        <button onClick={resetFilters}>フィルタをリセット</button>
      </div>

      {/* 現在のフィルタ状況 */}
      {(currentWorkType || currentProjectType || currentRole || currentQ || currentSort !== 'new') && (
        <div className="results-filters__active">
          <p className="results-filters__active-title">現在のフィルタ:</p>
          <div className="results-filters__active-tags">
            {currentWorkType && (
              <span className="results-filters__active-tag results-filters__active-tag--work-type">
                案件区分: {workTypes.find((w) => w.id === currentWorkType)?.name}
                <button onClick={() => updateFilter('workType', null)} aria-label="案件区分フィルタを削除">
                  ×
                </button>
              </span>
            )}
            {currentProjectType && (
              <span className="results-filters__active-tag results-filters__active-tag--project-type">
                案件種別: {projectTypes.find((p) => p.id === currentProjectType)?.name}
                <button onClick={() => updateFilter('result-project-type', null)} aria-label="案件種別フィルタを削除">
                  ×
                </button>
              </span>
            )}
            {currentRole && (
              <span className="results-filters__active-tag results-filters__active-tag--role">
                担当範囲: {roles.find((r) => r.id === currentRole)?.name}
                <button onClick={() => updateFilter('result-role', null)} aria-label="担当範囲フィルタを削除">
                  ×
                </button>
              </span>
            )}
            {currentQ && (
              <span className="results-filters__active-tag results-filters__active-tag--search">
                検索: {currentQ}
                <button onClick={() => updateFilter('q', null)} aria-label="検索フィルタを削除">
                  ×
                </button>
              </span>
            )}
            {currentSort !== 'new' && (
              <span className="results-filters__active-tag results-filters__active-tag--sort">
                並び順: {sortOptions.find((s) => s.value === currentSort)?.label}
                <button onClick={() => updateFilter('sort', 'new')} aria-label="並び順フィルタを削除">
                  ×
                </button>
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
