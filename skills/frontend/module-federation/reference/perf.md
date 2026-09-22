# Sub-skill: perf

Check Module Federation local development performance configuration: detect whether recommended performance optimization options are enabled to alleviate slow HMR and slow build speed.

## Step 1: Collect MFContext

Read and follow the instructions in `./context.md`, passing ARGS as the project root.

## Step 2: Run performance check script

Serialize MFContext to JSON and pass it to the check script:

```bash
node <skill-dir>/scripts/performance-check.js --context '<MFContext-JSON>'
```

Provide recommendations for each item in the output `results` and `context.bundler.name`:

**PERF · info — `manifest.disableAssetsAnalyze`** (opt-in, not a default recommendation)

- Asset analysis can be slow in complex projects. Disabling it shortens build time.
- It belongs to the **`manifest`** option of the MF plugin config, not `dev`:
  ```ts
  // module-federation.config.ts
  manifest: {
    disableAssetsAnalyze: true,
  }
  ```
- ⚠️ Only suggest this when build time is the confirmed bottleneck. Disabling asset analysis
  **turns off resource preloading**, and the emitted manifest will omit `shared` / `exposes` and the
  `assets` of `remotes`.
- MF already sets this to `true` in dev by default for pure-consumer projects, so the manual change
  is usually unnecessary.

**PERF · info — Local dev type/live reload overhead** (applies to all projects)

- The MF `dev` option controls dev-time behavior: `disableLiveReload`, `disableHotTypesReload`,
  `disableDynamicRemoteTypeHints`.
- If producer rebuilds constantly reload the consumer page or re-pull types during local
  development, disabling the relevant one reduces churn:
  ```ts
  dev: {
    disableHotTypesReload: true,
  }
  ```

**PERF · info — Rspack `splitChunks` optimization** (shown only when `bundler.name` is `rspack` or `rsbuild`)

- Setting `splitChunks.chunks` to `"async"` reduces initial bundle size and speeds up first-screen loading
- Add to the build config:
  ```js
  output: {
    splitChunks: {
      chunks: 'async';
    }
  }
  ```

**PERF · info — TypeScript DTS optimization** (shown only when `typescript` dependency is detected)

- If type generation (DTS) is the main bottleneck, options include:
  1. Temporarily disable DTS: set `dts: false` in the `@module-federation/enhanced` config
  2. Switch to `ts-go` for significantly faster type generation

## Step 3: ts-go migration (interactive)

After presenting the DTS recommendation, ask the user:

> "Would you like me to automatically try switching to `ts-go` and verify compatibility?"

If the user confirms, execute the following steps in order:

1. **Backup** — copy the current generated type output directory (e.g. `@mf-types/`) to a timestamped backup path such as `@mf-types.bak.<timestamp>/`

2. **Configure** — set `dts.generateTypes.compilerInstance = "tsgo"` in the Module Federation config
   (`compilerInstance` accepts `'tsc' | 'tsgo' | 'vue-tsc' | 'tspc'`; default is `'tsc'`)

3. **Install** — install the required package using the project's package manager from MFContext:

   ```bash
   pnpm add @typescript/native-preview --save-dev
   ```

4. **Regenerate** — run:

   ```bash
   npx mf dts
   ```

5. **Verify** — diff the newly generated type output against the backup:
   - If the output is **identical**: inform the user that `ts-go` is compatible and the switch is safe; offer to remove the backup
   - If the output **differs**: revert the config change, restore the backup, and explain clearly what differs (e.g. missing declarations, changed signatures) so the user can decide whether the difference is acceptable

Webpack projects do not show Rspack-specific entries to avoid irrelevant suggestions.

---

## Remote HMR (`dev.remoteHmr`) compatibility

`dev: { remoteHmr: true }` lets a host hot-reload modules coming from a remote's dev server. Whether
it can work at all depends on how the remote's dev server serves code.

### Requirements

| Host bundler          | Remote bundler   | Remote HMR                                                       |
| --------------------- | ---------------- | ---------------------------------------------------------------- |
| Vite                  | Vite             | ✅ Works — **only** if the React refresh toolchain matches (below) |
| Vite                  | Rspack / Webpack | ❌ Not supported                                                   |
| Rspack / Webpack      | any              | ✅ Works — no toolchain alignment needed                           |

### Why

- **Vite dev serves unbundled source over native ESM.** `@vitejs/plugin-react` transforms each module
  and injects a React Fast Refresh preamble bound to the refresh runtime that dev server exposes.
  With a Vite host loading modules from a Vite remote, both sides execute against that shared refresh
  contract (`$RefreshReg$` / `$RefreshSig$` and the preamble shape), which is owned by
  `@vitejs/plugin-react`. If the two repos run different versions, the contract does not line up —
  refresh silently stops working, or the remote throws a "can't detect preamble" style error.
- **Rspack / Webpack dev servers serve compiled output.** The remote is rebuilt and each app runs its
  own HMR runtime over its own socket, so nothing about the refresh runtime crosses the federation
  boundary. That is why an Rspack host interoperates with remotes of any stack — the cost is a
  rebuild step instead of serving raw source.

### Vite host + Vite remote checklist

Pin these to the **same version** in the host and every remote:

- `@vitejs/plugin-react`  ← the one that actually breaks refresh when it drifts
- `vite`
- `@module-federation/vite` — keep aligned as well; the manifest/shared handling changes between
  minors, and a host on `1.20.x` against a remote on `1.21.x` is a real source of drift

Enable it on both sides:

```ts
// host and remote module-federation.config.ts
dev: {
  remoteHmr: true,
}
```

Gate it behind a flag (for example an env var set by the dev script) so it only applies to the dev
server, and confirm the host actually registers the remote's **dev** URL — remote HMR cannot work
against a deployed artifact.

### When it cannot be made to work

If the remote is not Vite, or the toolchains cannot be aligned, do not fight it. Either:

- run the host on Rspack for local development, which HMRs against any remote, or
- accept a rebuild-and-refresh loop for remote changes and keep HMR for host-local code only

