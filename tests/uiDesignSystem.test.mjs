import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';
import { compile } from 'sass';
import ts from 'typescript';

const css = compile('styles/common/style.scss', { style: 'expanded' }).css;
const animationCss = compile('styles/common/animation.scss', { style: 'expanded' }).css;

test('semantic token regressions must not remove the shared :root color, spacing, radius, and content-width contract', () => {
  for (const declaration of [
    '--brand-accent: #f36b0a;',
    '--brand-strong: #b54708;',
    '--brand-strong-hover: #8f3500;',
    '--text: #282828;',
    '--text-secondary: #666666;',
    '--base: #fcf6f1;',
    '--subtle: #f5ede7;',
    '--surface: #ffffff;',
    '--border: #d8cec7;',
    '--focus: #0066cc;',
    '--error: #b3261e;',
    '--space-4: 4px;',
    '--space-8: 8px;',
    '--space-12: 12px;',
    '--space-16: 16px;',
    '--space-24: 24px;',
    '--space-32: 32px;',
    '--space-48: 48px;',
    '--space-64: 64px;',
    '--space-80: 80px;',
    '--space-96: 96px;',
    '--radius-small: 6px;',
    '--radius-standard: 10px;',
    '--radius-large: 16px;',
    '--content-width: 1120px;',
    '--reading-width: 760px;',
  ]) {
    assert.ok(css.includes(declaration), `missing ${declaration}`);
  }
});

