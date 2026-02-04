# Array Optimization

Patterns for efficient array operations and transformations.

---

## Combine Multiple Array Iterations

**Impact: LOW-MEDIUM (reduces iterations)**

Multiple `.filter()` or `.map()` calls iterate the array multiple times. Combine into one loop when you need multiple outputs from the same data.

### Incorrect: 3 iterations

```typescript
const admins = users.filter(u => u.isAdmin)
const testers = users.filter(u => u.isTester)
const inactive = users.filter(u => !u.isActive)
```

### Correct: 1 iteration

```typescript
const admins: User[] = []
const testers: User[] = []
const inactive: User[] = []

for (const user of users) {
  if (user.isAdmin) admins.push(user)
  if (user.isTester) testers.push(user)
  if (!user.isActive) inactive.push(user)
}
```

---

## Early Length Check for Array Comparisons

**Impact: MEDIUM-HIGH (avoids expensive operations when lengths differ)**

When comparing arrays with expensive operations (sorting, deep equality, serialization), check lengths first. If lengths differ, the arrays cannot be equal.

### Incorrect: always runs expensive comparison

```typescript
function hasChanges(current: string[], original: string[]) {
  // Always sorts and joins, even when lengths differ
  return current.sort().join() !== original.sort().join()
}
```

Two O(n log n) sorts run even when `current.length` is 5 and `original.length` is 100.

### Correct (O(1) length check first):

```typescript
function hasChanges(current: string[], original: string[]) {
  // Early return if lengths differ
  if (current.length !== original.length) {
    return true
  }
  // Only sort when lengths match
  const currentSorted = current.toSorted()
  const originalSorted = original.toSorted()
  for (let i = 0; i < currentSorted.length; i++) {
    if (currentSorted[i] !== originalSorted[i]) {
      return true
    }
  }
  return false
}
```

**Benefits:**
- Avoids sorting overhead when lengths differ
- Avoids memory allocation for joined strings
- Avoids mutating original arrays
- Returns early when difference is found

---

## Use Loop for Min/Max Instead of Sort

**Impact: LOW (O(n) instead of O(n log n))**

Finding the smallest or largest element only requires a single pass through the array. Sorting is wasteful and slower.

### Incorrect (O(n log n) - sort to find latest):

```typescript
interface Project {
  id: string
  name: string
  updatedAt: number
}

function getLatestProject(projects: Project[]) {
  const sorted = [...projects].sort((a, b) => b.updatedAt - a.updatedAt)
  return sorted[0]
}
```

### Correct (O(n) - single loop):

```typescript
function getLatestProject(projects: Project[]) {
  if (projects.length === 0) return null
  
  let latest = projects[0]
  
  for (let i = 1; i < projects.length; i++) {
    if (projects[i].updatedAt > latest.updatedAt) {
      latest = projects[i]
    }
  }
  
  return latest
}

function getOldestAndNewest(projects: Project[]) {
  if (projects.length === 0) return { oldest: null, newest: null }
  
  let oldest = projects[0]
  let newest = projects[0]
  
  for (let i = 1; i < projects.length; i++) {
    if (projects[i].updatedAt < oldest.updatedAt) oldest = projects[i]
    if (projects[i].updatedAt > newest.updatedAt) newest = projects[i]
  }
  
  return { oldest, newest }
}
```

### Alternative: Math.min/Math.max for small arrays

```typescript
const numbers = [5, 2, 8, 1, 9]
const min = Math.min(...numbers)
const max = Math.max(...numbers)
```

**Caution:** This works for small arrays, but can be slower or throw an error for very large arrays due to spread operator limitations. Maximal array length is approximately 124000 in Chrome 143 and 638000 in Safari 18. Use the loop approach for reliability.

---

## Use toSorted() Instead of sort() for Immutability

**Impact: MEDIUM-HIGH (prevents mutation bugs)**

`.sort()` mutates the array in place, which can cause bugs. Use `.toSorted()` to create a new sorted array without mutation.

### Incorrect: mutates original array

```typescript
function sortUsers(users: User[]) {
  // Mutates the users array!
  return users.sort((a, b) => a.name.localeCompare(b.name))
}
```

### Correct: creates new array

```typescript
function sortUsers(users: User[]) {
  // Creates new sorted array, original unchanged
  return users.toSorted((a, b) => a.name.localeCompare(b.name))
}
```

### Why this matters:

1. **Immutability** makes code easier to reason about
2. **Avoids side effects** when passing arrays between functions
3. **Essential for state management** libraries that rely on immutability (Redux, Zustand, etc.)
4. **Prevents stale closure bugs** in event handlers and async code

### Browser support: fallback for older browsers

`.toSorted()` is available in all modern browsers (Chrome 110+, Safari 16+, Firefox 115+, Node.js 20+). For older environments:

```typescript
// Fallback for older browsers
const sorted = [...items].sort((a, b) => a.value - b.value)
```

### Other immutable array methods:

- `.toSorted()` - immutable sort
- `.toReversed()` - immutable reverse
- `.toSpliced()` - immutable splice
- `.with()` - immutable element replacement
