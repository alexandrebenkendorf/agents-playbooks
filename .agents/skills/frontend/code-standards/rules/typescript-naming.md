# TypeScript Naming Conventions

Naming conventions for TypeScript types, interfaces, and type-related constructs.

---

## General Principles

- Naming must communicate **intent**, not implementation details
- Type names should match their exported symbol names
- Consistency across the codebase is mandatory

---

## Types and Interfaces

- **MUST use PascalCase**

```ts
type UserId = string;
type UserRole = 'admin' | 'member' | 'guest';

interface User {
  id: UserId;
  role: UserRole;
}

interface UserRepository {
  findById(id: UserId): Promise<User | null>;
}
```

---

## Utilities

### Functional utilities (default choice)

- **kebab-case file names**
- Export **pure functions**

```ts
// utils/date-formatter.ts
export function formatDate(value: string): Date {}
```

**Use when:**

- No state
- No lifecycle
- Simple transformation or helper logic

### Class-based utilities (services)

- **PascalCase**
- Allowed when the utility represents a reusable **service or concept**

```ts
// utils/DateFormatter.ts
export class DateFormatter {
  toDate() {}
}
```

**Use when:**

- Stateful or potentially stateful
- Injectable or mockable
- Represents a formatter, parser, validator, or service abstraction

---

## Summary

| Concept                    | Naming     |
| -------------------------- | ---------- |
| Types & Interfaces         | PascalCase |
| Type aliases               | PascalCase |
| Functional utils           | kebab-case |
| Utility classes / services | PascalCase |

---

## Rationale

These conventions align with:

- TypeScript naming conventions
- Type/value distinction clarity
- Discoverability and readability
