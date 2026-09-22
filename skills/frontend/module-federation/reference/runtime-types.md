# Sub-skill: runtime-types

Get `@mf-types` for remotes that are **not** declared in the build config — apps that register and
load remotes only through the runtime API (`registerRemotes` / `init` / `createInstance` /
`loadRemote`).

Also covers the "large host" split: **do not generate** my own types, but **do consume** types from
remote utility modules.

## Why this needs its own setup

The DTS pipeline is **build-plugin driven**. It discovers producers by reading `remotes` from the MF
config at build time. Remotes registered at runtime are invisible to it, so nothing is fetched and
`@mf-types` stays empty — even though `loadRemote` works perfectly at runtime.

The fix is to declare the **type source** (not the runtime wiring) in a `module-federation.config.ts`
that the `mf dts` CLI can read. That file can exist purely for types.

### Two things that look like the fix but are not

1. **Adding `remotes` alone is not enough** when producers use `publicPath: 'auto'`. The manifest then
   contains only relative asset paths, which the DTS consumer cannot resolve into an absolute type
   URL. You get no types and no hard error. `remoteTypeUrls` with absolute URLs is required.
2. **The `.zip` does not exist on a dev server.** `@mf-types.zip` is a build artifact; a running dev
   server usually only serves `@mf-types.d.ts`. The plugin falls back to the `api` URL, so
   `Failed to download zip` warnings during local development are expected and harmless — as long as
   `api` is configured.

---

## Step 1: Separate runtime registration from build-time type config

Keep two lists. They answer different questions and change for different reasons:

| File               | Answers                                          | Used by                    |
| ------------------ | ------------------------------------------------ | -------------------------- |
| `remotes.ts`       | Where do I load this remote from **at runtime**?  | App bootstrap              |
| `remotes.build.ts` | Where do I download this remote's **types** from? | `module-federation.config` |

```ts
// remotes.build.ts — build-time only, never imported by app code
export interface RemoteBuildConfig {
  name: string;
  local: string; // dev server entry, e.g. 'https://localhost:8446/mf-manifest.json'
  cdn: string | ((env: string, domain: string) => string);
}

export const REMOTE_BUILD_CONFIGS: RemoteBuildConfig[] = [practiceManagement, floorplan];
```

```ts
// remotes.ts — runtime registration; entry resolved lazily from injected config
export const remotes: RemoteEntry[] = [
  {
    name: 'practiceManagement',
    entry: () => {
      const entry = globalThis.__APP_CONFIG__.federationRemotes?.practiceManagement ?? '';
      if (!entry) throw new Error('"practiceManagement" remote entry has not been configured.');
      return entry;
    },
  },
];
```

Resolving `entry` through a **function** matters: the runtime config is usually fetched after the
bundle loads, so a value read at module-evaluation time would be empty.

Add a remote to `remotes.build.ts` only when you need its types at compile time. The two lists do not
have to match.

### Idempotent runtime registration

Registration must tolerate being called from several entry points:

```ts
import { registerRemotes } from '@module-federation/enhanced/runtime';

const registered = new Set<string>();

export function registerUtilityRemotes(configs: RemoteEntry[]): void {
  const pending = configs.filter((remote) => !registered.has(remote.name));
  if (!pending.length) return;

  pending.forEach((remote) => registered.add(remote.name));
  try {
    registerRemotes(pending.map(buildRuntimeRemote));
  } catch (error) {
    pending.forEach((remote) => registered.delete(remote.name)); // keep the set truthful on failure
    throw error;
  }
}
```

Register **before** the first `loadRemote` call, inside the async boundary of your bootstrap.

---

## Step 2: Configure `dts` in `module-federation.config.ts`

```ts
import { createModuleFederationConfig } from '@module-federation/enhanced';
import { REMOTE_BUILD_CONFIGS, type RemoteBuildConfig } from './src/module-federation/remotes.build';

// Types are a dev-time concern: never bake localhost URLs into a production bundle.
const isDev = process.env.NODE_ENV !== 'production';

function createRemoteTypeUrls(remote: RemoteBuildConfig, isDev: boolean) {
  const origin = isDev ? new URL(remote.local).origin : resolveCdn(remote);
  return {
    [remote.name]: {
      alias: remote.name,
      api: `${origin}/@mf-types.d.ts`,
      zip: `${origin}/@mf-types.zip`,
    },
  };
}

export default createModuleFederationConfig({
  name: 'host_app_types', // a types-only config still needs a name; it never ships
  exposes: {},
  dts: isDev
    ? {
        // Large host: consume utility types, never publish its own.
        generateTypes: false,
        consumeTypes: {
          typesFolder: '@mf-types',
          maxRetries: 3,
          abortOnError: false, // a producer being down must not fail the build
          remoteTypeUrls: REMOTE_BUILD_CONFIGS.reduce(
            (acc, remote) => ({ ...acc, ...createRemoteTypeUrls(remote, isDev) }),
            {}
          ),
        },
      }
    : false, // production: no type fetching at all
});
```

