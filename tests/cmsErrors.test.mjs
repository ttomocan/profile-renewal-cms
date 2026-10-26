import assert from 'node:assert/strict';
import test from 'node:test';
import { loadSeoModule } from './helpers/loadSeoModule.mjs';

function loadCms(client) {
  return loadSeoModule('app/_libs/microcms.ts', {
    'microcms-js-sdk': { createClient: () => client },
    '@/lib/parse': { buildMicroCMSFilters: () => [] },
  }, {
    process: { env: { MICROCMS_SERVICE_DOMAIN: 'test-only', MICROCMS_API_KEY: 'test-only' } },
    console: { error() {} },
  });
}

const sdkError = status => new Error(`fetch API response status: ${status}\n  message is \`テスト用応答\``);
const transientErrors = [sdkError(400), sdkError(401), sdkError(403), sdkError(429), sdkError(500), sdkError(503), new Error('Network Error.\n  Details: timeout'), new Error('Network Error.\n  Details: fetch API response status: 404'), new Error('fetch API response status: 4040')];

for (const error of transientErrors) {
  test(`実績詳細: ${error.message.split('\n')[0]}を未存在へ変換しない`, async () => {
    const cms = loadCms({ getListDetail: async () => { throw error; } });
    await assert.rejects(cms.getResultDetail('existing'), caught => caught === error);
  });
}

for (const error of [new Error('fetch API response status: 404'), sdkError(404)]) {
  test(`実績詳細: SDKの404だけをnullにする (${error.message.includes('\n') ? 'メッセージあり' : 'メッセージなし'})`, async () => {
    const cms = loadCms({ getListDetail: async () => { throw error; } });
    assert.equal(await cms.getResultDetail('missing'), null);
  });
}

for (const operation of ['getResults', 'getTotalCount']) {
  for (const status of [404, 429, 503]) {
    test(`${operation}: APIの${status}を空の成功応答にしない`, async () => {
      const error = sdkError(status);
      const cms = loadCms({ getList: async () => { throw error; } });
      await assert.rejects(cms[operation](), caught => caught === error);
    });
  }
}

test('実績詳細: 障害後の正常取得とキャッシュ設定を維持する', async () => {
  const result = { id: 'existing', title: '実績' };
  const error = sdkError(503);
  let failed = true;
  const cms = loadCms({ getListDetail: async options => {
    assert.equal(options.customRequestInit.next.revalidate, 300);
    if (failed) throw error;
    return result;
  } });
  await assert.rejects(cms.getResultDetail('existing'), caught => caught === error);
  failed = false;
  assert.equal(await cms.getResultDetail('existing'), result);
});

test('実績一覧: 正常な0件とページ送り条件を維持する', async () => {
  const cms = loadCms({ getList: async options => {
    assert.equal(options.queries.limit, 9);
    assert.equal(options.queries.offset, 18);
    assert.equal(options.queries.orders, '-period,-publishedAt');
    assert.equal(options.customRequestInit.next.revalidate, 60);
    return { contents: [], totalCount: 0, offset: 18, limit: 9 };
  } });
  const result = await cms.getResults({ limit: 9, offset: 18, sort: 'periodDesc' });
  assert.equal(result.totalCount, 0);
  assert.equal(result.contents.length, 0);
  assert.equal(result.offset, 18);
  assert.equal(result.limit, 9);
});

test('実績件数: 正常な0件をエラーにしない', async () => {
  const cms = loadCms({ getList: async () => ({ totalCount: 0 }) });
  assert.equal(await cms.getTotalCount(), 0);
});
