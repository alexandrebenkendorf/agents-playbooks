# DOM & Browser Performance

Performance patterns for DOM manipulation and browser APIs.

---

## Avoid Layout Thrashing

**Impact: MEDIUM (prevents forced synchronous layouts)**

Avoid interleaving style writes with layout reads. When you read a layout property (like `offsetWidth`, `getBoundingClientRect()`, or `getComputedStyle()`) between style changes, the browser is forced to trigger a synchronous reflow.

### This is OK: browser batches style changes

```typescript
function updateElementStyles(element: HTMLElement) {
  // Each line invalidates style, but browser batches the recalculation
  element.style.width = '100px';
  element.style.height = '200px';
  element.style.backgroundColor = 'blue';
  element.style.border = '1px solid black';
}
```

### Incorrect: interleaved reads and writes force reflows

```typescript
function layoutThrashing(element: HTMLElement) {
  element.style.width = '100px';
  const width = element.offsetWidth; // Forces reflow
  element.style.height = '200px';
  const height = element.offsetHeight; // Forces another reflow
}
```

### Correct: batch writes, then read once

```typescript
function updateElementStyles(element: HTMLElement) {
  // Batch all writes together
  element.style.width = '100px';
  element.style.height = '200px';
  element.style.backgroundColor = 'blue';
  element.style.border = '1px solid black';

  // Read after all writes are done (single reflow)
  const { width, height } = element.getBoundingClientRect();
}
```

### Correct: batch reads, then writes

```typescript
function updateElementStyles(element: HTMLElement) {
  element.classList.add('highlighted-box');

  const { width, height } = element.getBoundingClientRect();
}
```

### Better: use CSS classes

Prefer CSS classes over inline styles when possible. CSS files are cached by the browser, and classes provide better separation of concerns and are easier to maintain.

**References:**

- [Paul Irish's Layout Thrashing Gist](https://gist.github.com/paulirish/5d52fb081b3570c81e3a)
- [CSS Triggers](https://csstriggers.com/)
