# Performance Top 10 Cheat Sheet

**Critical performance optimizations for React applications**

## 1. Eliminate Waterfalls (CRITICAL)

```typescript
// ❌ Sequential (200ms total)
const user = await fetchUser(id)
const posts = await fetchPosts(user.id)

// ✅ Parallel (100ms total)
const [user, posts] = await Promise.all([
  fetchUser(id),
  fetchPosts(id)
])
```

**Impact:** 50% faster (eliminates network latency stacking)

## 2. Dynamic Imports (CRITICAL)

```typescript
// ❌ Loads everything upfront
import HeavyChart from './HeavyChart'

// ✅ Load on demand
const HeavyChart = lazy(() => import('./HeavyChart'))
```

**Impact:** 30-50% smaller initial bundle, faster TTI

## 3. Memoize Expensive Components (HIGH)

```typescript
// ❌ Re-renders on every parent update
function ExpensiveList({ items }) {
  return items.map(item => <Item key={item.id} {...item} />)
}

// ✅ Only re-renders when items change
const ExpensiveList = memo(function ExpensiveList({ items }) {
  return items.map(item => <Item key={item.id} {...item} />)
})
```

**Impact:** Eliminates unnecessary re-renders

## 4. Defer Await Until Needed (CRITICAL)

```typescript
// ❌ Always waits, even if not needed
const data = await fetchData()
if (condition) return null
return <Component data={data} />

// ✅ Skip fetch when not needed
if (condition) return null
const data = await fetchData()
return <Component data={data} />
```

**Impact:** Skips expensive operations in early returns

## 5. Avoid Barrel Imports (CRITICAL)

```typescript
// ❌ Imports entire library (200KB+)
import { Button } from '@mui/material'

// ✅ Direct import (5KB)
import Button from '@mui/material/Button'
```

**Impact:** 95% bundle size reduction for affected imports

## 6. useMemo for Expensive Calculations (MEDIUM)

```typescript
// ❌ Recalculates on every render
const sorted = items.sort((a, b) => a.value - b.value)

// ✅ Only recalculates when items change
const sorted = useMemo(
  () => items.sort((a, b) => a.value - b.value),
  [items]
)
```

**Impact:** Prevents expensive recalculations

## 7. Stable Callbacks with useCallback (MEDIUM)

```typescript
// ❌ New function on every render
<ChildComponent onUpdate={(id) => handleUpdate(id)} />

// ✅ Stable reference
const handleUpdateCallback = useCallback(
  (id) => handleUpdate(id),
  [handleUpdate]
)
<ChildComponent onUpdate={handleUpdateCallback} />
```

**Impact:** Prevents child re-renders when using memo

## 8. Avoid Anonymous Functions in JSX (LOW-MEDIUM)

```typescript
// ❌ New function every render
{items.map(item => <Item key={item.id} onClick={() => handle(item.id)} />)}

// ✅ Stable reference
{items.map(item => <Item key={item.id} onClick={handleClick} data-id={item.id} />)}
```

**Impact:** Reduces allocations, helps with memoization

## 9. Virtualize Long Lists (HIGH)

```typescript
// ❌ Renders 1000 items in DOM
{items.map(item => <Item key={item.id} {...item} />)}

// ✅ Only renders visible items (~10-20)
import { FixedSizeList } from 'react-window'

<FixedSizeList
  height={600}
  itemCount={items.length}
  itemSize={50}
>
  {({ index, style }) => (
    <div style={style}><Item {...items[index]} /></div>
  )}
</FixedSizeList>
```

**Impact:** 98% less DOM nodes, 10x+ faster rendering

## 10. Code Split by Route (CRITICAL)

```typescript
// ❌ Loads all routes upfront
import Home from './pages/Home'
import Dashboard from './pages/Dashboard'
import Profile from './pages/Profile'

// ✅ Load routes on demand
const Home = lazy(() => import('./pages/Home'))
const Dashboard = lazy(() => import('./pages/Dashboard'))
const Profile = lazy(() => import('./pages/Profile'))

<Suspense fallback={<Loading />}>
  <Routes>
    <Route path="/" element={<Home />} />
    <Route path="/dashboard" element={<Dashboard />} />
    <Route path="/profile" element={<Profile />} />
  </Routes>
</Suspense>
```

**Impact:** 60-80% smaller initial bundle

---

## Quick Decision Tree

**Slow initial load?**
→ Dynamic imports (#2, #10), Barrel imports (#5)

**Slow interactions?**
→ Waterfalls (#1), Memoization (#3, #6, #7)

**Janky scrolling?**
→ Virtualization (#9), Remove unnecessary re-renders (#3)

**Large bundle?**
→ Code splitting (#10), Direct imports (#5), Dynamic imports (#2)
