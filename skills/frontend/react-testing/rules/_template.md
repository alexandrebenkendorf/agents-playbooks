---
title: Rule Title Here
impact: MEDIUM
impactDescription: Optional description of impact
tags: vitest, react-testing-library, testing
---

## Rule Title Here

**Impact: MEDIUM**

Brief explanation of the testing rule and why it matters for test quality and maintainability.

**Incorrect (anti-pattern):**

```typescript
// Bad test example
it('should work', () => {
  const bad = example();
  expect(bad).toBeTruthy();
});
```

**Correct (recommended pattern):**

```typescript
// Good test example
it('should return user data when ID exists', () => {
  const good = example();
  expect(good).toEqual({ name: 'John', id: 1 });
});
```

Reference: [Testing Library Docs](https://testing-library.com)
