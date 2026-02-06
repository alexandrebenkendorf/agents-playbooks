# Naming Conventions Cheat Sheet

**Quick reference for all naming patterns**

## React Components

```typescript
// Components (PascalCase)
UserProfile.tsx;
ErrorBoundary.tsx;

// Hooks (camelCase with 'use')
useAuth.ts;
useLocalStorage.ts;

// Context (PascalCase with 'Context')
ThemeContext.tsx;
UserContext.tsx;
```

## TypeScript

```typescript
// Interfaces (PascalCase, no 'I' prefix)
interface User {}
interface ApiResponse<T> {}

// Types (PascalCase)
type Status = 'active' | 'inactive';
type UserId = string;

// Enums (PascalCase)
enum UserRole {
  Admin,
  User,
}

// Generic type params (single capital letter)
function map<T, U>(items: T[]): U[];
```

## Variables & Functions

```typescript
// Variables (camelCase)
const userName = 'John';
const isActive = true;

// Functions (camelCase, verb prefix)
function getUserById(id: string) {}
function validateEmail(email: string) {}

// Constants (SCREAMING_SNAKE_CASE)
const MAX_RETRY_COUNT = 3;
const API_BASE_URL = 'https://api.example.com';

// Boolean variables (is/has/can prefix)
const isLoading = true;
const hasPermission = false;
const canEdit = true;
```

## Files & Folders

```bash
# Components (PascalCase)
UserProfile.tsx
UserProfile.test.tsx

# Utilities (camelCase)
formatDate.ts
validateEmail.ts

# Feature folders (kebab-case)
user-profile/
  UserProfile.tsx
  useUserProfile.ts
  UserProfile.test.tsx
```

## Domain-Driven Design

```typescript
// Entities (PascalCase)
class User {}
class Order {}

// Value Objects (PascalCase)
class Email {}
class Money {}

// Repositories (PascalCase + 'Repository')
class UserRepository {}
class OrderRepository {}

// Services (PascalCase + 'Service')
class AuthenticationService {}
class PaymentService {}

// Use Cases (PascalCase + verb)
class CreateUserUseCase {}
class ProcessPaymentUseCase {}
```

## Common Prefixes

| Prefix       | Usage          | Example                    |
| ------------ | -------------- | -------------------------- |
| `use`        | React hooks    | `useAuth`, `useState`      |
| `is/has/can` | Booleans       | `isValid`, `hasPermission` |
| `get`        | Retrieve data  | `getUserById`              |
| `set`        | Update data    | `setUserName`              |
| `fetch`      | Async data     | `fetchUsers`               |
| `handle`     | Event handlers | `handleClick`              |
| `on`         | Callbacks      | `onSubmit`, `onChange`     |
| `render`     | JSX functions  | `renderHeader`             |
| `create`     | Factories      | `createUser`               |
| `validate`   | Validation     | `validateEmail`            |
| `format`     | Formatters     | `formatDate`               |
| `parse`      | Parsers        | `parseJson`                |

## Quick Decisions

**Component or Hook?**

- Returns JSX → Component (PascalCase)
- Returns state/logic → Hook (camelCase with 'use')

**Interface or Type?**

- Object shape → Interface
- Union/intersection → Type
- Either works → Interface (extendable)

**File or Folder?**

- Simple component → Single file
- Component + hooks + tests → Folder
- Multiple related files → Feature folder
