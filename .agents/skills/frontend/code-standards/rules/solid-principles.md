# SOLID Principles

Object-oriented design principles for creating maintainable, flexible class hierarchies in TypeScript.

For deeper understanding, see [SOLID Principles Explained](https://en.wikipedia.org/wiki/SOLID).

---

## S - Single Responsibility Principle

**A class should have only one reason to change.**

Each class should have one job, one responsibility.

### ❌ Bad (multiple responsibilities)

```ts
class User {
  constructor(private data: UserData) {}
  
  // Responsibility 1: Data management
  getData(): UserData {
    return this.data
  }
  
  // Responsibility 2: Persistence
  save() {
    database.save(this.data)
  }
  
  // Responsibility 3: Communication
  sendEmail() {
    emailService.send(this.data.email, 'Welcome')
  }
  
  // Responsibility 4: Reporting
  generateReport() {
    return reportGenerator.create(this.data)
  }
}
```

**Why it's bad:** User class will change if:
- Data structure changes
- Database changes
- Email provider changes
- Report format changes

### ✅ Good (single responsibility)

```ts
// Responsibility: Represent user data
class User {
  constructor(private data: UserData) {}
  
  getData(): UserData {
    return this.data
  }
}

// Responsibility: Persist users
class UserRepository {
  save(user: User): Promise<void> {
    return database.save(user.getData())
  }
  
  findById(id: string): Promise<User | null> {
    const data = await database.findById(id)
    return data ? new User(data) : null
  }
}

// Responsibility: Send user emails
class UserEmailService {
  sendWelcomeEmail(user: User): Promise<void> {
    return emailService.send(user.getData().email, 'Welcome')
  }
}

// Responsibility: Generate user reports
class UserReportGenerator {
  generate(user: User): Report {
    return reportGenerator.create(user.getData())
  }
}
```

**Benefits:**
- Each class has one reason to change
- Easier to test in isolation
- Can reuse components independently

---

## O - Open/Closed Principle

**Open for extension, closed for modification.**

You should be able to add new functionality without changing existing code.

### ❌ Bad (must modify class to add features)

```ts
class PaymentProcessor {
  processPayment(type: string, amount: number) {
    if (type === 'credit') {
      // Credit card logic
      console.log('Processing credit card payment')
    } else if (type === 'paypal') {
      // PayPal logic
      console.log('Processing PayPal payment')
    } else if (type === 'bitcoin') {
      // Bitcoin logic - MUST MODIFY THIS CLASS
      console.log('Processing Bitcoin payment')
    }
    // Every new payment type requires modifying this class!
  }
}
```

### ✅ Good (extend without modifying)

```ts
// Abstraction (stable interface)
interface PaymentMethod {
  process(amount: number): Promise<void>
}

// Implementations (extensions)
class CreditCardPayment implements PaymentMethod {
  process(amount: number): Promise<void> {
    console.log(`Processing $${amount} via credit card`)
    // Credit card logic
  }
}

class PayPalPayment implements PaymentMethod {
  process(amount: number): Promise<void> {
    console.log(`Processing $${amount} via PayPal`)
    // PayPal logic
  }
}

class PaymentProcessor {
  constructor(private method: PaymentMethod) {}
  
  processPayment(amount: number): Promise<void> {
    return this.method.process(amount)
  }
}

// Usage: extend by adding new payment methods without modifying existing code
const creditCardProcessor = new PaymentProcessor(new CreditCardPayment())
await creditCardProcessor.processPayment(100)

const paypalProcessor = new PaymentProcessor(new PayPalPayment())
await paypalProcessor.processPayment(100)

// Add new payment method without changing PaymentProcessor
class BitcoinPayment implements PaymentMethod {
  process(amount: number): Promise<void> {
    console.log(`Processing $${amount} via Bitcoin`)
    // Bitcoin logic
  }
}

const bitcoinProcessor = new PaymentProcessor(new BitcoinPayment())
await bitcoinProcessor.processPayment(100)
```

**Benefits:**
- Add features without touching existing code
- Reduces risk of breaking existing functionality
- Follows dependency inversion (depend on abstractions)

---

## L - Liskov Substitution Principle

**Subtypes must be substitutable for their base types.**

If S is a subtype of T, you should be able to replace T with S without breaking the program.

### ❌ Bad (violates LSP)

```ts
class Bird {
  fly(): void {
    console.log('Flying')
  }
}

class Sparrow extends Bird {
  fly(): void {
    console.log('Sparrow flying')
  }
}

class Penguin extends Bird {
  fly(): void {
    throw new Error('Penguins cannot fly') // Breaks LSP!
  }
}

// This breaks when using Penguin
function makeBirdFly(bird: Bird) {
  bird.fly() // Works for Sparrow, throws for Penguin!
}
```

### ✅ Good (respects LSP)

```ts
interface Bird {
  move(): void
}

class FlyingBird implements Bird {
  move(): void {
    this.fly()
  }
  
  private fly(): void {
    console.log('Flying')
  }
}

class Penguin implements Bird {
  move(): void {
    this.swim()
  }
  
  private swim(): void {
    console.log('Swimming')
  }
}

// Works for all birds
function makeBirdMove(bird: Bird) {
  bird.move() // Always works!
}

makeBirdMove(new FlyingBird()) // Flying
makeBirdMove(new Penguin())     // Swimming
```

**Benefits:**
- Polymorphism works correctly
- No unexpected exceptions
- Predictable behavior

---

## I - Interface Segregation Principle

**Clients shouldn't depend on interfaces they don't use.**

Prefer many specific interfaces over one general-purpose interface.

### ❌ Bad (fat interface)

```ts
interface Worker {
  work(): void
  eat(): void
  sleep(): void
}

class Human implements Worker {
  work(): void { console.log('Working') }
  eat(): void { console.log('Eating') }
  sleep(): void { console.log('Sleeping') }
}

class Robot implements Worker {
  work(): void { console.log('Working') }
  eat(): void { /* Robots don't eat! */ }
  sleep(): void { /* Robots don't sleep! */ }
}
```

### ✅ Good (segregated interfaces)

```ts
interface Workable {
  work(): void
}

interface Eatable {
  eat(): void
}

interface Sleepable {
  sleep(): void
}

class Human implements Workable, Eatable, Sleepable {
  work(): void { console.log('Working') }
  eat(): void { console.log('Eating') }
  sleep(): void { console.log('Sleeping') }
}

class Robot implements Workable {
  work(): void { console.log('Working') }
  // Only implements what it needs
}
```

**Benefits:**
- No unused methods
- Smaller, focused interfaces
- Easier to implement

---

## D - Dependency Inversion Principle

**Depend on abstractions, not concretions.**

High-level modules shouldn't depend on low-level modules. Both should depend on abstractions.

### ❌ Bad (depends on concrete implementation)

```ts
class EmailService {
  send(to: string, message: string): void {
    // Send via Gmail
    console.log(`Sending via Gmail to ${to}: ${message}`)
  }
}

class UserService {
  private emailService = new EmailService() // Tightly coupled!
  
  registerUser(user: User): void {
    // ... registration logic
    this.emailService.send(user.email, 'Welcome')
  }
}

// Can't easily switch email providers or test with mock
```

### ✅ Good (depends on abstraction)

```ts
// Abstraction
interface MessageSender {
  send(to: string, message: string): Promise<void>
}

// Concrete implementation
class EmailService implements MessageSender {
  send(to: string, message: string): Promise<void> {
    console.log(`Sending via Gmail to ${to}: ${message}`)
    // Gmail logic
  }
}

class SMSService implements MessageSender {
  send(to: string, message: string): Promise<void> {
    console.log(`Sending SMS to ${to}: ${message}`)
    // SMS logic
  }
}

// High-level module depends on abstraction
class UserService {
  constructor(private messageSender: MessageSender) {} // Depends on abstraction
  
  async registerUser(user: User): Promise<void> {
    // ... registration logic
    await this.messageSender.send(user.email, 'Welcome')
  }
}

// Usage: inject dependency
const emailService = new EmailService()
const userService = new UserService(emailService)

// Easy to switch implementations
const smsService = new SMSService()
const userServiceWithSMS = new UserService(smsService)

// Easy to test with mock
class MockMessageSender implements MessageSender {
  send = vi.fn()
}
const mockSender = new MockMessageSender()
const testUserService = new UserService(mockSender)
```

**Benefits:**
- Loose coupling
- Easy to swap implementations
- Testable with mocks/stubs
- Flexible architecture

---

## Quick Reference

| Principle | Acronym | Guideline |
|-----------|---------|-----------|
| **Single Responsibility** | **S** | One class, one reason to change |
| **Open/Closed** | **O** | Open for extension, closed for modification |
| **Liskov Substitution** | **L** | Subtypes are fully substitutable |
| **Interface Segregation** | **I** | Many specific interfaces > one fat interface |
| **Dependency Inversion** | **D** | Depend on abstractions, not concretions |

---

## When to Apply SOLID

**Use SOLID when:**
- Building class-based architectures
- Creating reusable libraries/frameworks
- Designing domain models (DDD)
- Long-lived, evolving codebases

**SOLID is less relevant for:**
- Simple utility functions
- One-off scripts
- Pure functional programming
- React components (prefer composition over inheritance)

---

## Further Reading

- [SOLID Principles](https://en.wikipedia.org/wiki/SOLID) - Wikipedia
- [Principles of OOD](http://butunclebob.com/ArticleS.UncleBob.PrinciplesOfOod) - Uncle Bob
- [SOLID Principles for TypeScript](https://khalilstemmler.com/articles/solid-principles/solid-typescript/) - Khalil Stemmler
