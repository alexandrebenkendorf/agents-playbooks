const test = require('node:test');
const assert = require('node:assert');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { execFileSync } = require('node:child_process');

const script = path.join(__dirname, '../type-check.js');

// Builds a throwaway project with a tsconfig and the given extra files, then runs type-check on it.
function check(files, mfRole) {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'mf-type-check-'));
  fs.writeFileSync(path.join(root, 'tsconfig.json'), '{}');
  for (const file of files) {
    fs.mkdirSync(path.dirname(path.join(root, file)), { recursive: true });
    fs.writeFileSync(path.join(root, file), '');
  }
  const context = { project: { root, mfRole }, devDependencies: { typescript: '5.0.0' } };
  const out = execFileSync('node', [script, '--context', JSON.stringify(context)], { encoding: 'utf8' });
  return JSON.parse(out).results.map((r) => r.scenario);
}

test('producer with types in dist/ is healthy even without a root @mf-types folder', () => {
  const scenarios = check(['dist/@mf-types.zip', 'dist/@mf-types.d.ts'], 'remote');
  assert.deepStrictEqual(scenarios, ['PRODUCER_TYPES_PUBLISHED']);
});

test('producer with no type artifacts anywhere reports TYPE_GENERATION_FAILED', () => {
  assert.deepStrictEqual(check([], 'remote'), ['TYPE_GENERATION_FAILED']);
});

test('a root @mf-types folder alone does not count as producer output', () => {
  const scenarios = check(['@mf-types/remote/index.d.ts'], 'remote');
  assert.ok(!scenarios.includes('PRODUCER_TYPES_PUBLISHED'));
});

test('host+remote with producer artifacts still warns that remote types were not pulled', () => {
  const scenarios = check(['dist/@mf-types.zip'], 'host+remote');
  assert.deepStrictEqual(scenarios, ['PRODUCER_TYPES_PUBLISHED', 'TYPES_NOT_PULLED']);
});
