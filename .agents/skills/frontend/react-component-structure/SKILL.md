---
name: React Component Structure
description: Best practices for structuring React components - function declarations, file organization, and Single Responsibility Principle
---

# React Component Structure

Best practices for structuring React components for readability, testability, and maintainability.

---

## Function Declarations vs Const

**Always use function declarations** for components, not const with arrow functions.

### ❌ Don't

```tsx
const UserProfile = ({ name, email }: Props) => {
  return (
    <div>
      <h1>{name}</h1>
      <p>{email}</p>
    </div>
  )
}

// Or worse
const UserProfile: React.FC<Props> = ({ name, email }) => {
  return (
    <div>
      <h1>{name}</h1>
      <p>{email}</p>
    </div>
  )
}
```

### ✅ Do

```tsx
function UserProfile({ name, email }: Props) {
  return (
    <div>
      <h1>{name}</h1>
      <p>{email}</p>
    </div>
  );
}
```

### Why?

1. **Better stack traces**: Function declarations show the component name clearly in error stacks
2. **Hoisting**: Can reference components before they're defined in the file
3. **Avoid React.FC pitfalls**:
   - Implicitly includes `children` (often unwanted)
   - Return type is `ReactNode` which includes `undefined` (allows accidental `undefined` returns)
   - Incompatible with some generics patterns
   - Adds unnecessary abstraction
4. **Clearer intent**: Function declarations signal "this is a component"
5. **TypeScript inference**: Props type is explicit and clear

---

## Single Responsibility Principle

Components should do **one thing well**. Avoid mixing concerns or creating "god components".

> 📖 **For comprehensive SOLID principles including SRP, see:** [code-standards/rules/solid-principles.md](../code-standards/rules/solid-principles.md#s---single-responsibility-principle)

**In React context, SRP means:**

- Each component has one clear purpose
- Easy to name descriptively
- Easy to test in isolation
- Changes for one reason only

### ❌ Don't: Multiple helpers before component

```tsx
// File: UserProfile.tsx
function formatDate(date: Date): string {
  return new Intl.DateTimeFormat('nl-NL').format(date);
}

function calculateAge(birthDate: Date): number {
  const today = new Date();
  const age = today.getFullYear() - birthDate.getFullYear();
  return age;
}

function validateEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function formatPhoneNumber(phone: string): string {
  return phone.replace(/(\d{3})(\d{3})(\d{4})/, '($1) $2-$3');
}

function capitalizeWords(str: string): string {
  return str.replace(/\b\w/g, (l) => l.toUpperCase());
}

// Finally, the component (after 5 helpers!)
function UserProfile({ user }: Props) {
  return (
    <div>
      <h1>{capitalizeWords(user.name)}</h1>
      <p>Age: {calculateAge(user.birthDate)}</p>
      <p>Email: {user.email}</p>
      <p>Phone: {formatPhoneNumber(user.phone)}</p>
    </div>
  );
}
```

### ✅ Do: Extract helpers to utility files

```tsx
// File: UserProfile.tsx
import { calculateAge, formatDate } from '@/utils/date-helpers';
import { formatPhoneNumber } from '@/utils/formatters';
import { capitalizeWords } from '@/utils/string-helpers';
import { validateEmail } from '@/utils/validators';

function UserProfile({ user }: Props) {
  return (
    <div>
      <h1>{capitalizeWords(user.name)}</h1>
      <p>Age: {calculateAge(user.birthDate)}</p>
      <p>Email: {user.email}</p>
      <p>Phone: {formatPhoneNumber(user.phone)}</p>
    </div>
  );
}
```

### ✅ Alternative: Place simple helpers after component

For **component-specific** helpers that are short (1-3 lines):

```tsx
// File: UserCard.tsx
function UserCard({ user, onEdit }: Props) {
  const displayName = formatDisplayName(user.firstName, user.lastName);
  const initials = getInitials(user.firstName, user.lastName);

  return (
    <div>
      <Avatar>{initials}</Avatar>
      <h2>{displayName}</h2>
      <button onClick={() => onEdit(user.id)}>Edit</button>
    </div>
  );
}

// Simple, component-specific helpers placed AFTER
function formatDisplayName(first: string, last: string): string {
  return `${first} ${last}`;
}

function getInitials(first: string, last: string): string {
  return `${first[0]}${last[0]}`.toUpperCase();
}
```

---

## Component Organization Pattern

**Recommended file structure:**

```tsx
// 1. Imports (external first, then internal)
import { formatCurrency } from '@/utils/formatters';
import { useEffect, useState } from 'react';

// 2. Constants (if needed)
const DISCOUNT_THRESHOLD = 100;

// 3. Types/Interfaces (as close as possible to component)
interface ProductCardProps {
  product: Product;
  onAddToCart: (id: string) => void;
}

// 4. Main component
function ProductCard({ product, onAddToCart }: ProductCardProps) {
  const [quantity, setQuantity] = useState(1);
  const discountedPrice = calculateDiscount(product.price, quantity);

  return (
    <div>
      <h3>{product.name}</h3>
      <p>{formatCurrency(discountedPrice)}</p>
      <button onClick={() => onAddToCart(product.id)}>Add to Cart</button>
    </div>
  );
}

// 5. Component-specific helpers (if simple and tightly coupled)
function calculateDiscount(price: number, qty: number): number {
  return qty >= DISCOUNT_THRESHOLD ? price * 0.9 : price;
}

// 6. Export
export { ProductCard };
```

---

## When to Extract

### Extract to separate file when:

- ✅ Helper is reused across 2+ components
- ✅ Logic is complex (>10 lines)
- ✅ Helper is domain logic (business rules)
- ✅ Helper needs separate testing

### Keep in component file when:

- ✅ Used only in this component
- ✅ Simple (1-5 lines)
- ✅ Tightly coupled to component logic
- ✅ Pure formatting/transformation

---

## Anti-Patterns

### ❌ Don't: God component

```tsx
function Dashboard() {
  // 300 lines of logic handling:
  // - User authentication
  // - Data fetching
  // - Filtering
  // - Sorting
  // - Pagination
  // - Charts rendering
  // - Form handling
  return <>{/* 200 lines of JSX */}</>;
}
```

### ✅ Do: Compose smaller components

```tsx
function Dashboard() {
  return (
    <DashboardLayout>
      <UserHeader />
      <FilterControls />
      <DataTable />
      <ChartSection />
    </DashboardLayout>
  );
}
```

### ❌ Don't: Mixing presentation and logic

```tsx
function ProductList() {
  // Data fetching, filtering, sorting, pagination
  const [products, setProducts] = useState([]);
  const [filters, setFilters] = useState({});
  // ... 50 lines of logic

  return <>{/* Presentation */}</>;
}
```

### ✅ Do: Separate concerns

```tsx
function ProductList() {
  const { products, isLoading } = useProducts(); // Custom hook for logic

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return <ProductGrid products={products} />;
}
```

---

## Summary

| Aspect                | Guideline                                                  |
| --------------------- | ---------------------------------------------------------- |
| Component syntax      | Function declarations, not const                           |
| React.FC              | Avoid (unnecessary, has pitfalls)                          |
| Helpers               | Extract to utils if reused or complex                      |
| Component size        | Keep focused (~50-100 lines)                               |
| Organization          | Imports → Constants → Props → Component → Helpers → Export |
| Props location        | Define immediately before component                        |
| Single Responsibility | One component, one purpose                                 |

**Principle:** Components should be easy to understand at a glance. If you have to scroll past 5 helpers to find the component, refactor.
