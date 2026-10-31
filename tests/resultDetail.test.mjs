import assert from 'node:assert/strict';
import test from 'node:test';
import { renderToStaticMarkup } from 'react-dom/server';
import { loadDetail, loadPage } from './helpers/resultPageHarness.mjs';

const oldData = { id: 'corporate-handball-team-01', title: '既存案件', summary: '掲載概要', publishedAt: '2025-01-01', updatedAt: '2025-01-01' };
const params = { params: Promise.resolve({ id: oldData.id }) };

for (const id of ['corporate-handball-team-01', 'another-project']) {
  for (const articles of [[], [{ id: 'related-article', title: '関連技術記事のテスト' }]]) {
    test(`${id}: 関連記事${articles.length ? 'あり' : 'なし'}でも不要な2セクションを表示せず、既存導線を保持する`, async () => {
      const result = { ...oldData, id, techStack: 'WordPress,CSS' };
      const relatedResult = { ...oldData, id: 'related-project', title: '関連案件のテスト', techStack: 'WordPress' };
      let blogCalls = 0;
      const page = loadPage('app/result/[id]/page.tsx', {
        getResultDetail: async (requestedId) => {
          assert.equal(requestedId, id);
          return result;
        },
        getAllResultList: async () => [result, relatedResult],
        getBlogList: async () => {
          blogCalls += 1;
          return { contents: articles };
        },
      });
      const html = renderToStaticMarkup(await page.default({ params: Promise.resolve({ id }) }));

      assert.doesNotMatch(html, /関連する技術記事|関連ページ|result-related-navigation|result-related-links/);
      assert.match(html, /関連する制作実績/);
      assert.match(html, /href="\/result\/related-project\/?"/);
      assert.match(html, /関連案件のテスト/);
      assert.match(html, /class="result-card__technologies"[^>]*><li>WordPress<\/li>/);
      assert.match(html, /aria-label="使用技術: WordPress"/);
      assert.doesNotMatch(html, new RegExp(`href="/result/${id}/?"`));
      assert.match(html, /採用・協業について相談する/);
      assert.match(html, /<a\b[^>]*href="\/contact\/?"[^>]*>採用・協業について問い合わせる<\/a>/);
      assert.match(html, /<a\b(?=[^>]*href="\/result\/?")(?=[^>]*class="result-detail__navigation-back")/);
      assert.match(html, /実績紹介に戻る/);
      assert.equal(blogCalls, 0, '削除したセクション用の記事取得を行わない');
    });
  }
}

test('関連制作実績がない詳細でも問い合わせと一覧に戻る導線を保持する', async () => {
  const page = loadDetail(oldData);
  const html = renderToStaticMarkup(await page.default(params));
  assert.doesNotMatch(html, /関連する技術記事|関連ページ|関連する制作実績/);
  assert.match(html, /href="\/contact\/?"/);
  assert.match(html, /<a\b(?=[^>]*href="\/result\/?")(?=[^>]*class="result-detail__navigation-back")/);
  assert.match(html, /実績紹介に戻る/);
});