Field notes:

- `generateTypes: false` is the "consume only" switch. Keep `consumeTypes` enabled.
- `remoteTypeUrls` keys are **producer names**; `alias` is the name the consumer loads under. Set
  `alias` whenever the two differ, or `loadRemote` hints resolve to the wrong module id.
- **Always set `alias` explicitly.** Without it the dts-plugin keys every entry as `undefined`, so
  only the last remote in the object survives and all the others silently vanish.
- `api` is the `loadRemote` declaration file, `zip` is the module type bundle. Configure **both** —
  omitting `api` gives you module types but an untyped `loadRemote`.
- `abortOnError: false` keeps a dead producer from breaking everyone's build.
- Types are not loaded when `NODE_ENV === 'production'`. `consumeTypes.typesOnBuild: true` overrides
  that; prefer leaving it off so a flaky CDN cannot break a release.

If the host also declares dev-only `remotes` (for remote HMR), gate those on `isDev` too, for the
same reason: localhost URLs must not reach a production bundle.

### Environment-dependent URLs

`remoteTypeUrls` also accepts an async function — the right shape when producers come from a registry
or a config endpoint:

```ts
remoteTypeUrls: async () => {
  const registry = await fetch(process.env.MF_REGISTRY_URL).then((r) => r.json());
  return Object.fromEntries(
    registry.remotes.map((r) => [r.name, { alias: r.alias, zip: r.typesZip, api: r.typesApi }])
  );
},
```

---

## Step 3: Wire up `tsconfig.json`

```json
{
  "compilerOptions": {
    "paths": {
      "*": ["./@mf-types/*"]
    }
  },
  "include": ["src", "./@mf-types/*"]
}
```

- `compilerOptions.paths` resolves bare specifiers (`import x from 'utilities/foo'`)
- `include` pulls in `@mf-types/index.d.ts`, which **augments `@module-federation/runtime`,
  `@module-federation/enhanced/runtime`, and `@module-federation/runtime-tools`** with a typed
  `loadRemote` overload keyed on a `RemoteKeys` union. This is the part runtime-only apps actually
  need, since they have few or no bare imports. Missing it is the usual reason
  `loadRemote('utilities/foo')` stays `any`.

If the bundler watches the project, ignore the types folder or type updates cause a rebuild loop:

```ts
// webpack / rspack
watchOptions: { ignored: ['**/node_modules/**', '**/@mf-types/**'] }
```

Add `@mf-types/` to `.gitignore` — it is a build artifact.

---

## Step 4: Add the fetch script

`@module-federation/enhanced` ships the `mf` CLI. Do **not** write a custom downloader — `mf dts`
already handles retries, zip extraction, and the API declaration file.

```jsonc
{
  "scripts": {
    "mf:types": "node scripts/mf-types.mjs"
  }
}
```

Useful `mf dts` flags:

| Flag                    | Purpose                                                      |
| ----------------------- | ------------------------------------------------------------ |
| `--fetch <boolean>`     | Pull types from remotes (default `true`)                     |
| `--generate <boolean>`  | Generate this project's own types (`false` for a pure host)  |
| `--output <output>`     | Override the dts output directory                            |
| `--root <root>`         | Project root, for monorepo invocations                       |
| `-c, --config <config>` | Config path (default `module-federation.config.ts`)          |
| `-m, --mode <mode>`     | `dev` \| `prod`; sets `NODE_ENV` accordingly (default `dev`) |

The command **requires a valid config file** — which is why Step 2 is mandatory here.

> The producer's dev server must be running before you fetch types locally. Document that
> prerequisite right next to the script.

