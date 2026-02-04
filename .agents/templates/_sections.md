# Sections Template

This file defines sections for creating structured skill documentation.

Use this template when creating multi-rule skills where rules are organized by category/section.

---

## Guidelines

- Each section should have a clear prefix used in filenames (e.g., `async-`, `bundle-`, `server-`)
- Impact levels guide prioritization: CRITICAL → HIGH → MEDIUM-HIGH → MEDIUM → LOW-MEDIUM → LOW
- Descriptions should explain WHY this category matters and WHEN to apply it

---

## Template Structure

```markdown
# Sections

## 1. Section Name (prefix)

**Impact:** CRITICAL | HIGH | MEDIUM-HIGH | MEDIUM | LOW-MEDIUM | LOW
**Description:** Brief explanation of why this section matters and its performance/quality impact.

## 2. Another Section (prefix2)

**Impact:** HIGH
**Description:** Explanation...
```

---

## Example: Frontend Performance

```markdown
# Sections

## 1. Eliminating Waterfalls (async)

**Impact:** CRITICAL  
**Description:** Waterfalls are the #1 performance killer. Each sequential await adds full network latency. Eliminating them yields the largest gains.

## 2. Bundle Size Optimization (bundle)

**Impact:** CRITICAL  
**Description:** Reducing initial bundle size improves Time to Interactive and Largest Contentful Paint.

## 3. Re-render Optimization (rerender)

**Impact:** MEDIUM  
**Description:** Reducing unnecessary re-renders minimizes wasted computation and improves UI responsiveness.
```

---

## Usage

1. Create `_sections.md` in your skill's `rules/` directory
2. Define all sections with clear prefixes
3. Use prefixes in rule filenames (e.g., `async-defer-await.md`)
4. Build scripts will group rules by section automatically
