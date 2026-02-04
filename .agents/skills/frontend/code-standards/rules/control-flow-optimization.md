# Control Flow Optimization

Patterns for efficient control flow and avoiding unnecessary computation.

---

## Early Return from Functions

**Impact: LOW-MEDIUM (avoids unnecessary computation)**

Return early when result is determined to skip unnecessary processing.

### Incorrect: processes all items even after finding answer

```typescript
function validateUsers(users: User[]) {
  let hasError = false
  let errorMessage = ''
  
  for (const user of users) {
    if (!user.email) {
      hasError = true
      errorMessage = 'Email required'
    }
    if (!user.name) {
      hasError = true
      errorMessage = 'Name required'
    }
    // Continues checking all users even after error found
  }
  
  return hasError ? { valid: false, error: errorMessage } : { valid: true }
}
```

### Correct: returns immediately on first error

```typescript
function validateUsers(users: User[]) {
  for (const user of users) {
    if (!user.email) {
      return { valid: false, error: 'Email required' }
    }
    if (!user.name) {
      return { valid: false, error: 'Name required' }
    }
  }

  return { valid: true }
}
```

---

## Hoist RegExp Creation

**Impact: LOW-MEDIUM (avoids recreation)**

Don't create RegExp inside frequently-called functions. Hoist to module scope or cache appropriately.

### Incorrect: new RegExp every call

```typescript
function validateEmail(email: string) {
  const regex = new RegExp('^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$')
  return regex.test(email)
}
```

### Correct: hoist to module scope

```typescript
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

function validateEmail(email: string) {
  return EMAIL_REGEX.test(email)
}
```

### Warning: global regex has mutable state

Global regex (`/g`) has mutable `lastIndex` state. Reset it or create new instances when needed:

```typescript
const regex = /foo/g
regex.test('foo')  // true, lastIndex = 3
regex.test('foo')  // false, lastIndex = 0
```

---

## Guard Clauses

Use guard clauses to reduce nesting and improve readability:

### Incorrect: deeply nested

```typescript
function processUser(user: User | null) {
  if (user) {
    if (user.isActive) {
      if (user.hasPermission('admin')) {
        // Do work
        return user.data
      }
    }
  }
  return null
}
```

### Correct: early returns with guards

```typescript
function processUser(user: User | null) {
  if (!user) return null
  if (!user.isActive) return null
  if (!user.hasPermission('admin')) return null
  
  // Do work
  return user.data
}
```