test('関連実績は24件の先取りをせず、関連する範囲から新着3件を選ぶ', async () => {
  const current = { ...oldData, techStack: 'PHP' };
  const related = Array.from({ length: 30 }, (_, i) => ({ ...oldData, id: `related-${i + 1}`, title: `関連案件${i + 1}`, techStack: 'PHP', publishedAt: `2026-01-${String(i + 1).padStart(2, '0')}` }));
  const page = loadPage('app/result/[id]/page.tsx', {
    getResultDetail: async () => current,
    getAllResultList: async () => [current, { ...oldData, id: 'unrelated', title: '無関係の最新案件', techStack: 'Rust', publishedAt: '2030-01-01' }, ...related],
  });
  const html = renderToStaticMarkup(await page.default(params));
  const section = html.match(/<section[^>]*class="result-detail__section result-related"[\s\S]*?<\/section>/)?.[0];
  assert.ok(section);
  assert.deepEqual([...section.matchAll(/href="\/result\/([^/"?]+)\/?"/g)].map(([, id]) => id), ['related-30', 'related-29', 'related-28']);
  assert.doesNotMatch(section, /無関係の最新案件|related-1\//);
});

test('旧データ・未入力の任意項目では空の見出しと不明な期間を出さない', async () => {
  const page = loadDetail({ ...oldData, decisions: '  ', verification: '', handover: '\n' });
  const html = renderToStaticMarkup(await page.default(params));
  assert.match(html, /掲載概要/);
  assert.doesNotMatch(html, /期間不明|案件全体の制作期間|実装内容・工夫|実装時の判断と理由|動作・更新手順の確認|公開後の運用・引き継ぎ|使用技術・制作ツール/);
});

test('実装内容・理由・結果・確認・引き継ぎを欠落させず、本文をHTMLとして実行しない', async () => {
  const page = loadDetail({ ...oldData, period: 6, scale: ['101ページ以上'], highlights: '年度別フィルタ', decisions: '判断の説明', results: '確認できた結果', verification: '確認方法', handover: '引き継ぎ内容', technologyUsage: 'PHPの用途', techStack: 'PHP,WordPress,VS Code', responsibility: '<script>個人情報を含まないテスト</script>' });
  const html = renderToStaticMarkup(await page.default(params));
  for (const text of ['年度別フィルタ', '判断の説明', '確認できた結果', '確認方法', '引き継ぎ内容', 'PHPの用途', '案件全体の制作期間', '案件全体のページ規模', 'エディタ・デザインツール']) assert.ok(html.includes(text), text);
  assert.match(html, /&lt;script&gt;/);
  assert.doesNotMatch(html, /<script>個人情報/);
});

test('案件IDによる古いSEO文で本文と担当範囲を上書きしない', async () => {
  const page = loadDetail(oldData);
  const metadata = await page.generateMetadata(params);
  assert.equal(metadata.description, '掲載概要');
  assert.equal(metadata.openGraph.description, '掲載概要');
  assert.doesNotMatch(metadata.title, /UI設計|速度改善|CMS構築/);
});

test('個人開発の実績を取得できなくても既存実績一覧を表示する', async () => {
  const page = loadPage('app/result/page.tsx', {
    getResults: async () => ({ contents: [{ ...oldData, techStack: 'PHP,WordPress' }], totalCount: 1, offset: 0, limit: 9 }),
    getResultDetail: async () => { throw new Error('実績取得失敗'); },
  });
  const html = renderToStaticMarkup(await page.default({ searchParams: Promise.resolve({}) }));
  assert.match(html, /既存案件/);
  assert.doesNotMatch(html, /result-card__technologies/);
  assert.doesNotMatch(html, /personal-project-heading/);
});

test('個人開発は共通の実績カードで詳細へリンクし、同じ画面内に重複表示しない', async () => {
  const personalResult = { ...oldData, id: 'iropon-app', title: '色彩検定の慣用色名学習アプリ「いろポン！」', summary: '既存CMSの概要文です。本アプリは、AIによるコード補完を活用して構築しています。', workType: ['個人開発'], 'project-type': ['Webアプリ'], cover: { url: '/img/iropon-app.jpg', width: 1200, height: 630 }, siteUrl: 'https://www.iropon.com/' };
  let blogCalls = 0;
  const page = loadPage('app/result/page.tsx', {
    getResults: async () => ({ contents: [personalResult, oldData], totalCount: 2, offset: 0, limit: 12 }),
    getResultDetail: async id => { assert.equal(id, 'iropon-app'); return personalResult; },
    getBlogList: async () => { blogCalls++; throw new Error('開発日記を実績カードに使わない'); },
  });
  const html = renderToStaticMarkup(await page.default({ searchParams: Promise.resolve({}) }));
  const personalSection = html.match(/<section[^>]*aria-labelledby="personal-project-heading"[\s\S]*?<\/section>/)?.[0];
  assert.ok(personalSection);
  assert.match(personalSection, /href="\/result\/iropon-app\/?"/);
  assert.match(personalSection, /本アプリは、AIによるコード補完を活用して構築しています。/);
  assert.ok(personalSection.includes(personalResult.title));
  assert.match(personalSection, />Webアプリ</);
  assert.match(personalSection, /iropon-app\.jpg/);
  assert.match(personalSection, /この制作実績を見る/);
  assert.equal((html.match(/class="result-card__link"[^>]*href="\/result\/iropon-app\/?"/g) || []).length, 1);
  assert.match(html, /既存案件/);
  assert.doesNotMatch(html, /href="\/diary\/iropon-release\/?"/);
  assert.equal(blogCalls, 0);
  const detail = await loadDetail(personalResult).default({ params: Promise.resolve({ id: 'iropon-app' }) });
  assert.ok(renderToStaticMarkup(detail).includes(personalResult.summary));
});

for (const personalResult of [null, { ...oldData, id: 'iropon-app', publishedAt: '' }]) {
  test(`個人開発の実績が${personalResult ? '未公開' : '存在しない'}場合はリンクを作らない`, async () => {
    const page = loadPage('app/result/page.tsx', {
      getResults: async () => ({ contents: [oldData], totalCount: 1, offset: 0, limit: 12 }),
      getResultDetail: async () => personalResult,
    });
    const html = renderToStaticMarkup(await page.default({ searchParams: Promise.resolve({}) }));
    assert.match(html, /既存案件/);
    assert.doesNotMatch(html, /personal-project-heading|href="\/result\/iropon-app\/?"/);
  });
}

test('担当範囲は通常リストで元の順序を保ち、技術と本文を欠落させない', async () => {
  const page = loadDetail({ ...oldData, 'project-roles': ['CMS構築', 'SEO', '運用 / 保守'], techStack: 'HTML,PHP,WordPress', highlights: '実装項目1\n実装項目2' });
  const html = renderToStaticMarkup(await page.default(params));
  assert.match(html, /<ul class="result-detail__roles" aria-label="担当範囲一覧"><li>CMS構築<\/li><li>SEO<\/li><li>運用 \/ 保守<\/li><\/ul>/);
  assert.doesNotMatch(html, /tag--role/);
  assert.match(html, /aria-label="使用技術: HTML"[\s\S]*aria-label="使用技術: PHP"[\s\S]*aria-label="使用技術: WordPress"/);
  assert.match(html, /案件概要<\/h2><div class="result-detail__section-content result-detail__section-content--prose"><p>掲載概要<\/p>/);
  assert.match(html, /<li>実装項目1<\/li><li>実装項目2<\/li>/);
});

for (const [label, fields, expected] of [
  ['期間のみ', { period: 6 }, '期間'],
  ['ページ規模のみ', { id: 'beverage-campaign-lp-01', scale: ['1ページ'] }, 'ページ規模'],
  ['両方', { period: 6, scale: ['1ページ'] }, '期間・ページ規模'],
  ['どちらもなし', {}, null],
  ['期間0・規模未分類', { period: 0, scale: ['未分類'] }, null],
]) {
  test(`案件全体の注記は表示項目と一致する：${label}`, async () => {
    const page = loadDetail({ ...oldData, ...fields });
    const html = renderToStaticMarkup(await page.default(params));
    const note = html.match(/<p class="result-detail__scope-note">(.*?)<\/p>/)?.[1].replace(/<!-- -->/g, '');
    assert.equal(note, expected ? `${expected}は案件全体の情報です。本人の担当範囲は以下に記載しています。` : undefined);
    assert.equal(html.includes('<dt>案件全体の制作期間</dt>'), Boolean(fields.period));
    assert.equal(html.includes('<dt>案件全体のページ規模</dt>'), Boolean(fields.scale && fields.scale[0] !== '未分類'));
  });
}
