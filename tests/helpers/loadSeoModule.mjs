import { readFileSync, existsSync } from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';
import { runInNewContext } from 'node:vm';
import ts from 'typescript';

const require = createRequire(import.meta.url);

// 本体コードを実行し、外部サービスとフレームワーク境界だけを差し替える。
export function loadSeoModule(relativePath, overrides = {}, globals = {}) {
  const root = process.cwd();
  const cache = new Map();
  const load = filename => {
    if (cache.has(filename)) return cache.get(filename).exports;
    const loaded = { exports: {} };
    cache.set(filename, loaded);
    const { outputText, diagnostics } = ts.transpileModule(readFileSync(filename, 'utf8'), {
      compilerOptions: { target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.CommonJS, jsx: ts.JsxEmit.ReactJSX, esModuleInterop: true },
      reportDiagnostics: true,
      fileName: filename,
    });
    const errors = diagnostics?.filter(item => item.category === ts.DiagnosticCategory.Error) ?? [];
    if (errors.length) throw new Error(ts.formatDiagnosticsWithColorAndContext(errors, {
      getCanonicalFileName: name => name,
      getCurrentDirectory: () => root,
      getNewLine: () => '\n',
    }));
    const localRequire = id => {
      if (Object.hasOwn(overrides, id)) return overrides[id];
      if (id.endsWith('.css') || id.endsWith('.scss')) return {};
      if (id.startsWith('@/') || id.startsWith('.')) {
        const base = id.startsWith('@/') ? path.join(root, id.slice(2)) : path.resolve(path.dirname(filename), id);
        const resolved = [base + '.ts', base + '.tsx', path.join(base, 'index.ts'), path.join(base, 'index.tsx')].find(existsSync);
        if (!resolved) throw new Error(`テスト対象モジュールが見つかりません: ${id}`);
        return load(resolved);
      }
      return require(id);
    };
    runInNewContext(outputText, { module: loaded, exports: loaded.exports, require: localRequire, URL, console, ...globals });
    return loaded.exports;
  };
  return load(path.join(root, relativePath));
}
