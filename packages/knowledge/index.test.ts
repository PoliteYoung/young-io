import test from 'node:test';
import assert from 'node:assert/strict';
import { cp, mkdtemp, readFile, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { parse } from 'yaml';
import { dateSchema, projectFileSchema, talksFileSchema, loadPublicKnowledge, createKnowledgeLoader } from './index.ts';

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

test('shared loader resolves data independently of working directory', async () => {
  const previous = process.cwd();
  try {
    process.chdir('/tmp');
    const data = await loadPublicKnowledge();
    assert.ok(data.profile.id);
  } finally { process.chdir(previous); }
});

test('production caches one promise while development reloads edited YAML', async () => {
  const previous = process.env.NODE_ENV;
  const root = await mkdtemp(join(tmpdir(), 'young-io-knowledge-'));
  const sourceFile = new URL('../../knowledge/profile.yaml', import.meta.url);
  const original = await readFile(sourceFile, 'utf8');
  const file = join(root, 'knowledge', 'profile.yaml');
  const getPublicKnowledge = createKnowledgeLoader(root);
  try {
    await cp(new URL('../../knowledge/', import.meta.url), join(root, 'knowledge'), { recursive: true });
    await cp(new URL('../../identity/', import.meta.url), join(root, 'identity'), { recursive: true });
    process.env.NODE_ENV = 'production';
    const first = getPublicKnowledge();
    assert.strictEqual(first, getPublicKnowledge());
    const cached = await first;
    process.env.NODE_ENV = 'development';
    const before = await getPublicKnowledge();
    const edited = original.replace('id: yaodong-yang', 'id: cache-reload-fixture');
    assert.notEqual(edited, original);
    await writeFile(file, edited);
    const after = await getPublicKnowledge();
    assert.notStrictEqual(before, after);
    assert.equal(after.profile.id, 'cache-reload-fixture');
    process.env.NODE_ENV = 'production';
    assert.strictEqual(await getPublicKnowledge(), cached);
  } finally {
    if (previous === undefined) delete process.env.NODE_ENV;
    else process.env.NODE_ENV = previous;
    await rm(root, { recursive: true, force: true });
    assert.equal(await readFile(sourceFile, 'utf8'), original);
  }
});
