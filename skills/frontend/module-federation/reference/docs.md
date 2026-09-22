# Sub-skill: docs

Answer Module Federation questions by fetching only the relevant documentation pages — not the entire docs.

Requires internet access to fetch documentation from module-federation.io.

## Step 1: Fetch the documentation index

```
https://module-federation.io/llms.txt
```

The index is in this format:

```
## Section Name
- [Page Title](/path/to/page.md): brief description of the page content
```

## Step 2: Identify the relevant page(s)

Read the page descriptions in the index and select the 1–3 pages most relevant to the user's question. Use the quick topic map below to narrow down candidates before reading descriptions.

**Quick topic map:**

| User asks about                                                                        | Look in section                                      |
| -------------------------------------------------------------------------------------- | ---------------------------------------------------- |
| What is MF / concepts / glossary / getting started                                     | `Guide` → `start/`                                   |
| CLI, CSS isolation, type hints, manifest & snapshot                                    | `Guide` → `basic/`                                   |
| Runtime API, `loadRemote`, MF instance, runtime hooks, runtime plugins                 | `Guide` → `runtime/`                                 |
| Bridge, `createBridgeComponent`, `createRemoteAppComponent`, `createLazyComponent`     | `Guide` → `bridge/`                                  |
| Data fetching, data cache, prefetch                                                    | `Guide` → `data/`                                    |
| Tree shaking, multiple share scopes, runtime size, manifest/stats field reference      | `Guide` → `advanced/`                                |
| Debug mode, Chrome DevTool, Divebell, global variables                                 | `Guide` → `debug/`                                   |
| Error codes, runtime / build / type errors                                             | `Guide` → `troubleshooting/`                         |
| Deployment, Zephyr                                                                     | `Guide` → `deployment/`                              |
| Build plugin setup for Rsbuild / Rslib / Rstest / Vite                                 | `Integrations` → `build-tool/`                       |
| Bundler setup for Rspack / Webpack / Metro                                             | `Integrations` → `bundler/`                          |
| Modern.js / Next.js / Angular integration                                              | `Integrations` → `framework/`                        |
| Monorepo, Nx                                                                           | `Integrations` → `framework/monorepos/`              |
| React practice, i18n, CRA, Vue Bridge                                                  | `Integrations` → `practice/`                         |
| `name`, `filename`, `exposes`, `remotes`, `shared`, `dts`, `manifest`, `shareStrategy` | `Configuration`                                      |
| Retry plugin, observability plugin, node plugin, custom plugin authoring               | `Plugins`                                            |
| Async startup, release notes, MF 2.0 background                                        | `Blog`                                               |

## Step 3: Fetch the specific page(s)

Construct the URL by removing the `.md` extension from the path in the index, then prepend the base URL:

```
https://module-federation.io{path_without_md_extension}
```

**Examples:**

- `/guide/start/index.md` → `https://module-federation.io/guide/start/index`
- `/configure/shared.md` → `https://module-federation.io/configure/shared`
- `/guide/runtime/runtime-api.md` → `https://module-federation.io/guide/runtime/runtime-api`

Fetch the page(s) and read the content.

## Step 4: Answer the question

Answer based on the fetched content. If the answer spans multiple pages (e.g., config + runtime), fetch both. Do not load more than 3 pages per question.

## Important notes

- Always fetch the index first — never guess page paths from memory
- The section names above reflect the current site; if the index disagrees, trust the index
- If the index descriptions are insufficient to identify the right page, fetch the most likely candidate and check its content
- The docs cover MF 2.0 (`@module-federation/enhanced`) — this is different from the older Webpack 5 built-in Module Federation
- `@module-federation/nextjs-mf` is in maintenance mode and only supports the Pages Router; mention this if the user asks about Next.js