test('foundation regressions must not change the accessible 16px body, blue focus ring, or reduced-motion fallback', () => {
  assert.match(css, /body \{[\s\S]*background-color: #fcf6f1;[\s\S]*color: #282828;[\s\S]*font-size: 16px;[\s\S]*line-height: 1\.8;/);
  assert.match(css, /:where\(a, button, input, textarea, select, summary\):focus-visible \{[\s\S]*outline: 3px solid #0066cc;[\s\S]*outline-offset: 3px;/);
  assert.match(css, /@media \(prefers-reduced-motion: reduce\) \{[\s\S]*scroll-behavior: auto;[\s\S]*animation-duration: 0\.01ms !important;[\s\S]*transition-duration: 0\.01ms !important;[\s\S]*\[class\$=Trigger\][\s\S]*opacity: 1 !important;[\s\S]*transform: none !important;/);
});

test('layout regressions must not change responsive container gutters or section rhythm tokens', () => {
  assert.match(css, /\.inner \{[\s\S]*max-width: calc\(1120px \+ 48px\);[\s\S]*padding-left: 24px;[\s\S]*padding-right: 24px;/);
  assert.match(css, /\.inner-s \{[\s\S]*max-width: calc\(760px \+ 48px\);/);
  assert.match(css, /section:not\(:is\(\.pagetitle, :last-of-type\)\) \{[\s\S]*padding-bottom: 96px;/);
  assert.match(css, /@media \(max-width: 767px\)[\s\S]*\.inner \{[\s\S]*max-width: calc\(1120px \+ 32px\);[\s\S]*padding-left: 16px;[\s\S]*padding-right: 16px;[\s\S]*\.inner-s \{[\s\S]*max-width: calc\(760px \+ 32px\);[\s\S]*section:not\(:is\(\.pagetitle, :last-of-type\)\) \{[\s\S]*padding-bottom: 64px;/);
});

test('navigation path matching distinguishes roots, sections, nested routes, and false prefixes', async () => {
  let source;
  try {
    source = await readFile('lib/navigation.ts', 'utf8');
  } catch {
    assert.fail('lib/navigation.ts must expose the shared navigation path matcher');
  }

  const javascript = ts.transpileModule(source, {
    compilerOptions: {
      module: ts.ModuleKind.ESNext,
      target: ts.ScriptTarget.ES2022,
    },
  }).outputText;
  const moduleUrl = `data:text/javascript;base64,${Buffer.from(javascript).toString('base64')}`;
  const { isCurrentPath } = await import(moduleUrl);

  for (const [pathname, targetPath, expected] of [
    ['/', '/', true],
    ['/about', '/about', true],
    ['/about/', '/about/', true],
    ['/about/team', '/about', true],
    ['/aboutness', '/about', false],
    ['/diary', '/', false],
  ]) {
    assert.equal(isCurrentPath(pathname, targetPath), expected, `${pathname} against ${targetPath}`);
  }
});

test('compiled navigation and shared controls preserve accessible dimensions and visual states', () => {
  assert.match(css, /\.l-header \{[\s\S]*?height: 88px;[\s\S]*?min-height: 88px;/);
  assert.match(css, /@media \(max-width: 1040px\) \{[\s\S]*?\.l-header \{[\s\S]*?height: 64px;[\s\S]*?min-height: 64px;/);
  assert.match(css, /\.l-header__menuBtn-button \{[\s\S]*?min-height: 44px;[\s\S]*?min-width: 44px;/);
  assert.match(css, /\.c-navigation-link\[aria-current=page\] \{[\s\S]*?color: #b54708;[\s\S]*?font-weight: 700;[\s\S]*?text-decoration: underline;[\s\S]*?text-underline-offset: 0\.35em;/);

  assert.match(css, /\.c-button__link \{[\s\S]*?min-width: 280px;[\s\S]*?min-height: 48px;[\s\S]*?border: 1px solid #b54708;[\s\S]*?border-radius: 10px;[\s\S]*?background: #b54708;/);
  assert.match(css, /\.c-button__link:focus-visible[\s\S]*?outline: 3px solid #0066cc;/);
  assert.match(css, /\.c-pagenation \.prev a,[\s\S]*?\.c-pagenation \.next a \{[\s\S]*?min-width: 44px;[\s\S]*?min-height: 44px;/);
  assert.match(css, /\.c-backtotop \{[\s\S]*?min-width: 44px;[\s\S]*?min-height: 44px;/);
});

test('compiled headings and body links preserve the shared type and link hierarchy', () => {
  assert.match(css, /h1 \{[\s\S]*?font-size: clamp\(2rem, 5vw, 3rem\);/);
  assert.match(css, /h2 \{[\s\S]*?font-size: clamp\(1\.75rem, 4vw, 2\.25rem\);/);
  assert.match(css, /h3 \{[\s\S]*?font-size: clamp\(1\.25rem, 3vw, 1\.5rem\);/);
});

test('compiled compact header keeps external blog links white and undecorated', () => {
  assert.match(css, /a:not\(\.c-navigation-link\):not\(\.c-button__link\):not\(\.c-button__link-external\):not\(\.c-link-external\) \{[\s\S]*?color: #b54708;[\s\S]*?text-decoration: underline;/);
  assert.match(css, /@media \(max-width: 1040px\) \{[\s\S]*?\.l-header__blog a \{[\s\S]*?color: #ffffff;[\s\S]*?text-decoration: none;/);
});

test('compiled desktop and compact header navigation links keep 44px target heights', () => {
  const navigationLinkRules = [...css.matchAll(/\.l-header \.l-navigation__item a \{([^}]*)\}/g)].map((match) => match[1]);

  assert.equal(navigationLinkRules.length, 2, 'expected desktop and compact navigation link rules');
  for (const declarations of navigationLinkRules) {
    assert.match(declarations, /min-height: 44px;/);
  }
});

test('scroll reveal has one motion pattern and respects reduced motion', () => {
  const revealTriggers = [...new Set(animationCss.match(/\.[A-Za-z0-9_-]+Trigger\b/g))];

  assert.deepEqual(revealTriggers, ['.fadeUpTrigger']);
  assert.match(animationCss, /\.fadeUpTrigger \{\s*opacity: 0;\s*transform: translateY\(24px\);\s*\}/);
  assert.match(animationCss, /\.fadeUp \{\s*animation: fade-up 320ms ease-out forwards;\s*\}/);
  assert.match(animationCss, /@media \(prefers-reduced-motion: reduce\) \{\s*\.fadeUpTrigger,\s*\.fadeUp \{\s*opacity: 1;\s*transform: none;\s*animation: none;\s*\}/);

  assert.match(css, /\.pagetitle__en,\s*\.pagetitle__ja \{\s*animation: page-title-reveal 300ms ease-out both;[\s\S]*?\}/);
  assert.match(css, /@keyframes page-title-reveal \{\s*from \{\s*opacity: 0;\s*transform: translateY\(16px\);\s*\}\s*to \{\s*opacity: 1;\s*transform: translateY\(0\);\s*\}\s*\}/);
  assert.match(css, /@media \(prefers-reduced-motion: reduce\) \{[\s\S]*?\.pagetitle__en,\s*\.pagetitle__ja \{\s*animation: none;\s*opacity: 1;\s*transform: none;\s*\}/);
});