Runtime-only setups get no hot type reload (that needs the build plugin's `dev` option), so hook the
script into the dev loop:

```jsonc
{
  "scripts": {
    "predev": "npm run mf:types",
    "dev": "vite"
  }
}
```

Avoid `postinstall` — it makes `npm ci` depend on producer availability.

---

## Step 5: TLS — local dev certificates and corporate CAs

The type fetch is a plain Node HTTPS request, so it uses **Node's** trust store, not the system
keychain and not the browser's. Against `https://localhost` dev servers (mkcert) or through a
TLS-inspecting corporate proxy you will see:

- `UNABLE_TO_VERIFY_LEAF_SIGNATURE`
- `SELF_SIGNED_CERT_IN_CHAIN`
- `unable to get local issuer certificate`

The correct fix is `NODE_EXTRA_CA_CERTS`, pointing at the CA that signed the certificate.

> ⚠️ **Never use `NODE_TLS_REJECT_UNAUTHORIZED=0`.** It disables certificate validation for the whole
> process, so every request that script makes — including artifact and dependency downloads — becomes
> unauthenticated and trivially MITM-able. If an existing `mf:types` script uses it, replacing it with
> `NODE_EXTRA_CA_CERTS` is the fix, not optional cleanup.

### Wrapper script template

`NODE_EXTRA_CA_CERTS` accepts **one file only**, so an existing bundle must be merged rather than
overwritten. This template resolves the mkcert root CA, merges it with any pre-existing bundle, and
degrades gracefully when mkcert is absent (CI):

```js
// scripts/mf-types.mjs
import { execFileSync, spawn } from 'node:child_process';
import { existsSync, mkdtempSync, readFileSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';

const MKCERT_PATHS =
  {
    darwin: ['/opt/homebrew/bin/mkcert', '/usr/local/bin/mkcert'],
    linux: ['/usr/bin/mkcert', '/usr/local/bin/mkcert', '/home/linuxbrew/.linuxbrew/bin/mkcert'],
  }[process.platform] ?? [];

function applyMkcertCa(env) {
  let caRoot;
  try {
    caRoot = execFileSync(MKCERT_PATHS.find(existsSync) ?? 'mkcert', ['-CAROOT'], {
      encoding: 'utf8',
    }).trim();
  } catch {
    console.warn('mkcert not found — skipping local CA setup (expected in CI).');
    return;
  }

  const caCert = resolve(caRoot, 'rootCA.pem');
  if (!existsSync(caCert)) {
    console.error(`mkcert CA not found at ${caCert}. Run 'mkcert -install'.`);
    return;
  }

  const existing = env.NODE_EXTRA_CA_CERTS;
  if (!existing || !existsSync(existing)) {
    env.NODE_EXTRA_CA_CERTS = caCert;
    return;
  }

  // NODE_EXTRA_CA_CERTS takes a single file, so merge instead of overwriting.
  const combined = join(mkdtempSync(join(tmpdir(), 'mf-ca-')), 'combined-ca.pem');
  writeFileSync(combined, `${readFileSync(existing, 'utf8')}\n${readFileSync(caCert, 'utf8')}`);
  env.NODE_EXTRA_CA_CERTS = combined;
}

const env = { ...process.env };
applyMkcertCa(env);

const isWindows = process.platform === 'win32';
const args = ['mf', 'dts', '--config', 'module-federation.config.ts'];
const child = spawn(isWindows ? 'cmd.exe' : 'npx', isWindows ? ['/c', 'npx', ...args] : args, {
  stdio: 'inherit',
  env,
});

child.on('close', (code, signal) => process.exit(signal ? 1 : (code ?? 1)));
```

For a corporate CA instead of mkcert, point `NODE_EXTRA_CA_CERTS` at the company bundle via the dev
container image, `.npmrc`, or CI secrets rather than per-shell exports.

### If project tooling fetches remote config itself

When a script downloads a config file or manifest directly (not through `mf dts`), keep TLS
verification on and scope any exception narrowly:

```js
const isLocalhost = (hostname) => ['localhost', '127.0.0.1'].includes(hostname);

// Relax verification for loopback only; every other host stays fully verified.
const httpsAgent = new https.Agent({ rejectUnauthorized: !isLocalhost(url.hostname) });
```

Pair it with an allowlist of permitted hostnames, require `https` for anything non-loopback, and
re-validate on redirect (`beforeRedirect`) so a redirect cannot walk the request off the allowlist.

Other network knobs:

- Corporate proxy: `HTTPS_PROXY` / `NO_PROXY`
- Broken dual-stack resolution: `dts.consumeTypes.family` set to `4` or `6`
- Flaky CDN: raise `dts.consumeTypes.maxRetries`

---

## Step 6: Verify and troubleshoot

1. Run the script and confirm `@mf-types/` is populated — one folder per producer plus `index.d.ts`
2. Run `npx tsc --noEmit`
3. Nothing fetched at all:
   - Open each `api` / `zip` URL directly. A 404 means the producer never published types, or
     `dts.generateTypes.outputDir` / `typesFolder` moved the artifact
   - Confirm the producer dev server is actually running
   - Confirm URLs are **absolute** — see the `publicPath: 'auto'` note at the top
   - Re-run with `FEDERATION_DEBUG=true` and `dts.displayErrorInTerminal: true`
   - Check `.mf/typesGenerate.log`
4. `Failed to download zip` in dev only → expected; the `api` fallback covers it
5. Bare imports typed but `loadRemote` untyped → missing `api` URL, or `./@mf-types/*` not in
   `include`
6. Types resolve but are stale → types are fetched, not watched; re-run the script

---

## Recommended split

| Side                      | `dts` config                                                                |
| ------------------------- | --------------------------------------------------------------------------- |
| Utility / shared remote   | `generateTypes: true` (default); `consumeTypes: false` if it has no remotes |
| Large host (runtime-only) | `generateTypes: false`; `consumeTypes.remoteTypeUrls` per utility, dev only |

This keeps type generation cost in the small utility packages rather than the large application,
which is usually where the DTS bottleneck actually is. If generation in the utilities is still slow,
see `./perf.md` for the `tsgo` compiler switch.
