const test = require('node:test');
const assert = require('node:assert');
const http = require('node:http');
const { extractRemoteUrl, fetchJson } = require('../module-info.js');

test('extractRemoteUrl strips a name@ prefix', () => {
  assert.strictEqual(extractRemoteUrl('app@https://cdn.test/remoteEntry.js'), 'https://cdn.test/remoteEntry.js');
  assert.strictEqual(extractRemoteUrl('@scope/app@https://cdn.test/mf-manifest.json'), 'https://cdn.test/mf-manifest.json');
});

test('extractRemoteUrl keeps @ inside URLs', () => {
  assert.strictEqual(extractRemoteUrl('https://cdn.test/@org/app/remoteEntry.js'), 'https://cdn.test/@org/app/remoteEntry.js');
  assert.strictEqual(extractRemoteUrl('https://user@host.test/mf-manifest.json'), 'https://user@host.test/mf-manifest.json');
});

test('extractRemoteUrl supports Vite object remotes', () => {
  assert.strictEqual(extractRemoteUrl({ entry: 'https://cdn.test/mf-manifest.json' }), 'https://cdn.test/mf-manifest.json');
  assert.strictEqual(extractRemoteUrl({ external: 'app@https://cdn.test/a.js' }), 'https://cdn.test/a.js');
  assert.strictEqual(extractRemoteUrl({}), null);
});

test('fetchJson follows redirects and reports the final URL', async () => {
  const server = http.createServer((req, res) => {
    if (req.url === '/old/mf-manifest.json') {
      res.writeHead(302, { location: '/new/mf-manifest.json' });
      res.end();
      return;
    }
    res.end(JSON.stringify({ ok: 1 }));
  });
  await new Promise((r) => server.listen(0, r));
  const base = `http://127.0.0.1:${server.address().port}`;
  try {
    const res = await fetchJson(`${base}/old/mf-manifest.json`);
    assert.strictEqual(res.ok, true);
    assert.strictEqual(res.url, `${base}/new/mf-manifest.json`);
  } finally {
    server.close();
  }
});
