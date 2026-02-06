---
name: Frontend Code Standards
description: Code standards and conventions for React, TypeScript, and domain-driven front-end architecture
---

# Frontend Code Standards

Opinionated code standards for building scalable, maintainable front-end applications with React, TypeScript, and Clean Architecture principles.

## 🎯 Token Budget Guide

**Quick tasks** (50-150 tokens):

- Naming lookup → [quick-ref/naming-cheatsheet.md](quick-ref/naming-cheatsheet.md)
- Simple validation → Pick specific rule from navigation below

**Medium tasks** (200-500 tokens):

- New component → [rules/react-naming.md](rules/react-naming.md) + [rules/react-component-structure.md](rules/react-component-structure.md)
- Helper function → [rules/helper-function-patterns.md](rules/helper-function-patterns.md)
- TypeScript types → [rules/typescript-best-practices.md](rules/typescript-best-practices.md)

**Complex tasks** (500-1000 tokens):

- Architecture refactor → [rules/clean-architecture.md](rules/clean-architecture.md) + [rules/solid-principles.md](rules/solid-principles.md)
- Performance optimization → [rules/dom-performance.md](rules/dom-performance.md) + [rules/caching-strategies.md](rules/caching-strategies.md)
- Clean Code review → [rules/clean-code-principles.md](rules/clean-code-principles.md) + [rules/solid-principles.md](rules/solid-principles.md)

---

## 🚀 Auto-Trigger Patterns

**This skill should be loaded when:**

- Creating `.tsx`, `.ts`, `.jsx`, or `.js` files in a React project
- User mentions: "component", "create", "refactor", "naming", "structure"
- Code review or standards discussion
- User mentions: "SOLID", "Clean Code", "Clean Architecture", "DDD"
- Performance optimization tasks
- User mentions: "TypeScript", "types", "interfaces"

**File patterns that trigger specific rules:**

- `*.tsx` → Load react-naming.md + react-component-structure.md
- Helper/utility files → Load helper-function-patterns.md
- Domain/entity files → Load ddd-naming.md + clean-architecture.md
- Performance issues → Load dom-performance.md + caching-strategies.md

**Keywords:**
`component`, `naming`, `convention`, `structure`, `SOLID`, `SRP`, `DRY`, `architecture`, `Clean Code`, `TypeScript`, `interface`, `type`, `helper`, `utility`, `performance`, `optimization`

---

**Navigate to specific topics:**

## 📝 Naming Conventions

### React Naming

→ See [rules/react-naming.md](rules/react-naming.md)

Use when:

- Creating React components
- Setting up hooks
- Organizing component folders

Covers:

- Component naming (PascalCase)
- Hook naming (camelCase with 'use' prefix)
- Feature directories (kebab-case)
- Composite component folders

## ⚛️ React Component Structure

→ See [rules/react-component-structure.md](rules/react-component-structure.md)

Use when:

- Creating React components
- Refactoring component files
- Deciding where to place helper functions

Covers:

- Function declarations vs const (avoid React.FC)
- Single Responsibility Principle
- Component file organization
- When to extract helpers vs keep them inline
- Anti-patterns (god components, mixing concerns)

### TypeScript Naming

→ See [rules/typescript-naming.md](rules/typescript-naming.md)

Use when:

- Defining types and interfaces
- Creating utility functions or classes

Covers:

- Types and interfaces (PascalCase)
- Functional vs class-based utilities
- File naming for utilities

### Domain-Driven Design Naming

→ See [rules/ddd-naming.md](rules/ddd-naming.md)

Use when:

- Building domain layer (Clean Architecture)
- Defining entities, value objects, aggregates
- Creating repositories and use cases

Covers:

- Entities and value objects (PascalCase)
- Domain services and repositories
- Aggregates and use cases
- Ubiquitous language principles

## 📐 General Coding Standards

→ See [rules/general-coding-standards.md](rules/general-coding-standards.md)

Use when:

- Writing or reviewing any source code
- Designing function signatures
- Refactoring for readability

Covers:

- Function design (naming, parameters, size)
- Command-Query Separation
- Control flow (early returns, avoiding deep nesting)
- Code organization and style
- Magic numbers, comments, variable scope

## 🛠️ Helper Function Patterns

→ See [rules/helper-function-patterns.md](rules/helper-function-patterns.md)

Use when:

- Creating utility functions
- Organizing formatters, validators, parsers, calculations
- Deciding when to extract a helper

Covers:

