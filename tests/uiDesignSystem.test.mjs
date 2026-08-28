import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';
import postcss from 'postcss';
import { compile } from 'sass';
import ts from 'typescript';

const css = compile('styles/common/style.scss', { style: 'expanded' }).css;
const animationCss = compile('styles/common/animation.scss', { style: 'expanded' }).css;
const topCss = compile('styles/pages/top.scss', { style: 'expanded' }).css;
const aboutCss = compile('styles/pages/about.scss', { style: 'expanded' }).css;
const skillCss = compile('styles/pages/skill.scss', { style: 'expanded' }).css;
const resultCss = compile('styles/pages/result.scss', { style: 'expanded' }).css;

function hoverTranslateDistances(pageCss) {
  return [...pageCss.matchAll(/[^{}]*:hover[^{}]*\{([^{}]*)\}/g)]
    .flatMap(([, declarations]) => [...declarations.matchAll(/translateY\(-?(\d+)px\)/g)])
    .map(([, distance]) => Number(distance));
}

async function parseCssModule(path) {
  return postcss.parse(await readFile(path, 'utf8'), { from: path });
}

function declarationsFor(root, selector) {
  const declarations = new Map();

  root.walkRules((rule) => {
    if (rule.selectors.includes(selector)) {
      rule.walkDecls((declaration) => declarations.set(declaration.prop, declaration.value));
    }
  });

  return declarations;
}

function jsxAttribute(openingElement, name) {
  return openingElement.attributes.properties.find(
    (property) => ts.isJsxAttribute(property) && property.name.text === name,
  );
}

function stringAttribute(openingElement, name) {
  const attribute = jsxAttribute(openingElement, name);
  if (!attribute?.initializer || !ts.isStringLiteral(attribute.initializer)) return undefined;
  return attribute.initializer.text;
}

function jsxExpressionAttribute(openingElement, name) {
  const attribute = jsxAttribute(openingElement, name);
  if (!attribute?.initializer || !ts.isJsxExpression(attribute.initializer)) return undefined;
  return attribute.initializer.expression;
}

function openingElements(sourceFile) {
  const elements = [];
  const visit = (node) => {
    if (ts.isJsxOpeningElement(node) || ts.isJsxSelfClosingElement(node)) elements.push(node);
    ts.forEachChild(node, visit);
  };
  visit(sourceFile);
  return elements;
}

function isDescriptionForField(expression, field) {
  return ts.isCallExpression(expression)
    && ts.isIdentifier(expression.expression)
    && expression.expression.text === 'getErrorDescription'
    && expression.arguments.length === 1
    && ts.isStringLiteral(expression.arguments[0])
    && expression.arguments[0].text === field;
}

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

