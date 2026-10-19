import test from 'node:test';
import assert from 'node:assert/strict';
import { parse } from 'yaml';
import { dateSchema, projectFileSchema, talksFileSchema, loadPublicKnowledge, getPublicKnowledge } from './index.ts';

test('dates preserve precision and reject impossible calendar dates', () => {
  for (const date of ['2022', '2022-07', '2022-07-01', '2024-02-29']) assert.equal(dateSchema.parse(date), date);
  for (const date of ['July 2022', '2022-13', '2023-02-29', '2022-04-31', '2022-7-1']) assert.equal(dateSchema.safeParse(date).success, false);
  assert.equal(typeof parse('date: 2022-07-01', { version: '1.2' }).date, 'string');
});

test('project and talk records require provenance and consistent verification', () => {
  const metadata = { source: { type: 'repository', reference: 'test fixture' }, verified: false, status: 'needs verification', visibility: 'internal' };
  const text = { en: 'Example', zh: '示例' };
  const project = { ...metadata, id: 'example', title: text, summary: text, role: null, period: { start: null }, topics: [], links: [] };
  assert.equal(projectFileSchema.safeParse({ schema_version: 1, project }).success, true);
  assert.equal(projectFileSchema.safeParse({ schema_version: 1, project: { ...project, verified: true } }).success, false);
  const talk = { ...metadata, id: 'example', title: text, event: text, date: '2022-07', links: [] };
  assert.equal(talksFileSchema.safeParse({ schema_version: 1, talks: [talk] }).success, true);
  assert.equal(talksFileSchema.safeParse({ schema_version: 1, talks: [{ ...talk, source: undefined }] }).success, false);
});

test('shared loader resolves data independently of working directory and caches one promise', async () => {
  const previous = process.cwd();
  try {
    process.chdir('/tmp');
    const data = await loadPublicKnowledge();
    assert.ok(data.profile.id);
    assert.strictEqual(getPublicKnowledge(), getPublicKnowledge());
  } finally { process.chdir(previous); }
});
