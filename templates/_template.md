# Rule Template

Template for creating new rules in skill documentation.

---

## Basic Template

```markdown
---
title: Rule Title Here
impact: MEDIUM
impactDescription: Optional description of impact (e.g., "20-50% improvement")
tags: tag1, tag2
---

## Rule Title Here

**Impact: MEDIUM (optional impact description)**

Brief explanation of the rule and why it matters. This should be clear and concise, explaining the performance/quality implications.

**Incorrect (description of what's wrong):**

\```typescript
// Bad code example here
const bad = example()
\```

**Correct (description of what's right):**

\```typescript
// Good code example here
const good = example()
\```

Reference: [Link to documentation or resource](https://example.com)
```

---

## Frontmatter Fields

- **title** (required): The rule name displayed in documentation
- **impact** (required): CRITICAL | HIGH | MEDIUM-HIGH | MEDIUM | LOW-MEDIUM | LOW
- **impactDescription** (optional): Quantify the impact (e.g., "reduces bundle by 30%")
- **tags** (optional): Comma-separated keywords for searchability

---

## File Naming Convention

Use prefix from `_sections.md` + descriptive name:

- `async-defer-await.md` - Rule about async/await patterns
- `bundle-barrel-imports.md` - Rule about bundle optimization
- `rerender-memo-components.md` - Rule about re-render optimization

Prefix determines which section the rule belongs to.

---

## Impact Levels

Choose the appropriate impact level:

- **CRITICAL** - Highest priority, major performance/quality gains (e.g., eliminates waterfalls, critical security issues)
- **HIGH** - Significant improvements (e.g., bundle size reduction, major accessibility issues)
- **MEDIUM-HIGH** - Moderate-high gains
- **MEDIUM** - Moderate improvements (e.g., reduces re-renders, improves code clarity)
- **LOW-MEDIUM** - Low-medium gains
- **LOW** - Incremental improvements (e.g., micro-optimizations, style preferences)

---

## Example Structure

### 1. Start with Context

Explain WHAT the rule is about and WHY it matters.

```markdown
## Defer Await Until Needed

Sequential `await` statements create waterfalls that serialize network requests. 
Each await blocks execution, adding latency. Deferring await until you need 
the value allows parallel execution.
```

### 2. Show Incorrect Pattern

Demonstrate the anti-pattern with clear explanation.

```markdown
**Incorrect (creates sequential waterfall):**

\```typescript
async function getUser() {
  const user = await fetchUser()      // ⏳ Wait 100ms
  const posts = await fetchPosts()    // ⏳ Wait 100ms
  return { user, posts }              // Total: 200ms
}
\```
```

### 3. Show Correct Pattern

Provide the recommended approach with explanation.

```markdown
**Correct (parallel execution):**

\```typescript
async function getUser() {
  const userPromise = fetchUser()     // Start immediately
  const postsPromise = fetchPosts()   // Start immediately
  
  const [user, posts] = await Promise.all([
    userPromise,
    postsPromise
  ])                                  // Total: 100ms
  return { user, posts }
}
\```
```

### 4. Add Context & References

Provide additional explanation and link to authoritative sources.

```markdown
Parallel execution reduces total time from 200ms to 100ms (50% improvement).

Reference: [MDN Promise.all()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/all)
```

---

## Best Practices

1. **Be Specific** - Use concrete examples with realistic code
2. **Quantify Impact** - Include timing, bundle size, or other metrics where possible
3. **Explain WHY** - Don't just show what's wrong, explain the underlying issue
4. **Use Comments** - Add inline comments to highlight key differences
5. **Keep Concise** - Each rule should be focused on one specific pattern
6. **Add References** - Link to official docs, RFCs, or authoritative sources

---

## Creating a New Rule

1. Copy this template to `rules/<prefix>-<description>.md`
2. Fill in frontmatter (title, impact, tags)
3. Write clear explanation
4. Add bad example with explanation
5. Add good example with explanation
6. Quantify the impact if possible
7. Add references
8. Run build/validate scripts if available
