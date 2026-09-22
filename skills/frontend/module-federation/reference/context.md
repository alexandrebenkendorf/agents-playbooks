# Sub-skill: context

Collect the current project's Module Federation context (MFContext) from `ARGS` (defaults to the current working directory if empty), then output the aggregated summary.

Every check script in this skill consumes this exact structure, so all fields below must be emitted — use `null` when a value cannot be determined rather than omitting the key.

## 1. Basic Info

Resolve the project root to an **absolute path** — this becomes `project.root` and the scripts use it to resolve files on disk.

Read `{projectRoot}/package.json` and extract:

- `name`: project name
- Merge `dependencies` + `devDependencies` into a single flat map → `dependencies`

Detect the package manager (check files in order):

- `pnpm-lock.yaml` → pnpm
- `yarn.lock` → yarn
- `package-lock.json` → npm

## 2. Bundler & MF Config

Find config files in the following priority order (`.ts` / `.mts` take precedence over `.js` / `.mjs` / `.cjs`):

| Priority | Filename                                       |
| -------- | ---------------------------------------------- |
| 1        | `module-federation.config.{ts,mts,js,mjs,cjs}` |
| 2        | `rsbuild.config.{ts,mts,js,mjs,cjs}`           |
| 3        | `rspack.config.{ts,mts,js,mjs,cjs}`            |
| 4        | `modern.config.{ts,mts,js,mjs,cjs}`            |
| 5        | `next.config.{ts,mts,js,mjs,cjs}`              |
| 6        | `vite.config.{ts,mts,js,mjs,cjs}`              |
| 7        | `webpack.config.{ts,js}`                       |

Read the first matched file and extract `remotes`, `exposes`, `shared`, and `externals`.

`module-federation.config.*` holds the MF config but does **not** identify the bundler. Determine `bundler.name` from the project as a whole, in this order:

1. `next.config.*` present or `next` in dependencies → `nextjs`
2. `modern.config.*` present or `@modern-js/app-tools` in dependencies → `modernjs`
3. `rsbuild.config.*` present or `@rsbuild/core` in dependencies → `rsbuild`
4. `rspack.config.*` present or `@rspack/core` / `@rspack/cli` in dependencies → `rspack`
5. `vite.config.*` present or `vite` in dependencies → `vite`
6. `webpack.config.*` present or `webpack` in dependencies → `webpack`
7. Otherwise → `unknown`

Set `bundler.configFile` to the MF config file found above, and `bundler.bundlerConfigFile` to the bundler's own config file when they differ.

### Async entry detection

Read the **bundler** config file (`rsbuild.config.*` / `rspack.config.*` / `webpack.config.*` / `modern.config.*`) and look for `experiments.asyncStartup`. Record the result as `bundler.experiments.asyncStartup`:

- `true` / `false` when the value is found
- `null` when no bundler config exists or the value cannot be statically determined

Never guess `true` or `false` — `null` tells the check script to report "unverified" instead of raising a false warning.

## 3. Determine MF Role

| Condition                   | Role          |
| --------------------------- | ------------- |
| Has `remotes` and `exposes` | `host+remote` |
| Only `remotes`              | `host`        |
| Only `exposes`              | `remote`      |
| Neither                     | `unknown`     |

## 4. Recent Error Event (optional)

Check if `.mf/diagnostics/latest.json` exists; if so, read its contents into `latestErrorEvent`.

## 5. Build Artifacts (optional)

Check if `dist/mf-manifest.json` and `dist/mf-stats.json` exist; if so, read them into `buildArtifacts.mfManifest` and `buildArtifacts.mfStats` respectively.

---

Aggregate the above information into the following JSON shape. This is the exact object passed to
every check script via `--context`:

```jsonc
{
  "project": {
    "root": "/absolute/path/to/project", // required by config-check and type-check
    "name": "my-app",
    "packageManager": "pnpm",
    "mfRole": "host" // host | remote | host+remote | unknown
  },
  "bundler": {
    "name": "rsbuild", // rsbuild | rspack | webpack | vite | modernjs | nextjs | unknown
    "configFile": "module-federation.config.ts",
    "bundlerConfigFile": "rsbuild.config.ts",
    "experiments": {
      "asyncStartup": null // true | false | null (null = could not determine)
    }
  },
  "mfConfig": {
    "remotes": {},
    "exposes": {},
    "shared": {},
    "externals": {} // object or array; {} when absent
  },
  "dependencies": {}, // flat map of dependencies + devDependencies
  "latestErrorEvent": null, // contents of .mf/diagnostics/latest.json, if present
  "buildArtifacts": {
    "mfManifest": null, // contents of dist/mf-manifest.json, if present
    "mfStats": null // contents of dist/mf-stats.json, if present
  }
}
```

When presenting the context to the user, summarize it in readable form rather than dumping the raw JSON.
