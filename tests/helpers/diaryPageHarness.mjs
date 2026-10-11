import { readFileSync, existsSync } from 'node:fs';
import { createRequire } from 'node:module';
import path from 'node:path';
import { runInNewContext } from 'node:vm';
import { cloneElement, isValidElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import ts from 'typescript';

const require = createRequire(import.meta.url);
const root = path.resolve('');

// Execute the real diary components; only CMS I/O, CSS Modules and Next routing
// need test adapters. Resolve async server children before React's static render.
export async function resolveServerComponents(node) {
  if (Array.isArray(node)) return Promise.all(node.map((child, index) =>
    resolveServerComponents(isValidElement(child) && child.key === null ? cloneElement(child, { key: `test-${index}` }) : child)));
  if (!isValidElement(node)) return node;
  if (typeof node.type === 'function' && node.type.constructor.name === 'AsyncFunction') {
    return resolveServerComponents(await node.type(node.props));
  }
  return cloneElement(node, {}, await resolveServerComponents(node.props.children));
}

export function createDiaryHarness(cms) {
  const cache = new Map();
  const cssModules = new Map();
  const navigation = [];
  const filenameFor = filename => existsSync(filename + '.ts') ? filename + '.ts'
    : existsSync(filename + '.tsx') ? filename + '.tsx'
      : existsSync(path.join(filename, 'index.ts')) ? path.join(filename, 'index.ts') : path.join(filename, 'index.tsx');
  const load = filename => {
    if (cache.has(filename)) return cache.get(filename);
    const componentModule = { exports: {} };
    cache.set(filename, componentModule.exports);
    const code = ts.transpileModule(readFileSync(filename, 'utf8'), {
      compilerOptions: { target: ts.ScriptTarget.ES2022, jsx: ts.JsxEmit.ReactJSX, module: ts.ModuleKind.CommonJS, esModuleInterop: true },
    }).outputText;
    const localRequire = id => {
      if (id.endsWith('.scss')) return {};
      if (id.endsWith('.module.css')) {
        const file = path.resolve(path.dirname(filename), id);
        const prefix = 'test-' + path.relative(root, file).replace(/[^a-zA-Z0-9_-]/g, '-');
        const classes = new Proxy({}, { get: (_, key) => `${prefix}-${String(key)}` });
        cssModules.set(file, classes);
        return { __esModule: true, default: classes };
      }
      if (id === '@/app/_libs/microcms') return cms;
      if (id === 'next/navigation') return {
        useRouter: () => ({ push: url => navigation.push(url) }),
        notFound: () => { throw new Error('NEXT_NOT_FOUND'); },
        permanentRedirect: url => { throw new Error(`NEXT_REDIRECT:${url}`); },
      };
      if (id.startsWith('@/')) return load(filenameFor(path.join(root, id.slice(2))));
      if (id.startsWith('.')) return load(filenameFor(path.resolve(path.dirname(filename), id)));
      return require(id);
    };
    runInNewContext(code, { module: componentModule, exports: componentModule.exports, require: localRequire, URL });
    return componentModule.exports;
  };
  return {
    load: relativePath => load(path.join(root, relativePath)), cssModules, navigation,
    render: async node => renderToStaticMarkup(await resolveServerComponents(node)),
  };
}
