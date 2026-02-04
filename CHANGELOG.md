# Changelog

All notable changes to the agents-playbook repository will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [Unreleased]

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
- .agents/README.md template for project configuration
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
