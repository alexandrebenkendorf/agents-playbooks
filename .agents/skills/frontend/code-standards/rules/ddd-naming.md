# Domain-Driven Design Naming Conventions

Naming conventions for Domain-Driven Design (DDD) and Clean Architecture patterns.

---

## General Principles

- Domain concepts MUST be expressed in **Ubiquitous Language**
- File names, folder names, and exported symbols must tell the **same story**
- Domain layer naming should reflect business concepts, not technical implementation

---

## Domain Layer (DDD / Clean Architecture)

### Entities, Value Objects, Services

- **MUST use PascalCase**

```txt
domain/
  entities/
    User.ts
    Booking.ts
    Payment.ts
  value-objects/
    EmailAddress.ts
    MonetaryAmount.ts
  services/
    BookingService.ts
    PaymentProcessor.ts
```

```ts
// domain/entities/User.ts
export class User {}
export type UserId = string

// domain/value-objects/EmailAddress.ts
export class EmailAddress {
  constructor(private readonly value: string) {}
}

// domain/services/BookingService.ts
export interface BookingService {
  createBooking(params: CreateBookingParams): Promise<Booking>
}
```

### Domain file naming

- Domain files **SHOULD match the exported type name**
- PascalCase file names are **recommended** in the domain layer

```txt
✅ Good
domain/entities/User.ts       → exports User
domain/entities/Booking.ts    → exports Booking

❌ Bad
domain/entities/user.ts       → exports User (mismatch)
domain/entities/booking-entity.ts → exports Booking (noise)
```

---

## Aggregates and Repositories

- **MUST use PascalCase**
- Repositories SHOULD use the `Repository` suffix

```ts
// domain/aggregates/UserAggregate.ts
export class UserAggregate {
  constructor(private user: User) {}
}

// domain/repositories/UserRepository.ts
export interface UserRepository {
  findById(id: UserId): Promise<User | null>
  save(user: User): Promise<void>
}
```

---

## Use Cases / Application Services

- **MUST use PascalCase**
- Use descriptive names that reflect business operations

```ts
// application/use-cases/CreateBookingUseCase.ts
export class CreateBookingUseCase {
  execute(params: CreateBookingParams): Promise<Booking> {}
}

// application/services/AuthenticationService.ts
export interface AuthenticationService {
  login(credentials: Credentials): Promise<UserSession>
}
```

---

## Summary

| Concept                | Naming     | Example              |
| ---------------------- | ---------- | -------------------- |
| Entities               | PascalCase | User, Booking        |
| Value Objects          | PascalCase | EmailAddress, Money  |
| Domain Services        | PascalCase | BookingService       |
| Repositories           | PascalCase | UserRepository       |
| Aggregates             | PascalCase | UserAggregate        |
| Use Cases              | PascalCase | CreateBookingUseCase |
| Application Services   | PascalCase | AuthenticationService|
| Domain type aliases    | PascalCase | UserId, BookingId    |

---

## Rationale

These conventions align with:
- Domain-Driven Design principles (Ubiquitous Language)
- Clean Architecture layering
- TypeScript type/value distinction
- Large-scale, long-lived application architectures

They optimize for:
- Business domain clarity
- Layer boundaries enforcement
- Team communication using shared vocabulary
- Refactoring safety through explicit naming