- Common helper categories (formatters, validators, parsers, guards)
- Function design for helpers (pure functions, simple signatures)
- Organization patterns (flat, categorized, barrel exports)
- Testing helpers
- Anti-patterns to avoid

## 🔷 TypeScript Best Practices

→ See [rules/typescript-best-practices.md](rules/typescript-best-practices.md)

Use when:

- Writing TypeScript code
- Choosing between type and interface
- Deciding on type annotations

Covers:

- Type safety (unknown vs any)
- Type inference (when to skip return types)
- Interface vs type guidelines
- Utility types (Partial, Pick, Omit, etc.)
- JSDoc documentation patterns

## 🧹 Clean Code Principles

→ See [rules/clean-code-principles.md](rules/clean-code-principles.md)

Use when:

- Writing any code
- Creating functions
- General refactoring

Covers:

- Meaningful names (reveal intent)
- Functions do one thing
- Prefer exceptions over error codes
- DRY (Don't Repeat Yourself)
- Small functions (5-20 lines)
- Avoid side effects (Command-Query Separation)

## 🔶 SOLID Principles

→ See [rules/solid-principles.md](rules/solid-principles.md)

Use when:

- Designing class hierarchies
- Creating reusable components
- Refactoring classes

Covers:

- Single Responsibility Principle
- Open/Closed Principle
- Liskov Substitution Principle
- Interface Segregation Principle
- Dependency Inversion Principle

## 🏛️ Clean Architecture

→ See [rules/clean-architecture.md](rules/clean-architecture.md)

Use when:

- Structuring application layers
- Implementing domain-driven design
- Separating business logic from frameworks

Covers:

- Layer architecture (Entities, Use Cases, Adapters, Frameworks)
- Dependency rules (dependencies point inward)
- Framework independence
- Testability patterns
- Folder structure examples

## ⚡ JavaScript Performance

Performance optimization patterns for hot paths and frequently-executed code.

### DOM & Browser

→ See [rules/dom-performance.md](rules/dom-performance.md)

Use when working with DOM manipulation and browser APIs:

- Layout thrashing prevention
- Batching reads/writes

### Caching Strategies

→ See [rules/caching-strategies.md](rules/caching-strategies.md)

Use when optimizing expensive operations:

- Property access in loops
- Repeated function calls
- Storage API calls (localStorage, cookies)

### Data Structures

→ See [rules/data-structures.md](rules/data-structures.md)

Use when choosing data structures for performance:

- Index maps for repeated lookups
- Set/Map for O(1) membership checks

### Array Optimization

→ See [rules/array-optimization.md](rules/array-optimization.md)

Use when working with arrays:

- Combining multiple iterations
- Early length checks for comparisons
- Min/max without sorting
- Immutable operations (toSorted)

### Control Flow

→ See [rules/control-flow-optimization.md](rules/control-flow-optimization.md)

Use when optimizing function logic:

- Early returns
- RegExp hoisting
- Guard clauses

---

## Quick Reference

### Naming Summary

| Concept                    | Naming     | See Also                                 |
| -------------------------- | ---------- | ---------------------------------------- |
| Feature folders            | kebab-case | [React](rules/react-naming.md)           |
| Composite component folder | PascalCase | [React](rules/react-naming.md)           |
| React components           | PascalCase | [React](rules/react-naming.md)           |
| Hooks                      | camelCase  | [React](rules/react-naming.md)           |
| Functional utils           | kebab-case | [TypeScript](rules/typescript-naming.md) |
| Utility classes / services | PascalCase | [TypeScript](rules/typescript-naming.md) |
| Domain entities & types    | PascalCase | [DDD](rules/ddd-naming.md)               |

### Helper Categories

| Type       | Purpose                | Example                             |
| ---------- | ---------------------- | ----------------------------------- |
| Formatter  | Display transformation | `formatCurrency`, `formatDate`      |
| Validator  | Data validation        | `isValidEmail`, `isRequired`        |
| Parser     | Format conversion      | `parseISODate`, `parseJSON`         |
| Calculator | Business logic         | `calculateDiscount`, `calculateTax` |
| Guard      | Type narrowing         | `isError`, `isDefined`              |

See [helper-function-patterns.md](rules/helper-function-patterns.md) for details.

### Performance Quick Tips

**DOM:** Batch DOM reads/writes to avoid layout thrashing  
**Caching:** Cache property access in loops, function results, storage APIs  
**Data Structures:** Use Map/Set for O(1) lookups instead of Array.find()  
**Arrays:** Combine iterations, check length before sorting, use toSorted()  
**Control Flow:** Return early, hoist RegExp, use guard clauses
