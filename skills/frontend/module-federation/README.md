# Module Federation Skill

All-in-one Module Federation (MF 2.0) skill for AI agents. It routes a question or sub-command to a
focused reference file instead of loading the whole Module Federation documentation set.

Vendored from the official [`mf` skill](https://module-federation.io/ai/skill) published by the
Module Federation team, with paths and references adapted to this playbook.

## What it covers

| Sub-command     | Purpose                                                                     |
| --------------- | --------------------------------------------------------------------------- |
| `docs`          | Answer MF questions by fetching only the relevant page from `llms.txt`       |
| `context`       | Collect the project's MF context (bundler, role, config, deps, artifacts)    |
| `module-info`   | Inspect a remote's manifest — publicPath, remoteEntry, types, exposes        |
| `integrate`     | Add provider / consumer MF config to an existing project                    |
| `type-check`    | Diagnose `@mf-types`, DTS generation, and tsconfig `paths` problems          |
| `runtime-types` | Fetch `@mf-types` when remotes are registered at runtime only                |
| `shared-deps`   | Detect shared/externals conflicts, `transformImport` breakage, multi-version |
| `perf`          | Local dev performance: build speed, HMR, DTS bottlenecks                     |
| `config-check`  | Verify MF plugin choice, async entry, and `exposes` key/path correctness     |
| `bridge-check`  | Verify Bridge producer `export-app` and consumer API usage                   |
| `runtime-error` | Diagnose `RUNTIME-001` / `RUNTIME-008` remote entry failures                 |

## Usage

Ask naturally — the skill detects intent — or pass a sub-command explicitly:

```
mf config-check
mf module-info provider
mf runtime-error RUNTIME-008
mf why is my remote loading two copies of react?
```

## Structure

```
module-federation/
├── README.md            # This file
├── SKILL.md             # Entry point + intent routing table
├── reference/           # One file per sub-skill, loaded on demand
└── scripts/             # Node check scripts invoked by the reference files
```

## Script conventions

- All scripts are CommonJS (`require`) except `browser-capture.mjs`, which is ESM and needs Node 21+.
- Every check script takes `--context '<MFContext-JSON>'` and prints `{ context, results }` to stdout.
- The `MFContext` shape is defined in [reference/context.md](reference/context.md) — keep scripts and
  that file in sync when adding fields.
- Reference files call scripts via `<skill-dir>/scripts/...`; `<skill-dir>` is resolved in
  [SKILL.md](SKILL.md) Step 0 so the skill works from this repo, a subtree, or a local override.

## Requirements

- Node.js 18+ for the check scripts (Node 21+ for `browser-capture.mjs`)
- Internet access for the `docs` and `module-info` sub-skills
- `@module-federation/enhanced` `2.3.0+` is recommended for accurate runtime error reporting
