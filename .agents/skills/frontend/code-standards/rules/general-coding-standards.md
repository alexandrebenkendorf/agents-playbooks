# General Coding Standards

Repository-wide conventions for code structure, function design, side effects, and readability.

**Note:** For naming conventions (React, TypeScript, DDD), see the [naming-conventions.md](naming-conventions.md) file.

---

## Language & Clarity

- Write all source code in **English** (identifiers, strings, and documentation where applicable)
- Prefer clear names over abbreviations, but keep identifiers reasonably sized (avoid > 30 characters)
- Replace magic numbers with well-named constants

---

## Function Design

### Prefer Named Functions Over Arrow Functions

Use named function declarations for better debugging and readability.

```ts
// ❌ Don't
const handler = () => { /* ... */ }

// ✅ Do
function handleRequest() { /* ... */ }
```

**Edge cases where arrow functions are preferred:**
- When you don't want hoisting
- When lexical `this` matters
- Intentionally ephemeral functions (e.g., `array.map(item => transform(item))`)
- Closures to capture state

### Name Functions as Actions

Start with a verb to communicate what the function does:

✅ **Good:**
```ts
calculateTotal()
fetchUser()
validateToken()
markAsCompleted()
```

❌ **Bad:**
```ts
total()
user()
validation()
completed()
```

### Keep Signatures Simple

Prefer up to **3 parameters**. Use an options object when more parameters are required.

#### Too many parameters → options object

```ts
// ❌ Don't
function createBooking(
  memberId: string,
  unitId: string,
  checkIn: Date,
  checkOut: Date,
  price: number,
  currency: string
) {
  // ...
}

// ✅ Do
interface CreateBookingOptions {
  memberId: string
  unitId: string
  checkIn: Date
  checkOut: Date
  price: number
  currency: string
}

function createBooking(options: CreateBookingOptions) {
  const { memberId, unitId, checkIn, checkOut, price, currency } = options
  // ...
}
```

### Avoid Flag Parameters

Extract separate functions with specific behavior instead of boolean switches that change behavior.

```ts
// ❌ Don't
function formatPrice(value: number, useCurrencySymbol: boolean) {
  return useCurrencySymbol ? `€${value}` : `${value}`
}

// ✅ Do
function formatPriceWithSymbol(value: number) {
  return `€${value}`
}

function formatPricePlain(value: number) {
  return `${value}`
}
```

---

## Separation of Concerns

### Command-Query Separation

Functions should either **mutate** (command) or **query** (return data), but not both.

**A query must not cause side effects.**

```ts
// ✅ Query (no side effects)
function getUserDisplayName(user: { firstName: string; lastName: string }) {
  return `${user.firstName} ${user.lastName}`
}

// ✅ Command (mutates)
function markUserAsActive(user: { isActive: boolean }) {
  user.isActive = true
}

// ❌ Don't mix both
function getUserNameAndMarkActive(user: User) {
  user.isActive = true  // Side effect in a query!
  return `${user.firstName} ${user.lastName}`
}
```

---

## Control Flow

### Prefer Early Returns

Avoid nesting deeper than two `if/else` levels. Use guard clauses and early returns.

```ts
// ❌ Deeply nested
function getDiscountedPrice(price: number, discount?: number) {
  if (discount != null) {
    if (discount > 0) {
      if (discount < 1) {
        return price * (1 - discount)
      } else {
        return 0
      }
    } else {
      return price
    }
  } else {
    return price
  }
}

// ✅ Early returns
function getDiscountedPrice(price: number, discount?: number) {
  if (discount == null) {
    return price
  }

  if (discount <= 0) {
    return price
  }

  if (discount >= 1) {
    return 0
  }

  return price * (1 - discount)
}
```

### Avoid Else Clauses

In 99% of cases, you don't need `else` if you use early returns properly.

```ts
// ❌ Don't chain if/else
function getUserRole(user: User): string {
  if (user.isAdmin) {
    return 'admin'
  } else if (user.isModerator) {
    return 'moderator'
  } else if (user.isPremium) {
    return 'premium'
  } else {
    return 'user'
  }
}

// ✅ Do use early returns (no else needed)
function getUserRole(user: User): string {
  if (user.isAdmin) {
    return 'admin'
  }
  
  if (user.isModerator) {
    return 'moderator'
  }
  
  if (user.isPremium) {
    return 'premium'
  }
  
  return 'user'
}
```

**Why avoid else?**
- Reduces cognitive load (no need to mentally track else conditions)
- Each condition stands on its own
- Natural flow: handle special cases first, default case last
- Easier to add/remove conditions without restructuring

**Exception:** Simple ternary for straightforward either/or logic is fine:
```ts
const status = isActive ? 'active' : 'inactive'
```

---

## Code Size & Organization

### Keep Code Small and Focused

- **Functions:** Avoid longer than ~50 lines
- **Classes:** Avoid longer than ~300 lines
- **Extract helpers** over long methods or deep nesting

### Variable Scope

Declare variables as close as possible to where they are used.

```ts
// ❌ Don't declare early
function processOrder(orderId: string) {
  const userId = getCurrentUserId()
  const timestamp = Date.now()
  const logger = getLogger()
  
  // ... 20 lines of other code
  
  // userId finally used here
  const order = getOrder(orderId, userId)
}

// ✅ Do declare close to usage
function processOrder(orderId: string) {
  // ... other code
  
  const userId = getCurrentUserId()
  const order = getOrder(orderId, userId)
}
```

---

## Code Style

### Variable Declarations

Don't write multiple variable declarations on the same line.

```ts
// ❌ Don't
const x = 1, y = 2, z = 3

// ✅ Do
const x = 1
const y = 2
const z = 3
```

### Blank Lines in Functions

Don't add blank lines inside functions/methods. Keep flow tight and readable.

```ts
// ❌ Don't
function calculateTotal(items: Item[]) {
  const subtotal = items.reduce((sum, item) => sum + item.price, 0)
  
  const tax = subtotal * 0.21
  
  const total = subtotal + tax
  
  return total
}

// ✅ Do
function calculateTotal(items: Item[]) {
  const subtotal = items.reduce((sum, item) => sum + item.price, 0)
  const tax = subtotal * 0.21
  const total = subtotal + tax
  return total
}
```

### Single-Line Statements

Always use braces for control structures, even for single statements.

```ts
// ❌ Don't
if (isTrue) doSomething()

// ✅ Do
if (isTrue) {
  doSomething()
}
```

### Comments

Don't use comments unless they explain **why** something exists. Prefer self-explanatory code.

```ts
// ❌ Don't explain what (code should be clear)
// Get the user's full name
const fullName = `${user.firstName} ${user.lastName}`

// ✅ Do explain why when necessary
// Workaround: API sometimes returns null instead of empty array
const items = response.items ?? []
```

---

## Quick Reference

### Magic Numbers → Named Constants

```ts
// ❌ Don't
function retryRequest() {
  for (let attempt = 0; attempt < 3; attempt += 1) {
    // ...
  }
}

// ✅ Do
const MAX_RETRY_ATTEMPTS = 3

function retryRequest() {
  for (let attempt = 0; attempt < MAX_RETRY_ATTEMPTS; attempt += 1) {
    // ...
  }
}
```

### Pattern Summary

| Aspect | Convention |
|--------|------------|
| Function length | ~50 lines max |
| Class length | ~300 lines max |
| Parameters | ≤3, or use options object |
| Nesting depth | ≤2 levels |
| Variable scope | Close to usage |
| Side effects | Separate commands from queries |
| Comments | Only explain "why", not "what" |
