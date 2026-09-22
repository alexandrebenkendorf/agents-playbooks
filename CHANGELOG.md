# Changelog

All notable changes to the agents-playbook repository will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [Unreleased]

### Added
- `frontend/module-federation` skill, vendored and adapted from the official Module Federation `mf` skill
  - `README.md` and catalog entries in `README.md` / `skills/README.md`
  - `SHARED-SUBPATH` check for packages shared by exact name only (`react` vs `react/`)
  - Observability Plugin / Divebell guidance as the preferred runtime evidence source
  - `runtime-types` sub-skill: fetching `@mf-types` when remotes are registered only at runtime
    (`dts.generateTypes: false` + `consumeTypes.remoteTypeUrls`, the `publicPath: 'auto'` pitfall,
    `mf dts` wrapper script, and `NODE_EXTRA_CA_CERTS` handling for mkcert / corporate CAs)
  - `RUNTIME_ONLY_SUSPECTED` type-check scenario that routes to the new sub-skill
  - `perf`: remote HMR (`dev.remoteHmr`) compatibility matrix — Vite host + Vite remote requires
    matching `@vitejs/plugin-react` / `vite` / `@module-federation/vite`, while Rspack/Webpack hosts
    serve compiled output and interoperate with any remote

### Fixed
- **module-federation**: flattened the extra `mf/` namespace to `skills/frontend/module-federation/`
- **module-federation**: reference files pointed at a non-existent `.agents/local/skills/module-federation/mf/scripts/` path; now resolved via `<skill-dir>` (SKILL.md Step 0)
- **module-federation**: `perf` recommended `dev.disableAssetsAnalyze`, which does not exist — the real option is `manifest.disableAssetsAnalyze`, and it disables resource preloading
- **module-federation**: `config-check` mapped async entry to `RUNTIME-006`; it is `RUNTIME-005`
- **module-federation**: `docs` topic map targeted the old documentation site structure
- **module-federation**: MFContext now documents `project.root`, `mfConfig.externals`, `bundler.experiments.asyncStartup`, and `buildArtifacts.*`, which the scripts already relied on
- **module-federation**: bundler detection no longer derives from the MF config filename (always yielded `unknown`)
- **module-federation**: `shared-config-check` read shared versions from `manifest.exposes` instead of `manifest.shared`
- **module-federation**: `module-info` returned an always-`undefined` `hasSsr`, a hardcoded `null` `typesApi`, and did not follow HTTP redirects
- **module-federation**: `integrate` listed `vite.config` in bundler detection but had no Vite branch, so Vite projects hit a dead end — added the `@module-federation/vite` pattern, plus Vite in context detection and the `CONFIG-PLUGIN` recommendation
- **module-federation**: `CONFIG-ASYNC-ENTRY` no longer fires for Vite or Next.js, where `experiments.asyncStartup` does not apply
- **module-federation**: `type-check` converted to CommonJS, tolerates JSONC `tsconfig.json`, and reports producer vs consumer type scenarios based on `mfRole`

### Planned
- Additional framework support (upon request)
- Additional performance patterns
- Backend/API testing patterns

---

## [1.0.0] - 2025-01-XX

### Added

**Frontend Skills:**
- `frontend/code-standards` (16 files, ~2500 lines)
  - React naming conventions (components, hooks, folders)
  - TypeScript naming conventions (types, interfaces, utilities)
  - DDD naming conventions (entities, value objects, repositories)
  - General coding standards (function design, control flow, DRY)
  - TypeScript best practices (type safety, inference, interface vs type)
  - Helper function patterns (formatters, validators, parsers, guards)
  - Clean Code principles (meaningful names, exceptions, small functions)
  - SOLID principles (SRP, OCP, LSP, ISP, DIP with examples)
  - Clean Architecture (4 layers, entities, use cases, adapters)
  - JavaScript performance patterns (DOM, caching, data structures, arrays, control flow)

- `frontend/react-best-practices` (47 files, ~3000 lines)
  - Vendored from [Vercel Labs agent-skills](https://github.com/vercel-labs/agent-skills)
  - Eliminating waterfalls (async patterns, Suspense, streaming)
  - Bundle size optimization (dynamic imports, tree-shaking, code splitting)
  - Server-side performance (caching, parallel fetching, ISR)
  - Re-render optimization (memo, useMemo, useCallback, state management)
  - Build performance (build cache, transpilation, minification)
  - Third-party integrations (analytics, monitoring, error tracking)
  - Assets and static content (image optimization, fonts, CSS-in-JS)

- `frontend/react-component-structure` (1 file, ~300 lines)
  - Function declarations vs const (avoid React.FC)
  - React.FC pitfalls (implicit children, ReactNode return type, generics)
  - Single Responsibility Principle for components
  - File organization (imports, constants, props, component, helpers, export)
  - When to extract helpers vs keep inline
  - Anti-patterns (god components, mixing concerns)

- `frontend/react-testing` (4 files, ~800 lines)
  - Creating new tests (AAA pattern, it.each, templates)
  - Legacy refactoring (Sinon → Vitest migration)
  - TypeScript testing patterns (type safety, generic utilities)
  - Common patterns and quick reference

**Git Skills:**
- `git/commit-conventions` (1 file, ~200 lines)
  - Generic Jira format with `<PREFIX>` placeholder
  - Conventional commit types (feat, fix, docs, refactor, etc.)
  - Atomic commit guidance (one logical change per commit)
  - AI assistant workflow (git diff analysis, unstaging recommendations)

**Documentation:**
- Repository README with skills catalog, usage guide, contributing guidelines
- README.md template for project configuration
- MIT License
- This CHANGELOG

### Token Efficiency

Achieved 60-75% token reduction for common tasks through modular skill structure:
- Creating component: 73% reduction (1500 → 400 tokens)
- Adding tests: 84% reduction (1240 → 200 tokens)
- Creating helper: 69% reduction (480 → 150 tokens)
- SOLID refactoring: 27% reduction (480 → 350 tokens)

### Framework Compatibility

- **Framework Agnostic:** code-standards (all files), git-commit-conventions
- **React Specific:** react-best-practices, react-component-structure, react-testing

---

## Version History Summary

| Version | Date | Key Changes |
|---------|------|-------------|
| 1.0.0 | 2025-01-XX | Initial release with 6 skills |

---

## Contributing

See [README.md](README.md#contributing) for contribution guidelines.

## Support

- **Issues:** https://github.com/alexandrebenkendorf/agents-playbook/issues
- **Discussions:** https://github.com/alexandrebenkendorf/agents-playbook/discussions
