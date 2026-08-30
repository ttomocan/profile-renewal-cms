import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import test from 'node:test';
import { fileURLToPath } from 'node:url';

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

test('トップのお問い合わせ画像は配信用WebPとして配置されている', async () => {
  const image = await readFile(path.join(projectRoot, 'public/img/pages/top/img_contact-v2.webp'));

  assert.equal(image.subarray(0, 4).toString('ascii'), 'RIFF');
  assert.equal(image.subarray(8, 12).toString('ascii'), 'WEBP');
  assert.ok(image.byteLength >= 40_000, '画像が過度に低品質・空に近い状態ではない');
});