test('top about and skill pages use shared spacing and surface tokens', () => {
  assert.match(topCss, /\.p-top-facts,[\s\S]*?\.p-top-contact \{\s*padding-block: 96px;/);
  assert.match(topCss, /@media \(max-width: 767px\) \{[\s\S]*?\.p-top-facts,[\s\S]*?\.p-top-contact \{\s*padding-block: 64px;/);
  assert.match(topCss, /\.p-top-hero__text-content \{[\s\S]*?max-width: 760px;[\s\S]*?color: #666666;[\s\S]*?font-size: 1rem;[\s\S]*?line-height: 1\.8;/);
  assert.match(topCss, /\.p-top-hero__actions \{[\s\S]*?gap: 16px;[\s\S]*?margin-top: 32px;/);
  assert.match(topCss, /\.p-top-facts__item \{[\s\S]*?background: #ffffff;[\s\S]*?border: 1px solid #d8cec7;[\s\S]*?border-radius: 10px;[\s\S]*?box-shadow: none;/);
  assert.match(topCss, /\.p-top-results \.result-card \{[\s\S]*?background: #ffffff;[\s\S]*?border: 1px solid #d8cec7;[\s\S]*?border-radius: 10px;[\s\S]*?box-shadow: none;/);
  assert.match(topCss, /\.p-top-diary \.diary-card \{[\s\S]*?background: #ffffff;[\s\S]*?border: 1px solid #d8cec7;[\s\S]*?border-radius: 10px;[\s\S]*?box-shadow: none;/);

  assert.match(aboutCss, /\.about \.about-section-copy \{[\s\S]*?max-width: 760px;[\s\S]*?margin-inline: auto;[\s\S]*?gap: 24px;/);
  assert.match(aboutCss, /\.about \.about-facts__item \{[\s\S]*?background: #ffffff;[\s\S]*?border: 1px solid #d8cec7;[\s\S]*?border-radius: 10px;[\s\S]*?box-shadow: none;/);
  assert.match(aboutCss, /\.about \.about-cards li \{[\s\S]*?background: #ffffff;[\s\S]*?border: 1px solid #d8cec7;[\s\S]*?border-radius: 10px;[\s\S]*?box-shadow: none;/);

  assert.match(skillCss, /\.skill \.programming__item,[\s\S]*?\.skill \.ai-tool__item \{[\s\S]*?padding: 24px;[\s\S]*?border: 1px solid #d8cec7;[\s\S]*?border-radius: 10px;[\s\S]*?background: #ffffff;[\s\S]*?box-shadow: none;/);
  assert.match(skillCss, /\.skill \.skill-cards \{[\s\S]*?gap: 24px;[\s\S]*?grid-template-columns: repeat\(2, minmax\(0, 1fr\)\);/);
  assert.match(skillCss, /@media \(max-width: 767px\) \{[\s\S]*?\.skill \.skill-cards \{\s*grid-template-columns: 1fr;/);

  for (const [page, pageCss] of [
    ['top', topCss],
    ['about', aboutCss],
    ['skill', skillCss],
  ]) {
    assert.ok(hoverTranslateDistances(pageCss).every((distance) => distance <= 2), `${page} hover movement must not exceed 2px`);
  }
});

test('result cards and pagination expose restrained surfaces and 44px targets', () => {
  assert.match(resultCss, /\.result-card \{[\s\S]*?background: #ffffff;[\s\S]*?border: 1px solid #d8cec7;[\s\S]*?border-radius: 10px;[\s\S]*?box-shadow: 0 2px 8px rgba\(40, 40, 40, 0\.08\);/);
  assert.match(resultCss, /\.result-card:hover \{[\s\S]*?transform: translateY\(-2px\);[\s\S]*?box-shadow: 0 4px 12px rgba\(40, 40, 40, 0\.1\);/);
  assert.match(resultCss, /\.result-card__link:focus-visible \{[\s\S]*?outline: 3px solid #0066cc;[\s\S]*?outline-offset: -3px;/);
  assert.match(resultCss, /\.result-card__content \{[\s\S]*?display: grid;[\s\S]*?gap: 16px;[\s\S]*?padding: 24px;/);
  assert.match(resultCss, /\.result-card__action-icon \{[\s\S]*?width: 30px;[\s\S]*?height: 30px;[\s\S]*?background: #ffffff;[\s\S]*?color: #b54708;/);
  assert.match(resultCss, /\.result-card__work-type\.work-type-work-type-main,[\s\S]*?\.result-card__work-type\.work-type-main \{\s*background: #b54708;/);
  assert.match(resultCss, /\.result-card__work-type\.work-type-work-type-side,[\s\S]*?\.result-card__work-type\.work-type-side \{\s*background: #047857;/);
  assert.match(resultCss, /\.result-card__work-type\.work-type-work-type-freelance,[\s\S]*?\.result-card__work-type\.work-type-freelance \{\s*background: #b91c1c;/);
  assert.match(resultCss, /\.result-card__work-type\.work-type-personal \{\s*background: #6d28d9;/);
  assert.match(resultCss, /\.result-card__work-type\.work-type-未分類 \{\s*background: #4b5563;/u);

  for (const [, declarations] of resultCss.matchAll(/\.result-card__work-type[^{}]*\{([^{}]*)\}/g)) {
    assert.doesNotMatch(declarations, /linear-gradient/);
  }

  assert.match(resultCss, /\.results-pagination__item \{[\s\S]*?min-width: 44px;[\s\S]*?min-height: 44px;/);
  assert.match(resultCss, /\.results-pagination__item--current \{[\s\S]*?border: 1px solid #b54708;[\s\S]*?color: #b54708;[\s\S]*?font-weight: 700;[\s\S]*?text-decoration: underline;/);

  assert.match(resultCss, /\.result-detail__section \{[\s\S]*?max-width: 760px;[\s\S]*?margin-inline: auto;[\s\S]*?font-size: 17px;[\s\S]*?line-height: 1\.9;/);
  assert.match(resultCss, /\.result-detail > \.result-detail__section:first-of-type \.result-detail__section-content--summary \{[\s\S]*?background: #f5ede7;[\s\S]*?border-left: 4px solid #b54708;/);
  assert.doesNotMatch(resultCss, /[🕒📝]/u);
  assert.doesNotMatch(resultCss, /result-card__overlay/);
  assert.doesNotMatch(resultCss, /\.result-card:hover \.result-card__image-img/);
  assert.ok(hoverTranslateDistances(resultCss).every((distance) => distance <= 2), 'result interactions must not move more than 2px');
});

test('diary uses readable article width and accessible discovery controls', async () => {
  const [article, cards, pagination, search, categoryFilter, category, breadcrumb, skeleton, diaryGlobals] = await Promise.all([
    parseCssModule('app/_components/Article/index.module.css'),
    parseCssModule('app/_components/DiaryList/index.module.css'),
    parseCssModule('app/_components/Pagination/index.module.css'),
    parseCssModule('app/_components/SearchField/index.module.css'),
    parseCssModule('app/_components/CategoryFilter/index.module.css'),
    parseCssModule('app/_components/Category/index.module.css'),
    parseCssModule('app/_components/Breadcrumb/index.module.css'),
    parseCssModule('app/_components/DiaryListSkeleton/index.module.css'),
    parseCssModule('app/diary/globals.css'),
  ]);

  const articleShell = declarationsFor(article, '.article');
  const articleContent = declarationsFor(article, '.content');
  assert.equal(articleShell.get('max-width'), 'var(--reading-width)');
  assert.equal(articleContent.get('font-size'), '17px');
  assert.equal(articleContent.get('line-height'), '1.9');
  assert.equal(articleContent.get('color'), 'var(--text)');

  const articleLink = declarationsFor(article, '.content a');
  assert.equal(articleLink.get('color'), 'var(--brand-strong)');
  assert.equal(articleLink.get('text-decoration'), 'underline');

  const articleHeading = declarationsFor(article, '.content > h2');
  assert.equal(articleHeading.get('border-bottom'), '2px solid var(--brand-strong)');
  assert.equal(articleHeading.get('background'), 'transparent');
  assert.equal(articleHeading.get('border-radius'), '0');
  assert.equal(declarationsFor(article, '.content > h3').get('border-left'), '3px solid var(--brand-strong)');

  const articleQuote = declarationsFor(article, '.content > blockquote');
  assert.equal(articleQuote.get('background'), 'var(--subtle)');
  assert.equal(articleQuote.get('border-left'), '4px solid var(--brand-strong)');
  assert.equal(declarationsFor(article, '.content > figure > figcaption').get('color'), 'var(--text-secondary)');
  assert.equal(declarationsFor(article, '.content > table th').get('background'), 'var(--subtle)');

  const card = declarationsFor(cards, '.list');
  assert.equal(card.get('background'), 'var(--surface)');
  assert.equal(card.get('border'), '1px solid var(--border)');
  assert.equal(card.get('border-radius'), 'var(--radius-standard)');
  assert.equal(card.get('box-shadow'), 'none');

  const cardHover = declarationsFor(cards, '.list:hover');
  assert.equal(cardHover.get('transform'), 'translateY(-2px)');
  assert.doesNotMatch(cardHover.get('background') ?? '', /gradient/);
  assert.equal(declarationsFor(cards, '.link:focus-visible').get('outline'), '3px solid var(--focus)');

  const paginationItem = declarationsFor(pagination, '.item');
  assert.equal(declarationsFor(pagination, '.list').get('list-style'), 'none');
  assert.equal(paginationItem.get('min-width'), '44px');
  assert.equal(paginationItem.get('min-height'), '44px');
  assert.equal(declarationsFor(pagination, '.item:focus-visible').get('outline'), '3px solid var(--focus)');
  pagination.walkRules('.item', (rule) => {
    if (rule.selector !== '.item') return;
    rule.walkDecls(/^(?:min-)?(?:width|height)$/, (declaration) => {
      const pixels = Number.parseFloat(declaration.value);
      assert.ok(!Number.isFinite(pixels) || pixels >= 44, `${declaration.prop} must stay at least 44px in every breakpoint`);
    });
  });

  for (const selector of ['.searchInput', '.submitButton']) {
    const control = declarationsFor(search, selector);
    assert.equal(control.get('min-height'), '48px');
    assert.equal(control.get('border'), '1px solid var(--border)');
    assert.equal(control.get('border-radius'), 'var(--radius-standard)');
  }
  assert.equal(declarationsFor(search, '.submitButton').get('background'), 'var(--brand-strong)');
  assert.equal(declarationsFor(search, '.submitButton:hover').get('background'), 'var(--brand-strong-hover)');
  assert.equal(declarationsFor(search, '.searchInput:focus-visible').get('outline'), '3px solid var(--focus)');

  const select = declarationsFor(categoryFilter, '.select');
  assert.equal(select.get('min-height'), '48px');
  assert.equal(select.get('border'), '1px solid var(--border)');
  assert.equal(declarationsFor(categoryFilter, '.select:focus-visible').get('outline'), '3px solid var(--focus)');

  const categoryTag = declarationsFor(category, '.tag');
  assert.equal(categoryTag.get('border'), '1px solid var(--border)');
  assert.equal(categoryTag.get('color'), 'var(--brand-strong)');
  assert.equal(categoryTag.get('background'), 'var(--subtle)');

  assert.equal(declarationsFor(breadcrumb, '.list').get('overflow-x'), 'auto');
  assert.equal(declarationsFor(breadcrumb, '.link:focus-visible').get('outline'), '3px solid var(--focus)');
  breadcrumb.walkDecls(/^animation(?:-delay)?$/, (declaration) => {
    assert.fail(`breadcrumb entrance choreography must be removed: ${declaration.toString()}`);
  });

  let reducedMotionStopsPulse = false;
  skeleton.walkAtRules('media', (media) => {
    if (!media.params.includes('prefers-reduced-motion: reduce')) return;
    media.walkDecls('animation', (declaration) => {
      if (declaration.value === 'none') reducedMotionStopsPulse = true;
    });
  });
  assert.ok(reducedMotionStopsPulse, 'skeleton pulse must stop under reduced motion');

  const skeletonItem = declarationsFor(skeleton, '.item');
  assert.equal(skeletonItem.get('background'), 'var(--surface)');
  assert.equal(skeletonItem.get('border'), '1px solid var(--border)');
  assert.equal(skeletonItem.get('border-radius'), 'var(--radius-standard)');

  const largeDiaryText = declarationsFor(diaryGlobals, '.diary p > span.text-large');
  assert.equal(largeDiaryText.get('font-size'), '1.4rem');
  assert.equal(largeDiaryText.get('font-weight'), '700');
});

test('contact errors describe only their active field while form and 404 states keep the shared accessible contract', async () => {
  const [formSourceText, notFoundSourceText, notFoundCss] = await Promise.all([
    readFile('app/_components/ContactForm/index.tsx', 'utf8'),
    readFile('app/not-found.tsx', 'utf8'),
    parseCssModule('app/not-found.module.css'),
  ]);
  const formSource = ts.createSourceFile('ContactForm.tsx', formSourceText, ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX);
  const notFoundSource = ts.createSourceFile('not-found.tsx', notFoundSourceText, ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX);
  const formElements = openingElements(formSource);

  const contactImport = formSource.statements.find(
    (statement) => ts.isImportDeclaration(statement)
      && ts.isStringLiteral(statement.moduleSpecifier)
      && statement.moduleSpecifier.text === '@/app/_actions/contact',
  );
  assert.ok(contactImport && ts.isImportDeclaration(contactImport));
  const contactImports = contactImport.importClause?.namedBindings;
  assert.ok(contactImports && ts.isNamedImports(contactImports));
  assert.ok(contactImports.elements.some((element) => element.name.text === 'ContactField' && element.isTypeOnly));

  let descriptionHelper;
  const visitForm = (node) => {
    if (
      ts.isVariableDeclaration(node)
      && ts.isIdentifier(node.name)
      && node.name.text === 'getErrorDescription'
    ) {
      descriptionHelper = node;
    }
    ts.forEachChild(node, visitForm);
  };
  visitForm(formSource);
  assert.ok(descriptionHelper && ts.isVariableDeclaration(descriptionHelper));
  assert.ok(descriptionHelper.initializer && ts.isArrowFunction(descriptionHelper.initializer));
  const helper = descriptionHelper.initializer;
  assert.equal(helper.parameters.length, 1);
  assert.ok(helper.parameters[0].type && ts.isTypeReferenceNode(helper.parameters[0].type));
  assert.equal(helper.parameters[0].type.typeName.getText(formSource), 'ContactField');
  assert.ok(ts.isConditionalExpression(helper.body));
  assert.ok(ts.isCallExpression(helper.body.condition));
  assert.equal(helper.body.condition.expression.getText(formSource), 'hasFieldError');
  assert.equal(helper.body.whenTrue.getText(formSource), "'contact-error'");
  assert.equal(helper.body.whenFalse.getText(formSource), 'undefined');

  for (const field of ['namae', 'furigana', 'email', 'message']) {
    const control = formElements.find(
      (element) => stringAttribute(element, 'name') === field,
    );
    assert.ok(control, `expected ${field} control`);
    assert.ok(isDescriptionForField(jsxExpressionAttribute(control, 'aria-describedby'), field));
  }
  const itemFieldset = formElements.find(
    (element) => element.tagName.getText(formSource) === 'fieldset',
  );
  assert.ok(itemFieldset, 'expected item fieldset');
  assert.ok(isDescriptionForField(jsxExpressionAttribute(itemFieldset, 'aria-describedby'), 'item'));

  const errorAlerts = formElements.filter(
    (element) => stringAttribute(element, 'id') === 'contact-error',
  );
  assert.equal(errorAlerts.length, 1, 'only the live validation summary may use contact-error');
  assert.equal(stringAttribute(errorAlerts[0], 'role'), 'alert');

  let retainsAction = false;
  let retainsAnalyticsGuard = false;
  const visitBehavior = (node) => {
    if (
      ts.isCallExpression(node)
      && node.expression.getText(formSource) === 'useActionState'
      && node.arguments[0]?.getText(formSource) === 'createContactData'
    ) {
      retainsAction = true;
    }
    if (
      ts.isIfStatement(node)
      && node.expression.getText(formSource).includes('Array.isArray')
      && node.thenStatement.getText(formSource).includes('sendGAEvent')
    ) {
      retainsAnalyticsGuard = true;
    }
    ts.forEachChild(node, visitBehavior);
  };
  visitBehavior(formSource);
  assert.ok(retainsAction, 'the existing contact Server Action must remain connected');
  assert.ok(retainsAnalyticsGuard, 'contact analytics must remain guarded by dataLayer availability');
  const formCopy = formElements.map((element) => element.parent.getText(formSource)).join('');
  assert.ok(formCopy.includes('お問い合わせいただき、ありがとうございます。'));
  assert.ok(formCopy.includes('内容を確認のうえ返信します。'));

  const formCss = postcss.parse(css);
  for (const selector of ['.p-form .textfield', '.p-form .textarea', '.p-form select']) {
    const control = declarationsFor(formCss, selector);
    assert.equal(control.get('min-height'), '48px', `${selector} must remain a 48px target`);
    assert.equal(control.get('border'), '1px solid #d8cec7');
    assert.equal(control.get('border-radius'), '6px');
    assert.equal(control.get('background'), '#ffffff');
  }
  assert.equal(declarationsFor(formCss, '.p-form .checkbox input[type=radio] + .checkbox-text').get('min-height'), '44px');
  assert.equal(declarationsFor(formCss, '.p-form .checkbox input[type=radio]:focus-visible + .checkbox-text::before').get('outline'), '3px solid #0066cc');
  for (const selector of [
    '.p-form .textfield[aria-invalid=true]',
    '.p-form .textarea[aria-invalid=true]',
    '.p-form fieldset[aria-invalid=true]',
  ]) {
    assert.equal(declarationsFor(formCss, selector).get('border-color'), '#b3261e');
  }
  const errorStyle = declarationsFor(formCss, '.p-form__error');
  assert.equal(errorStyle.get('color'), '#b3261e');
  assert.equal(errorStyle.get('border-left'), '4px solid #b3261e');
  assert.match(errorStyle.get('background') ?? '', /color-mix/);

  const notFoundContainer = declarationsFor(notFoundCss, '.container');
  assert.equal(notFoundContainer.get('width'), 'min(100% - 32px, var(--reading-width))');
  assert.equal(notFoundContainer.get('margin-inline'), 'auto');
  assert.equal(declarationsFor(notFoundCss, '.container :global(.c-button__link)').get('background'), 'var(--brand-strong)');

  const metadataStatement = notFoundSource.statements.find(
    (statement) => ts.isVariableStatement(statement)
      && statement.declarationList.declarations.some(
        (declaration) => ts.isIdentifier(declaration.name) && declaration.name.text === 'metadata',
      ),
  );
  assert.ok(metadataStatement && ts.isVariableStatement(metadataStatement));
  const metadata = metadataStatement.declarationList.declarations.find(
    (declaration) => ts.isIdentifier(declaration.name) && declaration.name.text === 'metadata',
  );
  assert.ok(metadata?.initializer && ts.isObjectLiteralExpression(metadata.initializer));
  const metadataProperty = (name) => metadata.initializer.properties.find(
    (property) => ts.isPropertyAssignment(property) && property.name.getText(notFoundSource) === name,
  );
  const title = metadataProperty('title');
  const description = metadataProperty('description');
  assert.ok(title && ts.isPropertyAssignment(title) && ts.isStringLiteral(title.initializer));
  assert.ok(description && ts.isPropertyAssignment(description) && ts.isStringLiteral(description.initializer));
  assert.equal(title.initializer.text, 'ページが見つかりません｜ともきゃんスタイル');
  assert.equal(description.initializer.text, '指定されたページは見つかりませんでした。URLをご確認いただくか、トップページまたは制作実績一覧から目的のページをお探しください。');

  const notFoundElements = openingElements(notFoundSource);
  const returnLink = notFoundElements.find(
    (element) => element.tagName.getText(notFoundSource) === 'Link' && stringAttribute(element, 'href') === '/',
  );
  assert.ok(returnLink, '404 must continue returning visitors to the top page');
  assert.ok(returnLink.parent.getText(notFoundSource).includes('トップページへ戻る'));
});
