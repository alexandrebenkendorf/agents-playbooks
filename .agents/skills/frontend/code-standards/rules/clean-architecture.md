# Clean Architecture

Architectural pattern for organizing code into layers with clear dependency rules, enabling maintainable, testable, framework-independent systems.

For deeper understanding, see [The Clean Architecture by Uncle Bob](https://blog.cleancoder.com/uncle-bob/2012/08/13/the-clean-architecture.html).

---

## Core Concept

**Dependencies point inward** - outer layers depend on inner layers, never the reverse.

```
┌─────────────────────────────────────┐
│   Frameworks & Drivers (UI, DB)   │  ← Outermost layer (details)
├─────────────────────────────────────┤
│   Interface Adapters (Controllers) │
├─────────────────────────────────────┤
│   Use Cases (Application Logic)    │
├─────────────────────────────────────┤
│   Entities (Business Rules)         │  ← Innermost layer (core)
└─────────────────────────────────────┘

Dependencies flow: UI → Controllers → Use Cases → Entities
```

**Rule:** Inner layers know nothing about outer layers.

---

## Layer 1: Entities (Domain Layer)

**Pure business logic, no framework dependencies.**

Represents the core business rules that would exist even without the application.

### Characteristics

- ✅ Pure TypeScript/JavaScript (no framework imports)
- ✅ Business rules and validations
- ✅ Value objects and domain entities
- ❌ No database, UI, or external service dependencies

### Example: User Entity

```ts
// domain/entities/User.ts
export class User {
  constructor(
    public readonly id: string,
    public readonly email: string,
    private passwordHash: string
  ) {}
  
  verifyPassword(password: string): boolean {
    // Pure business logic
    return hashPassword(password) === this.passwordHash
  }
  
  changePassword(currentPassword: string, newPassword: string): void {
    if (!this.verifyPassword(currentPassword)) {
      throw new InvalidPasswordError()
    }
    
    if (newPassword.length < 8) {
      throw new WeakPasswordError()
    }
    
    this.passwordHash = hashPassword(newPassword)
  }
}
```

### Example: Value Object

```ts
// domain/value-objects/EmailAddress.ts
export class EmailAddress {
  private constructor(private readonly value: string) {}
  
  static create(email: string): EmailAddress {
    if (!this.isValid(email)) {
      throw new InvalidEmailError(email)
    }
    return new EmailAddress(email.toLowerCase())
  }
  
  private static isValid(email: string): boolean {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
  }
  
  toString(): string {
    return this.value
  }
}
```

---

## Layer 2: Use Cases (Application Layer)

**Orchestrate entity interactions to fulfill application use cases.**

Contains application-specific business rules.

### Characteristics

- ✅ Depends on entities (inner layer)
- ✅ Defines interfaces for repositories/services (abstractions)
- ✅ Coordinates entity interactions
- ❌ No framework-specific code
- ❌ No database or UI details

### Example: Register User Use Case

```ts
// application/use-cases/RegisterUser.ts
import { User } from '../../domain/entities/User'
import { EmailAddress } from '../../domain/value-objects/EmailAddress'

// Abstractions (interfaces) defined in application layer
export interface UserRepository {
  findByEmail(email: string): Promise<User | null>
  save(user: User): Promise<void>
}

export interface EmailService {
  sendWelcomeEmail(email: string): Promise<void>
}

export class RegisterUserUseCase {
  constructor(
    private userRepository: UserRepository,
    private emailService: EmailService
  ) {}
  
  async execute(email: string, password: string): Promise<User> {
    // Validate input with value object
    const emailAddress = EmailAddress.create(email)
    
    // Business rule: no duplicate emails
    const existingUser = await this.userRepository.findByEmail(emailAddress.toString())
    if (existingUser) {
      throw new UserAlreadyExistsError()
    }
    
    // Create entity
    const user = new User(
      generateId(),
      emailAddress.toString(),
      hashPassword(password)
    )
    
    // Persist
    await this.userRepository.save(user)
    
    // Side effect
    await this.emailService.sendWelcomeEmail(user.email)
    
    return user
  }
}
```

---

## Layer 3: Interface Adapters

**Convert data between use cases and external systems.**

Adapters translate between the formats most convenient for use cases and entities, and the formats required by external agencies like databases, web, devices, etc.

### Characteristics

- ✅ Implements interfaces defined in application layer
- ✅ Converts data formats (e.g., DB rows → domain entities)
- ✅ Framework-specific code allowed here
- ❌ No business logic

### Example: User Repository Implementation

```ts
// infrastructure/repositories/UserRepositoryImpl.ts
import { UserRepository } from '../../application/use-cases/RegisterUser'
import { User } from '../../domain/entities/User'

export class UserRepositoryImpl implements UserRepository {
  async findByEmail(email: string): Promise<User | null> {
    // Database-specific query
    const row = await db.query(
      'SELECT id, email, password_hash FROM users WHERE email = ?',
      [email]
    )
    
    if (!row) {
      return null
    }
    
    // Convert database row to domain entity
    return new User(row.id, row.email, row.password_hash)
  }
  
  async save(user: User): Promise<void> {
    // Convert domain entity to database format
    await db.query(
      'INSERT INTO users (id, email, password_hash) VALUES (?, ?, ?)',
      [user.id, user.email, user['passwordHash']]
    )
  }
}
```

### Example: Email Service Implementation

```ts
// infrastructure/services/EmailServiceImpl.ts
import { EmailService } from '../../application/use-cases/RegisterUser'
import { sendEmail } from 'some-email-provider' // External dependency

export class EmailServiceImpl implements EmailService {
  async sendWelcomeEmail(email: string): Promise<void> {
    // External email provider-specific code
    await sendEmail({
      to: email,
      subject: 'Welcome!',
      body: 'Thanks for registering',
    })
  }
}
```

---

## Layer 4: Frameworks & Drivers

**UI, Database, Web frameworks, External services.**

This is where framework-specific code lives (React, Express, database drivers).

### Example: React Component (UI)

```tsx
// presentation/components/RegisterForm.tsx
import { useState } from 'react'
import { RegisterUserUseCase } from '../../application/use-cases/RegisterUser'

interface RegisterFormProps {
  registerUserUseCase: RegisterUserUseCase
}

export function RegisterForm({ registerUserUseCase }: RegisterFormProps) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    
    try {
      await registerUserUseCase.execute(email, password)
      // Success: redirect or show message
    } catch (err) {
      if (err instanceof UserAlreadyExistsError) {
        setError('Email already registered')
      } else {
        setError('Registration failed')
      }
    }
  }
  
  return (
    <form onSubmit={handleSubmit}>
      <input value={email} onChange={(e) => setEmail(e.target.value)} />
      <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
      <button type="submit">Register</button>
      {error && <p>{error}</p>}
    </form>
  )
}
```

### Example: Dependency Injection (Composition Root)

```ts
// main.ts (application entry point)
import { RegisterUserUseCase } from './application/use-cases/RegisterUser'
import { UserRepositoryImpl } from './infrastructure/repositories/UserRepositoryImpl'
import { EmailServiceImpl } from './infrastructure/services/EmailServiceImpl'

// Wire up dependencies (outer layers create inner layers)
const userRepository = new UserRepositoryImpl()
const emailService = new EmailServiceImpl()
const registerUserUseCase = new RegisterUserUseCase(userRepository, emailService)

// Pass to UI
<RegisterForm registerUserUseCase={registerUserUseCase} />
```

---

## Benefits of Clean Architecture

### 1. Framework Independence

Business logic doesn't depend on React, Express, or any framework.

```ts
// ✅ Use case works with ANY UI framework
const user = await registerUserUseCase.execute(email, password)
```

### 2. Testability

Test business logic without frameworks, databases, or UI.

```ts
// Easy to test with mocks
const mockRepository: UserRepository = {
  findByEmail: vi.fn().mockResolvedValue(null),
  save: vi.fn(),
}

const mockEmailService: EmailService = {
  sendWelcomeEmail: vi.fn(),
}

const useCase = new RegisterUserUseCase(mockRepository, mockEmailService)
await useCase.execute('test@example.com', 'password123')

expect(mockRepository.save).toHaveBeenCalled()
```

### 3. Database Independence

Switch databases without touching business logic.

```ts
// PostgreSQL implementation
class PostgresUserRepository implements UserRepository { /* ... */ }

// MongoDB implementation
class MongoUserRepository implements UserRepository { /* ... */ }

// Use case doesn't care!
const useCase = new RegisterUserUseCase(postgresRepo, emailService)
// OR
const useCase = new RegisterUserUseCase(mongoRepo, emailService)
```

### 4. UI Independence

Same business logic works for web, mobile, CLI.

```ts
// React web app
<RegisterForm registerUserUseCase={useCase} />

// React Native mobile app
<MobileRegisterScreen registerUserUseCase={useCase} />

// CLI tool
await useCase.execute(cliEmail, cliPassword)
```

---

## Folder Structure Example

```
src/
├── domain/               # Layer 1: Entities
│   ├── entities/
│   │   └── User.ts
│   └── value-objects/
│       └── EmailAddress.ts
│
├── application/          # Layer 2: Use Cases
│   └── use-cases/
│       └── RegisterUser.ts
│
├── infrastructure/       # Layer 3: Interface Adapters
│   ├── repositories/
│   │   └── UserRepositoryImpl.ts
│   └── services/
│       └── EmailServiceImpl.ts
│
└── presentation/         # Layer 4: Frameworks & Drivers
    ├── components/
    │   └── RegisterForm.tsx
    └── main.ts
```

---

## Quick Reference

| Layer | Purpose | Dependencies | Examples |
|-------|---------|--------------|----------|
| **Entities** | Business rules | None | User, Order, Product |
| **Use Cases** | Application logic | Entities only | RegisterUser, PlaceOrder |
| **Adapters** | Convert data | Use Cases, Entities | UserRepositoryImpl, Controllers |
| **Frameworks** | External tools | All inner layers | React, Express, Database |

**Golden Rule:** Dependencies always point inward (toward business logic).

---

## Further Reading

- [The Clean Architecture](https://blog.cleancoder.com/uncle-bob/2012/08/13/the-clean-architecture.html) by Uncle Bob
- [Domain-Driven Design](https://martinfowler.com/bliki/DomainDrivenDesign.html) by Martin Fowler
- [Hexagonal Architecture](https://alistair.cockburn.us/hexagonal-architecture/) by Alistair Cockburn
- [Clean Architecture in TypeScript](https://khalilstemmler.com/articles/software-design-architecture/organizing-app-logic/) by Khalil Stemmler
