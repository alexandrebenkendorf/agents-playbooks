---
name: Vitest Testing Guidelines
description: Comprehensive testing guidelines for Vitest with React Testing Library
---

# Vitest Testing Guidelines

**Choose the right guide for your task:**

## 📝 Creating New Tests

→ See [rules/new-tests.md](rules/new-tests.md)

Use when:

- Writing tests for new components or utilities
- Need modern testing patterns and examples
- Starting from scratch

## 🔄 Refactoring Legacy Tests

→ See [rules/legacy-refactoring.md](rules/legacy-refactoring.md)

Use when:

- Converting old tests to modern patterns
- Replacing Sinon with Vitest
- Migrating from old Testing Library patterns
- Need step-by-step refactoring checklist

## 📘 TypeScript Guidelines

→ See [rules/typescript.md](rules/typescript.md)

Use when:

- Converting tests to TypeScript
- Need TypeScript-specific patterns
- Writing type-safe test utilities

## 🎯 Common Patterns & Reference

→ See [rules/common-patterns.md](rules/common-patterns.md)

Use anytime for:

- Quick reference of common mistakes
- Testing best practices
- Mocking patterns
- User interaction examples
- Global setup information

---

## 🎯 Token Budget Guide

**Quick tasks** (50-150 tokens):

- Simple lookup → [quick-ref/testing-cheatsheet.md](quick-ref/testing-cheatsheet.md)
- Common patterns → [quick-ref/testing-cheatsheet.md](quick-ref/testing-cheatsheet.md)

**Medium tasks** (200-400 tokens):

- New test file → [rules/new-tests.md](rules/new-tests.md)
- TypeScript conversion → [rules/typescript.md](rules/typescript.md)

**Complex tasks** (400-800 tokens):

- Legacy refactoring → [rules/legacy-refactoring.md](rules/legacy-refactoring.md) + [rules/typescript.md](rules/typescript.md)
- Complete test suite → [rules/new-tests.md](rules/new-tests.md) + [rules/common-patterns.md](rules/common-patterns.md)

---

## 🚀 Auto-Trigger Patterns

**This skill should be loaded when:**

- Creating `.test.ts` or `.test.tsx` files
- User mentions: "test", "write tests", "add tests", "test coverage"
- Modifying existing test files
- User mentions: "vitest", "react testing library", "RTL"
- Converting/refactoring: "migrate tests", "update tests", "refactor tests"

**File patterns that trigger this skill:**

- `*.test.ts`, `*.test.tsx`, `*.test.js`, `*.test.jsx`
- `*.spec.ts`, `*.spec.tsx`
- Files in `__tests__/` directory

**Keywords:**
`test`, `vitest`, `expect`, `describe`, `it`, `mock`, `spy`, `render`, `screen`, `userEvent`, `waitFor`, `assertion`

---

## Test File Strategy: When to Use TypeScript vs JavaScript

### Creating New Test Files

✅ **Always use TypeScript** (`.test.ts` or `.test.tsx`)

- Follow modern patterns from [rules/new-tests.md](rules/new-tests.md)
- Use `testRender`, `testRenderAdmin` helpers
- No need to import `describe`, `expect`, `it`, `vi` (they're global)

### Refactoring/Converting Existing Test Files

✅ **Use TypeScript** and apply modern patterns

- Convert `.test.js`/`.test.jsx` → `.test.ts`/`.test.tsx`
- Follow [rules/legacy-refactoring.md](rules/legacy-refactoring.md)
- Apply all modern best practices

### Extending Existing Test Files (Adding Tests/Assertions)

⚠️ **PROMPT THE USER FIRST:**

When asked to add tests to an existing file, ask:

```
I see this test file uses [JavaScript/TypeScript] with [legacy/modern] patterns.
Would you like me to:
1. Add new tests only:
   a) Following the modern approach (less tech debt, recommended)
   b) Following the current file's approach (faster, maintains consistency)
2. Refactor the entire file to modern TypeScript patterns (comprehensive, but takes longer)

Which approach would you prefer?
```

**If user chooses option 1a (modern approach):**

- Add new tests using patterns from [rules/new-tests.md](rules/new-tests.md)
- Use TypeScript syntax for new tests
- Import from `@/test`
- Existing tests remain unchanged

**If user chooses option 1b (match current approach):**

- Follow the file's existing patterns (imports, style, syntax)
- Keep the same language (JS or TS)
- Maintain consistency with existing tests in the file

**If user chooses option 2 (modern refactor):**

- Convert to TypeScript using [rules/typescript.md](rules/typescript.md)
- Apply all modern patterns from [rules/legacy-refactoring.md](rules/legacy-refactoring.md)
- Refactor all tests in the file

## Quick Reference

### Running Tests

- **Run all tests**: `npm run test --run`
- **Run specific test file**: `npm run test -- current/src/.../about.test.jsx --run`
- **Run by filename shorthand**: `npm run test -- about.test.jsx --run`

### File Naming

- **Use `.test.jsx` extension** for new Vitest tests (not `.vitest.jsx`)
- **Future migration**: All existing `.vitest.jsx` files will be renamed to `.test.jsx`
