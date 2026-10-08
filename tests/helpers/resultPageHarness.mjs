import { readFileSync, existsSync } from 'node:fs';
import { createRequire } from 'node:module';
import path from 'node:path';
import { runInNewContext } from 'node:vm';
import ts from 'typescript';
const require = createRequire(import.meta.url);
const root = path.resolve('');
export function loadPage(relativePath, cms) {
  const cache = new Map();
  const load = filename => {
    if (cache.has(filename)) return cache.get(filename);
    const componentModule = { exports: {} };
    cache.set(filename, componentModule.exports);
    const code = ts.transpileModule(readFileSync(filename, 'utf8'), {
      compilerOptions: { jsx: ts.JsxEmit.ReactJSX, module: ts.ModuleKind.CommonJS, esModuleInterop: true },
    }).outputText;
    const localRequire = id => {
      if (id.endsWith('.scss')) return {};
      if (id === '@/app/_libs/microcms') return cms;
      // このテストでは実績本文とメタ情報を確認し、共通ナビゲーションは対象外。
      if (id.startsWith('@/app/_components/')) return () => null;
      if (id.startsWith('@/')) {
        const relative = path.join(root, id.slice(2));
        return load(existsSync(relative + '.ts') ? relative + '.ts' : existsSync(relative + '.tsx') ? relative + '.tsx' : path.join(relative, 'index.ts'));
      }
      if (id.startsWith('.')) {
        const relative = path.resolve(path.dirname(filename), id);
        return load(existsSync(relative + '.ts') ? relative + '.ts' : existsSync(relative + '.tsx') ? relative + '.tsx' : path.join(relative, 'index.ts'));
      }
      return require(id);
    };
    runInNewContext(code, { module: componentModule, exports: componentModule.exports, require: localRequire, URL });
    return componentModule.exports;
  };
  return load(path.join(root, relativePath));
}


export function loadDetail(result) {
  return loadPage('app/result/[id]/page.tsx', {
    getResultDetail: async () => result,
    getResults: async () => ({ contents: [], totalCount: 0, offset: 0, limit: 24 }),
    getBlogList: async () => ({ contents: [] }),
  });
}
