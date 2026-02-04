# Helper Function Patterns

Common patterns and best practices for creating helper functions and utility modules.

---

## When to Create a Helper

Extract a helper when:
- Logic is reused in 2+ places
- A function performs a clear, single transformation
- Domain logic needs isolation from UI concerns
- Testing complex logic in isolation is valuable

Don't extract when:
- Used only once and unlikely to be reused
- Logic is tightly coupled to component state
- Extraction makes code harder to understand

---

## Function Design for Helpers

### 1. Name as Actions

Start with a verb to communicate purpose:

✅ **Good:**
```ts
formatCurrency(amount: number, locale: string): string
validateEmail(email: string): boolean
calculateDiscount(price: number, percentage: number): number
parseISODate(dateString: string): Date
```

❌ **Bad:**
```ts
currency(amount: number): string
email(value: string): boolean
discount(price: number, pct: number): number
date(str: string): Date
```

### 2. Keep Signatures Simple

Prefer up to **3 parameters**. Use an options object when more are needed.

```ts
// ❌ Too many parameters
function formatAddress(
  street: string,
  city: string,
  state: string,
  zip: string,
  country: string
): string

// ✅ Options object
interface AddressOptions {
  street: string
  city: string
  state: string
  zip: string
  country: string
}

function formatAddress(options: AddressOptions): string
```

### 3. Pure Functions

Helpers should be **pure** (same input → same output, no side effects):

```ts
// ✅ Pure function
function calculateTotal(items: Item[]): number {
  return items.reduce((sum, item) => sum + item.price, 0)
}

// ❌ Not pure (side effect)
let globalTax = 0
function calculateTotalWithTax(items: Item[]): number {
  const total = items.reduce((sum, item) => sum + item.price, 0)
  globalTax = total * 0.21  // Side effect!
  return total + globalTax
}
```

---

## Common Helper Categories

### 1. Formatters

Transform data for display:

```ts
// utils/formatters/currency.ts
export function formatCurrency(amount: number, currency = 'EUR'): string {
  return new Intl.NumberFormat('nl-NL', {
    style: 'currency',
    currency,
  }).format(amount)
}

// utils/formatters/date.ts
export function formatDate(date: Date, format = 'short'): string {
  return new Intl.DateTimeFormat('nl-NL', {
    dateStyle: format as 'short' | 'medium' | 'long',
  }).format(date)
}
```

### 2. Validators

Check if data meets criteria:

```ts
// utils/validators/email.ts
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

// utils/validators/required.ts
export function isRequired(value: unknown): boolean {
  if (typeof value === 'string') {
    return value.trim().length > 0
  }
  return value != null
}
```

### 3. Parsers

Convert from one format to another:

```ts
// utils/parsers/date.ts
export function parseISODate(dateString: string): Date {
  const date = new Date(dateString)
  if (Number.isNaN(date.getTime())) {
    throw new Error(`Invalid date string: ${dateString}`)
  }
  return date
}

// utils/parsers/query-string.ts
export function parseQueryString(search: string): Record<string, string> {
  return Object.fromEntries(new URLSearchParams(search))
}
```

### 4. Calculations

Perform mathematical or business logic:

```ts
// utils/calculations/discount.ts
export function calculateDiscount(price: number, percentage: number): number {
  if (percentage < 0 || percentage > 100) {
    throw new Error('Percentage must be between 0 and 100')
  }
  return price * (percentage / 100)
}

// utils/calculations/tax.ts
export function calculateTax(amount: number, rate = 0.21): number {
  return amount * rate
}
```

### 5. Guards / Type Predicates

Type-safe checks:

```ts
// utils/guards/is-error.ts
export function isError(value: unknown): value is Error {
  return value instanceof Error
}

// utils/guards/is-defined.ts
export function isDefined<T>(value: T | null | undefined): value is T {
  return value != null
}
```

---

## Organization Patterns

### Option 1: Flat Structure (Small Projects)

```txt
utils/
  formatCurrency.ts
  formatDate.ts
  validateEmail.ts
  parseQueryString.ts
```

### Option 2: Categorized (Medium Projects)

```txt
utils/
  formatters/
    currency.ts
    date.ts
  validators/
    email.ts
    required.ts
  parsers/
    date.ts
    query-string.ts
```

### Option 3: Barrel Exports (Large Projects)

```txt
utils/
  formatters/
    currency.ts
    date.ts
    index.ts  // export * from './currency'; export * from './date'
  validators/
    email.ts
    required.ts
    index.ts
  index.ts  // export * from './formatters'; export * from './validators'
```

---

## Testing Helpers

Helpers should be **easy to test** (pure functions with clear inputs/outputs):

```ts
// utils/formatters/currency.test.ts
import { describe, it, expect } from 'vitest'
import { formatCurrency } from './currency'

describe('formatCurrency', () => {
  it('formats EUR correctly', () => {
    expect(formatCurrency(1234.56, 'EUR')).toBe('€ 1.234,56')
  })

  it('formats USD correctly', () => {
    expect(formatCurrency(1234.56, 'USD')).toBe('$ 1.234,56')
  })

  it('handles zero', () => {
    expect(formatCurrency(0, 'EUR')).toBe('€ 0,00')
  })
})
```

---

## Quick Reference

| Helper Type | Purpose | Example |
|------------|---------|---------|
| Formatter | Display transformation | `formatCurrency`, `formatDate` |
| Validator | Data validation | `isValidEmail`, `isRequired` |
| Parser | Format conversion | `parseISODate`, `parseJSON` |
| Calculator | Business logic | `calculateDiscount`, `calculateTax` |
| Guard | Type narrowing | `isError`, `isDefined` |

---

## Anti-Patterns

### ❌ Don't create "utils hell"

Avoid dumping everything into `utils/`:

```ts
// ❌ Bad
utils/
  helpers.ts  // 500 lines of unrelated functions
```

### ❌ Don't create one-liner helpers

If it's trivial, inline it:

```ts
// ❌ Unnecessary abstraction
export function add(a: number, b: number): number {
  return a + b
}

// ✅ Just use it inline
const total = price + tax
```

### ❌ Don't mix concerns

Keep helpers focused on one responsibility:

```ts
// ❌ Mixed concerns
export function formatAndValidateEmail(email: string): string {
  if (!isValidEmail(email)) {
    throw new Error('Invalid email')
  }
  return email.toLowerCase()
}

// ✅ Separate concerns
export function validateEmail(email: string): void {
  if (!isValidEmail(email)) {
    throw new Error('Invalid email')
  }
}

export function normalizeEmail(email: string): string {
  return email.toLowerCase()
}
```

---

## Summary

**Good helpers are:**
- ✅ Pure (no side effects)
- ✅ Focused (single responsibility)
- ✅ Named as actions (verb-based)
- ✅ Easy to test
- ✅ Reusable across contexts

**Avoid:**
- ❌ Premature abstraction (DRY at 2+ uses, not 1)
- ❌ Side effects in helpers
- ❌ Overly generic utilities
- ❌ Dumping ground files
