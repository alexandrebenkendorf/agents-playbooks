# Data Structures & Lookups

Choosing the right data structure for O(1) performance.

---

## Build Index Maps for Repeated Lookups

**Impact: LOW-MEDIUM (1M ops to 2K ops)**

Multiple `.find()` calls by the same key should use a Map for O(1) lookups instead of O(n).

### Incorrect (O(n) per lookup):

```typescript
function processOrders(orders: Order[], users: User[]) {
  return orders.map((order) => ({
    ...order,
    user: users.find((u) => u.id === order.userId),
  }));
}
```

### Correct (O(1) per lookup):

```typescript
function processOrders(orders: Order[], users: User[]) {
  const userById = new Map(users.map((u) => [u.id, u]));

  return orders.map((order) => ({
    ...order,
    user: userById.get(order.userId),
  }));
}
```

Build map once (O(n)), then all lookups are O(1).

**For 1000 orders × 1000 users: 1M ops → 2K ops.**

---

## Use Set/Map for O(1) Lookups

**Impact: LOW-MEDIUM (O(n) to O(1))**

Convert arrays to Set/Map for repeated membership checks.

### Incorrect (O(n) per check):

```typescript
const allowedIds = ['a', 'b', 'c', ...]
items.filter(item => allowedIds.includes(item.id))
```

### Correct (O(1) per check):

```typescript
const allowedIds = new Set(['a', 'b', 'c', ...])
items.filter(item => allowedIds.has(item.id))
```

---

## When to Use Each Data Structure

| Data Structure | Use Case                         | Complexity    |
| -------------- | -------------------------------- | ------------- |
| `Array`        | Ordered data, iteration          | O(n) lookup   |
| `Set`          | Unique values, membership checks | O(1) lookup   |
| `Map`          | Key-value pairs, fast lookups    | O(1) lookup   |
| `Object`       | String keys only, simple data    | O(1) lookup\* |

\*Note: Object lookup is typically O(1) but can degrade in edge cases. Map is more reliable for large datasets.
