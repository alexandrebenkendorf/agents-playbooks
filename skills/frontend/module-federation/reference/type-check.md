# Sub-skill: type-check

Diagnose Module Federation type issues across three categories:

1. Producer type file generation failures (TYPE-001)
2. Consumer failing to pull remote types
3. tsconfig not configured to consume remote types

> **Runtime-only remotes:** if this project registers remotes through the runtime API
> (`registerRemotes` / `init` / `loadRemote`) instead of declaring them in the build config, the
> scenarios below do not apply — the DTS pipeline never discovers those producers. Read and follow
> `./runtime-types.md` instead.

## Step 1: Collect MFContext

Read and follow the instructions in `./context.md`, passing ARGS as the project root.

## Step 2: Run type check script

Serialize MFContext to JSON and pass it to the check script:

```bash
node <skill-dir>/scripts/type-check.js --context '<MFContext-JSON>'
```

Process each item in the output `results` array and follow the action plan based on the `scenario` field.

The script is role-aware: it only reports `TYPE_GENERATION_FAILED` for producers (`mfRole` of `remote` / `host+remote`) and `TYPES_NOT_PULLED` for consumers (`host` / `host+remote`). If `mfRole` is `unknown`, confirm the role with the user before acting.

---

### Scenario: `TYPE_GENERATION_FAILED` (Problem 1 — Producer type files not generated)

The producer failed to generate type files (TYPE-001 error).

**If `enhancedVersion` > `2.0.1`** (result field `canReadDiagnostics: true`):

1. Read `.mf/diagnostics/latest.json` to get full error info and the temporary TS config path
2. Use the temp TS config path with `npx tsc --project <tmp-tsconfig>` to reproduce errors
3. Fix the TS errors revealed. Refer to FAQ: https://module-federation.io/guide/troubleshooting/type.md
4. Offer `"skipLibCheck": true` as a temporary workaround if errors are complex

**If `enhancedVersion` <= `2.0.1`** (result field `canReadDiagnostics: false`):

1. Ask the user to run `npx mf dts` and paste the terminal output (which includes the temp TS config path)
2. Or ask them to copy the error message that contains the temp TS config path
3. Once the temp TS config path is known, run `npx tsc --project <tmp-tsconfig>` to reproduce and fix errors
4. Offer `"skipLibCheck": true` as a temporary workaround

---

### Scenario: `TYPES_NOT_PULLED` (Problem 2 — Consumer not pulling remote types)

The `@mf-types` folder is missing. Remote types have not been downloaded.

1. Read and follow `./module-info.md` with the remote module name to retrieve the type file URL (`@mf-types.zip`)
   - If **no URL returned**: the producer has not configured the type file URL or has not generated types. Guide them to enable `dts` in the `@module-federation/enhanced` plugin config, then revisit **Problem 1**
   - If **URL found**: attempt to fetch it (or ask the user to verify in browser)
     - **URL inaccessible**: try fetching the `remoteEntry` URL
       - `remoteEntry` **unreachable**: producer deployment is broken or URL is misconfigured; ask user to verify deployment
       - `remoteEntry` **reachable**: type file generation failed or wasn't deployed; ask user to provide local producer path and proceed to **Problem 1**
     - **URL accessible**: types were generated and deployed; the issue is in tsconfig — proceed to **Problem 3**

---

### Scenario: `TSCONFIG_PATHS_MISSING` (Problem 3 — tsconfig not configured for remote types)

The `@mf-types` folder exists but TypeScript cannot find the types because `tsconfig.json` is missing the `paths` mapping.

1. Open `tsconfig.json` and add the following to `compilerOptions.paths`:
   ```json
   {
     "compilerOptions": {
       "paths": {
         "*": ["./@mf-types/*"]
       }
     }
   }
   ```
2. If `paths` already exists, merge the new entry without overwriting existing mappings
3. After updating, run `npx tsc --noEmit` to verify the type errors are resolved

---

### Scenario: `RUNTIME_ONLY_SUSPECTED` (remotes registered at runtime)

`@mf-types` is missing and the build config declares neither `remotes` nor `exposes`. The DTS
pipeline has nothing to discover, so no amount of fixing tsconfig will help.

Read and follow `./runtime-types.md`.

---

### Scenario: `ENV_INCOMPLETE` (Missing tsconfig or TypeScript)

**TYPE-001 · warning — `tsconfig.json` missing**

- `tsconfig.json` not found in the project root
- Advise the user to create `tsconfig.json` and configure producer type paths in `paths`

**TYPE-001 · warning — `typescript` dependency missing**

- `typescript` not installed in `dependencies` / `devDependencies`
- Prompt the user to install: `pnpm add -D typescript`

---

> This sub-skill performs configuration and dependency-level checks. It runs `npx tsc` only when guided by a valid temp TS config path. It never runs `tsc` blindly against the entire project.
