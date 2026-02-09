# Clean Code Principles

Essential clean code practices for writing maintainable, readable TypeScript code.

> 📖 **Related principles:**
>
> - For SOLID principles (SRP, OCP, etc.): [solid-principles.md](solid-principles.md)
> - For architecture patterns: [clean-architecture.md](clean-architecture.md)
> - For TypeScript-specific practices: [typescript-best-practices.md](typescript-best-practices.md)

For deeper understanding, see [Clean Code by Robert C. Martin](https://www.oreilly.com/library/view/clean-code-a/9780136083238/).

---

## 1. Meaningful Names

Names should reveal intent without needing comments.

```ts
// ❌ Bad
const d = 7; // days

// ✅ Good
const daysUntilExpiration = 7;
```

**Guidelines:**

- Variable names should be nouns or noun phrases
- Function names should be verbs or verb phrases
- Avoid single-letter names except in short loops
- Use searchable names (avoid magic numbers)

---

## 2. Functions Do One Thing

Each function should have a single, well-defined purpose.

> 📖 **See also:** [Single Responsibility Principle](solid-principles.md#s---single-responsibility-principle) for the broader SOLID context.

```ts
// ❌ Bad (does 3 things)
function processUser(user: User) {
  validateUser(user);
  saveToDatabase(user);
  sendWelcomeEmail(user);
}

// ✅ Good (each does one thing)
function validateUser(user: User): void {
  if (!user.email) {
    throw new ValidationError('Email required');
  }
}

function saveUser(user: User): Promise<void> {
  return userRepository.save(user);
}

function sendWelcomeEmail(user: User): Promise<void> {
  return emailService.send(user.email, 'Welcome!');
}
```

**Why:** Functions that do one thing are easier to:

- Test
- Understand
- Reuse
- Debug

---

## 3. Prefer Exceptions to Error Codes

Use exceptions for error handling, not return codes.

```ts
// ❌ Bad (error codes)
function deleteUser(id: string): number {
  if (!userExists(id)) return -1
  if (!hasPermission()) return -2
  // delete logic
  return 0
}

// Caller must remember what each code means
const result = deleteUser('123')
if (result === -1) {
  console.error('User not found')
} else if (result === -2) {
  console.error('Permission denied')
}

// ✅ Good (exceptions)
function deleteUser(id: string): void {
  if (!userExists(id)) {
    throw new UserNotFoundError(id)
  }
  if (!hasPermission()) {
    throw new UnauthorizedError()
  }
  // delete logic
}

// Caller gets clear error context
try {
  deleteUser('123')
} catch (error) {
  if (error instanceof UserNotFoundError) {
    console.error('User not found')
  } else if (error instanceof UnauthorizedError) {
    console.error('Permission denied')
  }
}
```

**Benefits:**

- Self-documenting (exception name explains the error)
- Type-safe (can catch specific error types)
- Stack traces for debugging
- Forces error handling at appropriate level

---

## 4. Don't Repeat Yourself (DRY)

Avoid code duplication through abstraction.

```ts
// ❌ Bad (duplication)
function formatUserName(user: User): string {
  return `${user.firstName} ${user.lastName}`;
}

function formatAdminName(admin: Admin): string {
  return `${admin.firstName} ${admin.lastName}`;
}

function formatCustomerName(customer: Customer): string {
  return `${customer.firstName} ${customer.lastName}`;
}

// ✅ Good (abstraction)
interface HasName {
  firstName: string;
  lastName: string;
}

function formatFullName(person: HasName): string {
  return `${person.firstName} ${person.lastName}`;
}

// Works for any type with firstName and lastName
formatFullName(user);
formatFullName(admin);
formatFullName(customer);
```

**When to apply DRY:**

- Same logic appears in 2+ places
- Logic changes would need to be made in multiple places
- Code can be abstracted without becoming overly complex

**When NOT to apply:**

- Coincidental similarity (code looks similar but serves different purposes)
- Premature abstraction (wait until duplication appears 2-3 times)
- Abstraction would be harder to understand than duplication

---

## 5. Small Functions

Keep functions short and focused.

```ts
// ❌ Bad (too long)
function processOrder(order: Order): void {
  // Validate order (10 lines)
  if (!order.items || order.items.length === 0) {
    throw new Error('No items')
  }
  // ... more validation

  // Calculate total (15 lines)
  let total = 0
  for (const item of order.items) {
    total += item.price * item.quantity
  }
  // ... tax calculations, discounts

  // Save to database (10 lines)
  // ... database logic

  // Send confirmation (10 lines)
  // ... email logic
}

// ✅ Good (small, focused functions)
function processOrder(order: Order): void {
  validateOrder(order)
  const total = calculateOrderTotal(order)
  saveOrder(order, total)
  sendOrderConfirmation(order)
}

function validateOrder(order: Order): void {
  if (!order.items || order.items.length === 0) {
    throw new ValidationError('Order must have at least one item')
  }
}

function calculateOrderTotal(order: Order): number {
  const subtotal = order.items.reduce((sum, item) => sum + item.price * item.quantity, 0)
  return applyTaxAndDiscounts(subtotal, order)
}
```

**Target:** 5-20 lines per function (excluding simple getters/setters)

---

## 6. Avoid Side Effects

Functions should either change state (command) or return data (query), but not both.

```ts
// ❌ Bad (query with side effect)
function getUserBalance(userId: string): number {
  logAccess(userId) // Side effect in a query!
  return database.getBalance(userId)
}

// ✅ Good (separate command from query)
function logUserAccess(userId: string): void {
  logAccess(userId) // Command: changes state
}

function getUserBalance(userId: string): number {
  return database.getBalance(userId) // Query: returns data
}

// Usage
logUserAccess(userId)
const balance = getUserBalance(userId)
```

See [general-coding-standards.md](general-coding-standards.md) for more on Command-Query Separation.

---

## Quick Reference

| Principle        | Guideline                         |
| ---------------- | --------------------------------- |
| **Names**        | Reveal intent, no comments needed |
| **Functions**    | Do one thing only                 |
| **Errors**       | Use exceptions, not error codes   |
| **DRY**          | Don't Repeat Yourself             |
| **Size**         | 5-20 lines per function           |
| **Side Effects** | Separate commands from queries    |

---

## Multiple Condition Checks

### Use `.some(Boolean)` for Multiple OR Conditions

When checking if any of several conditions is true, use an array with `.some(Boolean)` instead of chaining `||` operators. This avoids ESLint `prefer-nullish-coalescing` warnings and is more readable.

```ts
// ❌ Don't - Chain with || triggers ESLint warnings
const isValid =
  (id && validIds.includes(id)) ||
  (name && validNames.includes(name)) ||
  (role && validRoles.includes(role));

// ❌ Don't - Using ?? is incorrect for boolean conditions
const isValid =
  (id && validIds.includes(id)) ??
  (name && validNames.includes(name)) ??
  (role && validRoles.includes(role));

// ✅ Do - Array with .some(Boolean)
const isValid = [
  id && validIds.includes(id),
  name && validNames.includes(name),
  role && validRoles.includes(role),
].some(Boolean);
```

**Benefits:**

- No ESLint disable comments needed
- More readable with each condition on its own line
- `.some(Boolean)` clearly expresses "any truthy value"
- Easier to add/remove conditions

**When to use:**

- Multiple independent boolean conditions
- Checking if any of several criteria match
- Avoiding `||` chains that trigger ESLint warnings

**Note:** The `Boolean` function filters out falsy values (`false`, `null`, `undefined`, `0`, `''`, `NaN`), returning `true` if any element is truthy.

---
