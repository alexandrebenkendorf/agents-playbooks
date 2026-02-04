# TypeScript Best Practices

TypeScript-specific patterns and conventions for cleaner, safer code.

---

## Type Safety

### Use unknown Instead of any

Prefer `unknown` with type assertions over `any` for better type safety.

```ts
// ✅ Do - Use unknown with type assertion
const fileUpload = element.querySelector('.file-upload') as unknown as {
  dropzone: { files: unknown[] }
}

// ❌ Don't - Using any
const fileUpload = element.querySelector('.file-upload') as any
```

**Rule of thumb:**
> Use `unknown` with type assertions whenever you're tempted to use `any`.
> Use `any` with `@ts-expect-error` only when you explicitly want to turn off type checking.

**Rare exception - use any with @ts-expect-error:**

```ts
// @ts-expect-error - Third-party library has incompatible types that cannot be safely cast
const fileUpload = element.querySelector('.file-upload') as any
```

---

## Type Inference

### Let TypeScript Infer Return Types (by default)

Avoid explicit return types for **internal implementation** functions. Let TypeScript infer them.

```ts
// ❌ Don't (usually unnecessary for internal code)
function calculateTotal(items: Item[]): number {
  return items.reduce((sum, item) => sum + item.price, 0)
}

function logMessage(message: string): void {
  console.log(message)
}

// ✅ Do
function calculateTotal(items: Item[]) {
  return items.reduce((sum, item) => sum + item.price, 0)
}

function logMessage(message: string) {
  console.log(message)
}
```

**Why?**
- Keeps code cleaner and less verbose
- Reduces duplication between signature and implementation
- Avoids type mismatches when implementation changes
- Leverages TypeScript inference effectively

**Use explicit return types when:**
- The function is **exported** (module boundary / public contract)
- The inferred return type is too complex to read
- You want to enforce a specific contract (e.g., `Promise<Result<T>>`)
- You're writing framework callbacks where an explicit signature improves clarity

**Example of when to use explicit return types:**

```ts
// ✅ Public API - explicit return type documents the contract
export function fetchUserData(userId: string): Promise<User | null> {
  return fetch(`/api/users/${userId}`)
    .then(res => res.json())
    .catch(() => null)
}

// ✅ Internal helper - inferred return type is sufficient
function parseResponse(res: Response) {
  return res.json()
}
```

---

## Type vs Interface

### Use interface for object shapes

```ts
// ✅ Do
interface User {
  id: string
  name: string
  email: string
  role?: 'admin' | 'user'
}

interface ApiResponse<T> {
  data: T
  status: number
  message?: string
}
```

### Use type for unions, tuples, and primitives

```ts
// ✅ Do - Unions
type Status = 'pending' | 'approved' | 'rejected'
type ID = string | number

// ✅ Do - Tuples
type Coordinates = [latitude: number, longitude: number]
type TestCase = [description: string, input: unknown, expected: unknown]

// ✅ Do - Primitives and aliases
type UserId = string
type Timestamp = number
```

### Why prefer interface for objects?

1. **Declaration merging** - Can extend/augment interfaces
2. **Better error messages** - TypeScript shows clearer errors
3. **Performance** - Slightly faster type-checking
4. **Cleaner extends syntax** - `interface Dog extends Animal` vs `type Dog = Animal & {...}`

---

## Utility Types

### Prefer Nullable<T> for null | undefined

```ts
// ✅ Do
function getUser(id?: Nullable<string>) {
  // ...
}

// ❌ Don't
function getUser(id?: string | null | undefined) {
  // ...
}
```

### Use Built-in Utility Types

```ts
// Partial - make all properties optional
type PartialUser = Partial<User>

// Pick - select specific properties
type UserPreview = Pick<User, 'id' | 'name'>

// Omit - exclude specific properties
type UserWithoutPassword = Omit<User, 'password'>

// Required - make all properties required
type RequiredConfig = Required<Config>

// Record - create object type with specific keys
type UserRoles = Record<string, 'admin' | 'user' | 'guest'>
```

---

## Documentation

### Add JSDoc for Complex Functions

Add comprehensive JSDocs to utilities, helpers, and non-obvious functions:

```ts
/**
 * Calculates the discounted price based on the discount percentage.
 * 
 * @param price - The original price
 * @param discount - Discount as a decimal (0.1 = 10% off). Must be between 0 and 1.
 * @returns The final price after discount
 * 
 * @example
 * ```ts
 * getDiscountedPrice(100, 0.2) // Returns 80
 * ```
 */
function getDiscountedPrice(price: number, discount?: number) {
  if (discount == null) {
    return price
  }

  if (discount <= 0 || discount >= 1) {
    return price
  }

  return price * (1 - discount)
}
```

**When to add JSDoc:**
- Public API functions
- Complex business logic
- Functions with non-obvious parameters
- Utility functions used across the codebase

**When to skip JSDoc:**
- Self-explanatory functions
- Private implementation details
- Simple getters/setters
