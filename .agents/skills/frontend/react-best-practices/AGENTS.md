# React Best Practices - Navigation Guide

**Version 1.0.0** | Vercel Engineering | January 2026

> **Quick Access:** This is a navigation guide. For the complete reference with all examples, see [AGENTS-FULL.md](AGENTS-FULL.md).

---

## 🎯 Quick Start

**For specific optimizations, jump directly to relevant sections below.**  
**For comprehensive reference, see [AGENTS-FULL.md](AGENTS-FULL.md).**

---

## 1. Eliminating Waterfalls — **CRITICAL**

**Impact:** Waterfalls are the #1 performance killer. 50-200% performance gains possible.

**Quick wins:**
- Defer `await` until actually needed
- Use `Promise.all()` for independent operations
- Parallel data fetching in components

**Section rules:**
- 1.1 Defer Await Until Needed
- 1.2 Dependency-Based Parallelization
- 1.3 Prevent Waterfall Chains in API Routes
- 1.4 Promise.all() for Independent Operations
- 1.5 Strategic Suspense Boundaries

📖 **[See full section in AGENTS-FULL.md](AGENTS-FULL.md#1-eliminating-waterfalls)**

---

## 2. Bundle Size Optimization — **CRITICAL**

**Impact:** 30-95% bundle size reduction. Faster TTI and LCP.

**Quick wins:**
- Avoid barrel imports (`import { X } from '@mui/material'` → `import X from '@mui/material/X'`)
- Dynamic imports for heavy components
- Code splitting by route

**Section rules:**
- 2.1 Avoid Barrel File Imports
- 2.2 Conditional Module Loading
- 2.3 Defer Non-Critical Third-Party Libraries
- 2.4 Dynamic Imports for Heavy Components
- 2.5 Preload Based on User Intent

📖 **[See full section in AGENTS-FULL.md](AGENTS-FULL.md#2-bundle-size-optimization)**

---

## 3. Server-Side Performance — **HIGH**

**Impact:** Faster server responses, better SSR performance.

**Quick wins:**
- Use `React.cache()` for per-request deduplication
- LRU caching for cross-request data
- Parallel component composition

**Section rules:**
- 3.1 Authenticate Server Actions Like API Routes
- 3.2 Avoid Duplicate Serialization in RSC Props
- 3.3 Cross-Request LRU Caching
- 3.4 Minimize Serialization at RSC Boundaries
- 3.5 Parallel Data Fetching with Component Composition
- 3.6 Per-Request Deduplication with React.cache()
- 3.7 Use after() for Non-Blocking Operations

📖 **[See full section in AGENTS-FULL.md](AGENTS-FULL.md#3-server-side-performance)**

---

## 4. Client-Side Data Fetching — **MEDIUM-HIGH**

**Impact:** Reduces redundant network requests, improves data consistency.

**Quick wins:**
- Use SWR for automatic deduplication
- Passive event listeners for scroll performance
- Deduplicate global listeners

**Section rules:**
- 4.1 Deduplicate Global Event Listeners
- 4.2 Use Passive Event Listeners for Scrolling Performance
- 4.3 Use SWR for Automatic Deduplication
- 4.4 Version and Minimize localStorage Data

📖 **[See full section in AGENTS-FULL.md](AGENTS-FULL.md#4-client-side-data-fetching)**

---

## 5. Re-render Optimization — **MEDIUM**

**Impact:** Reduces wasted computation, improves UI responsiveness.

**Quick wins:**
- Extract to memoized components
- Use functional setState updates
- Narrow effect dependencies

**Section rules:**
- 5.1 Calculate Derived State During Rendering
- 5.2 Defer State Reads to Usage Point
- 5.3 Avoid useMemo for Simple Primitive Expressions
- 5.4 Extract Default Non-Primitive Values to Constants
- 5.5 Extract to Memoized Components
- 5.6 Narrow Effect Dependencies
- 5.7 Put Interaction Logic in Event Handlers
- 5.8 Subscribe to Derived State
- 5.9 Use Functional setState Updates
- 5.10 Use Lazy State Initialization
- 5.11 Use Transitions for Non-Urgent Updates
- 5.12 Use useRef for Transient Values

📖 **[See full section in AGENTS-FULL.md](AGENTS-FULL.md#5-re-render-optimization)**

---

## 6. Rendering Performance — **MEDIUM**

**Impact:** Faster rendering, smoother animations, better hydration.

**Quick wins:**
- CSS `content-visibility` for long lists
- Hoist static JSX elements
- Use `useTransition` over manual loading states

**Section rules:**
- 6.1 Animate SVG Wrapper Instead of SVG Element
- 6.2 CSS content-visibility for Long Lists
- 6.3 Hoist Static JSX Elements
- 6.4 Optimize SVG Precision
- 6.5 Prevent Hydration Mismatch Without Flickering
- 6.6 Suppress Expected Hydration Mismatches
- 6.7 Use Activity Component for Show/Hide
- 6.8 Use Explicit Conditional Rendering
- 6.9 Use useTransition Over Manual Loading States

📖 **[See full section in AGENTS-FULL.md](AGENTS-FULL.md#6-rendering-performance)**

---

## 7. Advanced Patterns — **LOW**

**Impact:** Edge case optimizations, advanced techniques.

**Quick wins:**
- Initialize app once (not per mount)
- Store event handlers in refs for stability

**Section rules:**
- 7.1 Initialize App Once, Not Per Mount
- 7.2 Store Event Handlers in Refs
- 7.3 useEffectEvent for Stable Callback Refs

📖 **[See full section in AGENTS-FULL.md](AGENTS-FULL.md#7-advanced-patterns)**

---

## 🎯 Decision Tree

**Slow initial load?**
→ Sections 2 (Bundle Size) + 3 (Server-Side)

**Slow interactions/UI?**
→ Sections 1 (Waterfalls) + 5 (Re-renders)

**Janky scrolling/animations?**
→ Section 6 (Rendering Performance)

**Network performance?**
→ Sections 1 (Waterfalls) + 4 (Client Data Fetching)

**Full audit?**
→ Read [AGENTS-FULL.md](AGENTS-FULL.md) sequentially

---

## 📚 References

1. [React Documentation](https://react.dev)
2. [Next.js Documentation](https://nextjs.org)
3. [SWR Documentation](https://swr.vercel.app)
4. [Vercel Performance Blog](https://vercel.com/blog)

---

**For complete rules with examples:** See [AGENTS-FULL.md](AGENTS-FULL.md)  
**For quick reference:** See [quick-ref/performance-top10.md](quick-ref/performance-top10.md)
