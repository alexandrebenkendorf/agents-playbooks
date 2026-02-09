# Caching Strategies

Patterns for caching expensive operations to improve performance.

---

## Cache Property Access in Loops

**Impact: LOW-MEDIUM (reduces lookups)**

Cache object property lookups in hot paths to avoid repeated property resolution.

### Incorrect: 3 lookups × N iterations

```typescript
for (let i = 0; i < arr.length; i++) {
  process(obj.config.settings.value);
}
```

### Correct: 1 lookup total

```typescript
const value = obj.config.settings.value;
const len = arr.length;
for (let i = 0; i < len; i++) {
  process(value);
}
```

---

## Cache Repeated Function Calls

**Impact: MEDIUM (avoid redundant computation)**

Use a module-level Map to cache function results when the same function is called repeatedly with the same inputs.

### Incorrect: redundant computation

```typescript
function processProjects(projects: Project[]) {
  return projects.map((project) => {
    // slugify() called repeatedly for same project names
    const slug = slugify(project.name);

    return { ...project, slug };
  });
}
```

### Correct: cached results

```typescript
// Module-level cache
const slugifyCache = new Map<string, string>();

function cachedSlugify(text: string): string {
  if (slugifyCache.has(text)) {
    return slugifyCache.get(text)!;
  }
  const result = slugify(text);
  slugifyCache.set(text, result);
  return result;
}

function processProjects(projects: Project[]) {
  return projects.map((project) => {
    // Computed only once per unique project name
    const slug = cachedSlugify(project.name);

    return { ...project, slug };
  });
}
```

### Simpler pattern for single-value functions:

```typescript
let isLoggedInCache: boolean | null = null;

function isLoggedIn(): boolean {
  if (isLoggedInCache !== null) {
    return isLoggedInCache;
  }

  isLoggedInCache = document.cookie.includes('auth=');
  return isLoggedInCache;
}

// Clear cache when auth changes
function onAuthChange() {
  isLoggedInCache = null;
}
```

**Note:** Use a Map (not a hook) so it works everywhere: utilities, event handlers, not just React components.

**Reference:** [How we made the Vercel dashboard twice as fast](https://vercel.com/blog/how-we-made-the-vercel-dashboard-twice-as-fast)

---

## Cache Storage API Calls

**Impact: LOW-MEDIUM (reduces expensive I/O)**

`localStorage`, `sessionStorage`, and `document.cookie` are synchronous and expensive. Cache reads in memory.

### Incorrect: reads storage on every call

```typescript
function getTheme() {
  return localStorage.getItem('theme') ?? 'light';
}
// Called 10 times = 10 storage reads
```

### Correct: Map cache

```typescript
const storageCache = new Map<string, string | null>();

function getLocalStorage(key: string) {
  if (!storageCache.has(key)) {
    storageCache.set(key, localStorage.getItem(key));
  }
  return storageCache.get(key);
}

function setLocalStorage(key: string, value: string) {
  localStorage.setItem(key, value);
  storageCache.set(key, value); // keep cache in sync
}
```

### Cookie caching:

```typescript
let cookieCache: Record<string, string> | null = null;

function getCookie(name: string) {
  if (!cookieCache) {
    cookieCache = Object.fromEntries(document.cookie.split('; ').map((c) => c.split('=')));
  }
  return cookieCache[name];
}
```

### Important: invalidate on external changes

If storage can change externally (another tab, server-set cookies), invalidate cache:

```typescript
window.addEventListener('storage', (e) => {
  if (e.key) storageCache.delete(e.key);
});

document.addEventListener('visibilitychange', () => {
  if (document.visibilityState === 'visible') {
    storageCache.clear();
  }
});
```

**Note:** Use a Map (not a hook) so it works everywhere: utilities, event handlers, not just React components.
