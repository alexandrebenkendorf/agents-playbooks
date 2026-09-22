# Sub-skill: shared-deps

Check Module Federation shared dependency configuration: detect shared/externals conflicts, antd/arco transformImport blocking shared deps, subpath imports that bypass sharing, and multiple versions of the same shared package in build artifacts.

## Step 1: Collect MFContext

Read and follow the instructions in `./context.md`, passing ARGS as the project root.

## Step 2: Run shared config check script

Serialize MFContext to JSON and pass it to the check script:

```bash
node <skill-dir>/scripts/shared-config-check.js --context '<MFContext-JSON>'
```

Process each item in the output `results` array:

**SHARED-EXTERNALS-CONFLICT · warning — same library in both `shared` and `externals`**

- `shared` and `externals` are not mutually exclusive in config, but the same library must not appear in both — it causes the module to be excluded from the bundle while also being declared as shared, leading to runtime failures
- Show the conflicting library name and guide the user to remove it from one of the two configs

**SHARED-TRANSFORM-IMPORT · warning — antd/arco UI library shared but `transformImport` is active**

- `babel-plugin-import` (or the built-in `transformImport` in Modern.js / Rsbuild) rewrites import paths at build time, which prevents the shared dep from being recognized and causes sharing to fail silently
- Fix:
  - Modern.js / Rsbuild: set `source.transformImport = false` to disable the built-in behavior
  - Other bundlers: remove `babel-plugin-import` from the Babel config
- Show which UI library triggered the warning

**SHARED-MULTI-VERSION · warning — multiple versions of the same shared package detected**

- The build artifacts contain more than one version of a shared package, meaning the version negotiation failed and both host and remote are each bundling their own copy
- Recommended fix: add an `alias` in the bundler config so all projects resolve to the same physical file
- Show the detected versions

**SHARED-SUBPATH · warning — package with subpath imports shared by exact name only**

- MF intercepts imports at build time by key. An exact key such as `'react-dom'` only intercepts
  `import 'react-dom'`; subpath imports like `import { createRoot } from 'react-dom/client'` bypass
  `shared` and get bundled locally, producing a duplicate copy ("Invalid hook call", hydration
  mismatches, or `loadShare` returning `false`)
- Fix: add a **trailing slash** key for prefix matching, alongside the exact key:
  ```ts
  shared: {
    react: { singleton: true },
    'react/': { singleton: true },      // react/jsx-runtime, react/jsx-dev-runtime, ...
    'react-dom': { singleton: true },
    'react-dom/': { singleton: true },  // react-dom/client, react-dom/server, ...
  }
  ```
- The same applies to scoped packages (`'@scope/package/'`) and utility libraries (`'lodash/'`)
- Show which shared packages are missing a trailing-slash counterpart

**When results is empty**

- Inform the user that no shared dependency conflicts were detected in this project
- Remind them that a complete picture requires running the same check in both the host and every remote
