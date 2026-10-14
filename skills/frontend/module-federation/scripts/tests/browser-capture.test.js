const test = require('node:test');
const assert = require('node:assert');
const fs = require('node:fs');
const path = require('node:path');

const source = fs.readFileSync(path.join(__dirname, '../browser-capture.mjs'), 'utf8').replace(/^#!.*\n/, '');
const AsyncFunction = Object.getPrototypeOf(async function () {}).constructor;

// Runs the script against a fake CDP endpoint; the click opens tab "b" whose readyState is `destReadyState`.
async function run(destReadyState, timeoutMs) {
  const tabA = { id: 'a', url: 'http://host/', webSocketDebuggerUrl: 'ws://a', type: 'page' };
  const tabB = { id: 'b', url: 'http://remote/', webSocketDebuggerUrl: 'ws://b', type: 'page' };
  let listCalls = 0;
  let output = '';

  class FakeWebSocket {
    constructor(url) {
      this.url = url;
      this.listeners = {};
      setTimeout(() => this.listeners.open?.({}), 0);
    }
    addEventListener(name, fn) {
      this.listeners[name] = fn;
    }
    send(raw) {
      const msg = JSON.parse(raw);
      let result = {};
      if (msg.method === 'Runtime.evaluate') {
        const value =
          msg.params.expression === 'document.readyState'
            ? destReadyState
            : JSON.stringify({ found: true, tag: 'a', text: 'open' });
        result = { result: { value } };
      }
      queueMicrotask(() => this.listeners.message({ data: JSON.stringify({ id: msg.id, result }) }));
    }
    close() {}
  }

  const fakeFetch = async (url) => ({
    json: async () => (url.endsWith('/json/list') ? (++listCalls <= 2 ? [tabA] : [tabA, tabB]) : {}),
  });
  const fakeProcess = {
    argv: [
      'node',
      'script',
      '--tab-id',
      'a',
      '--click',
      'open',
      '--action-wait',
      'domcontentloaded',
      'unused',
      String(timeoutMs),
    ],
    stderr: { write() {} },
    stdout: { write: (s) => (output += s) },
    version: process.version,
    exit() {
      throw new Error('exit');
    },
  };

  const started = Date.now();
  await new AsyncFunction('process', 'fetch', 'WebSocket', source)(fakeProcess, fakeFetch, FakeWebSocket);
  return { result: JSON.parse(output), elapsedMs: Date.now() - started };
}

test('destination tab still loading at the deadline reports a timeout, not an early stop', async () => {
  const { result } = await run('loading', 300);
  assert.strictEqual(result.tabTransition.readyState, 'loading');
  assert.strictEqual(result.timedOut, true);
  assert.strictEqual(result.earlyStop, false);
});

test('destination tab that is ready reports an early stop', async () => {
  const { result } = await run('complete', 300);
  assert.strictEqual(result.tabTransition.readyState, 'complete');
  assert.strictEqual(result.timedOut, false);
  assert.strictEqual(result.earlyStop, true);
});

// Total = 200ms click delay + 500ms source-tab wait + one 600ms destination budget (previously a second 600ms)
test('destination wait spends its budget once', async () => {
  const { elapsedMs } = await run('loading', 600);
  assert.ok(elapsedMs < 1500, `took ${elapsedMs}ms for a 600ms budget`);
});
