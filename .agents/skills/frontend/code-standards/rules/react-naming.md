# React Naming Conventions

Naming conventions for React components, hooks, and related files.

---

## React Components

- **MUST use PascalCase**

```tsx
export function UserProfile() {}
export const UserName = () => {};
```

### Component files

- SHOULD match the component name

```txt
UserProfile.tsx
UserProfile.test.tsx
UserProfile.stories.tsx
```

---

## Hooks

- **MUST use camelCase**
- **MUST start with `use`**

```ts
useUser.ts;
useAuth.ts;
```

---

## Directories (Folders)

### Feature / domain directories

- **MUST use kebab-case**

```txt
user-profile/
booking-history/
auth-guard/
```

These folders represent **domains, features, or contexts**, not entities.

### Composite component directories

- **MAY use PascalCase**
- Allowed **only** when encapsulating a public component with private subcomponents

```txt
user-profile/
  UserProfile/
    UserProfile.tsx
    UserName.tsx
    index.ts
```

**Rules:**

- The PascalCase folder represents the **public component**
- `index.ts` MUST explicitly export only the public component(s)
- Subcomponents inside the folder are considered **private implementation details**

---

## Summary

| Concept                    | Naming     |
| -------------------------- | ---------- |
| React components           | PascalCase |
| Component files            | PascalCase |
| Hooks                      | camelCase  |
| Feature folders            | kebab-case |
| Composite component folder | PascalCase |

---

## Rationale

These conventions align with:

- React and JSX semantics (components start with capital letters)
- Hook naming conventions (`use` prefix for rules of hooks)
- File system organization that scales with project growth
