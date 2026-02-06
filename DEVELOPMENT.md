# Development Guide

Welcome! This guide helps you navigate the coding standards, conventions, and best practices for this repository.

---

## Quick Links

- [AI Agent Skills & Playbooks](./.agents/README.md) - Operational documentation
- [Commit Conventions](#commit-conventions)
- [Coding Standards](#coding-standards)
- [Testing Guidelines](#testing-guidelines)
- [Performance Patterns](#performance-patterns)
- [Agents & Playbooks](#agents--playbooks)

---

## Commit Conventions

All commits must follow the conventional commit format:

```
<type>: <ticket-prefix>-<ticket-number> <description>
```

**Where:**

- `<type>` = Commit type (feat, fix, docs, etc.)
- `<ticket-prefix>` = Your project ticket prefix (e.g., PROJ, JIRA, TASK)
- `<ticket-number>` = Ticket number
- `<description>` = Imperative description

### Configuration

Set your ticket prefix in `.agents/README.md`:

```markdown
# Project Configuration

- **Ticket Prefix**: `PROJ` (e.g., JIRA, DEV, TASK)
- **Branch Format**: `<PREFIX>-<number>-description`
```

### Commit Types

| Type       | Usage                                                                                                  |
| ---------- | ------------------------------------------------------------------------------------------------------ |
| `feat`     | A new feature                                                                                          |
| `fix`      | A bug fix                                                                                              |
| `docs`     | Documentation only changes                                                                             |
| `style`    | Changes that do not affect the meaning of the code (white-space, formatting, missing semi-colons, etc) |
| `refactor` | A code change that neither fixes a bug nor adds a feature                                              |
| `perf`     | A code change that improves performance                                                                |
| `test`     | Adding missing tests or correcting existing tests                                                      |
| `build`    | Changes that affect the build system or external dependencies                                          |
| `ci`       | Changes to our CI configuration files and scripts                                                      |
| `chore`    | Other changes that don't modify src or test files                                                      |
| `revert`   | Reverts a previous commit                                                                              |
| `rollback` | Rolling back to a previous version                                                                     |

### Message Guidelines

- **Use imperative mood** in the description (e.g., "Add feature" not "Added feature")
- **Keep the description concise** but descriptive
- **Capitalize the first letter** of the description
- **Do not end with a period**

### Ticket Number Format

- Always include the **ticket number** from your current branch
- Extract the ticket number from your branch name
  - Example: `PROJ-134713-FE-Add-GitHub-unittest.instructions.md-for-vitest` → `PROJ-134713`
  - Example: `TASK-456-implement-user-auth` → `TASK-456`

### Examples

```bash
# Adding a new feature
git commit -m "feat: PROJ-134713 Add GitHub unittest instructions for Vitest best practices"
git commit -m "feat: TASK-456 Implement user authentication flow"

# Fixing a bug
git commit -m "fix: PROJ-134714 Resolve memory leak in component unmounting"
git commit -m "fix: JIRA-789 Correct email validation regex"

# Documentation update
git commit -m "docs: PROJ-134715 Update API documentation for user service"

# Refactoring code
git commit -m "refactor: PROJ-134716 Simplify user authentication logic"

# Rolling back changes
git commit -m "rollback: PROJ-134717 Revert to previous version due to performance issues"

# Adding tests
git commit -m "test: PROJ-134718 Add unit tests for UserProfile component"

# Performance improvement
git commit -m "perf: PROJ-134719 Optimize database query for user search"
```

**💡 Tip:** Ask your AI assistant to analyze your changes and generate the commit message:

```
"Review my staged changes and create a commit message"
```

📖 [Full commit guidelines](./.agents/skills/git/commit-conventions/SKILL.md)

---

## Coding Standards

### Naming Conventions

| Concept              | Convention                 | Example                      |
| -------------------- | -------------------------- | ---------------------------- |
| Feature folders      | `kebab-case`               | `user-profile/`              |
| React components     | `PascalCase`               | `UserProfile.tsx`            |
| Hooks                | `camelCase` (prefix `use`) | `useAuth.ts`                 |
| Functional utilities | `kebab-case`               | `date-formatter.ts`          |
| Utility classes      | `PascalCase`               | `DateFormatter`              |
| Types/Interfaces     | `PascalCase`               | `User`, `ApiResponse<T>`     |
| Domain entities      | `PascalCase`               | `User`, `Booking`, `Payment` |

### React Component Structure

✅ **Do:**

- Use function declarations: `function UserProfile() {}`
- Define props interface right before component
- Place simple helpers after component
- Extract complex helpers to utility files

❌ **Don't:**

- Use arrow functions with const: `const UserProfile = () => {}`
- Use `React.FC` (implicit children, allows undefined returns)
- Place 5+ helpers before the component
- Create "god components" (300+ lines)

**File Organization:**

```tsx
// 1. Imports
// 2. Constants
// 3. Props interface
// 4. Component
// 5. Simple helpers
// 6. Export
```

### Function Design

✅ **Do:**

- Use verb names: `calculateTotal()`, `fetchUser()`, `validateToken()`
- Keep functions under ~50 lines
- Use early returns over deep nesting
- Avoid `else` clauses (use early returns)
- Separate commands (mutate) from queries (read)
- Max 3 parameters (use options object if more)

❌ **Don't:**

- Use noun names: `total()`, `user()`, `validation()`
- Write functions longer than ~50 lines
- Nest more than 2 levels deep
- Chain `if/else` statements
- Mix mutations with queries
- Use flag parameters (split into specific functions)

### TypeScript

✅ **Do:**

- Use `interface` for object shapes
- Use `type` for unions and tuples
- Use `unknown` instead of `any`
- Let TypeScript infer return types (for internal functions)

❌ **Don't:**

- Use `any` without `@ts-expect-error`
- Add explicit return types everywhere
- Declare multiple variables on one line

### Clean Code Essentials

**Meaningful Names:**

```ts
// ❌ Bad
const d = 7;

// ✅ Good
const daysUntilExpiration = 7;
```

**DRY (Don't Repeat Yourself):**
Extract duplicated logic into reusable functions.

**Prefer Exceptions:**

```ts
// ❌ Don't return error codes
function deleteUser(id: string): number;

// ✅ Do throw exceptions
function deleteUser(id: string): void {
  if (!exists(id)) throw new UserNotFoundError();
}
```

📖 [Full coding standards](./.agents/skills/frontend/code-standards/)
📖 [Clean Code Principles](./.agents/skills/frontend/code-standards/rules/clean-code-principles.md)
📖 [SOLID Principles](./.agents/skills/frontend/code-standards/rules/solid-principles.md)
📖 [Clean Architecture](./.agents/skills/frontend/code-standards/rules/clean-architecture.md)

---

## Testing Guidelines

### Writing Tests

```typescript
describe('ComponentName', () => {
  it('should do something specific', () => {
    // Arrange
    const { getByRole } = render(<Component />)

    // Act
    fireEvent.click(getByRole('button'))

    // Assert
    expect(getByRole('alert')).toBeInTheDocument()
  })
})
```

### Key Principles

- Use `it.each` for testing multiple cases
- Follow AAA pattern (Arrange, Act, Assert)
- Test behavior, not implementation
- Keep tests focused and isolated
- Aim for >95% coverage

**💡 Tip:** Ask your AI assistant for help:

```
"Convert this test to TypeScript following our testing guidelines"
"Add tests for the UserProfile component"
```

📖 [Full testing guidelines](./.agents/skills/frontend/react-testing/)

---

## Performance Patterns

### Quick Reference

**Data Structures:**

- Use `Map` for repeated lookups (O(1) vs O(n))
- Use `Set` for membership checks
- Build index maps for large datasets

**Arrays:**

- Use `.toSorted()` instead of `.sort()` (immutable)
- Check length before expensive operations
- Combine multiple iterations into one loop

**Caching:**

- Cache property access in loops
- Cache function results with `Map`
- Cache storage API calls (`localStorage`, cookies)

**DOM Performance:**

- Batch DOM reads and writes separately
- Avoid layout thrashing
- Use CSS classes over inline styles

📖 [Full performance patterns](./.agents/skills/frontend/code-standards/SKILL.md#-javascript-performance)

---

## Working with AI Assistants

### How to Reference Skills

When asking AI assistants for help, reference the specific skill:

```
"Follow the testing guidelines to add tests for this component"
"Create a commit message following our conventions"
"Refactor this code according to our coding standards"
"Apply performance optimizations from our guidelines"
```

### Available Skills

1. **[frontend/code-standards](./.agents/skills/frontend/code-standards/)** - Naming conventions, coding standards, TypeScript, Clean Code, SOLID, Clean Architecture, performance patterns
2. **[frontend/react-component-structure](./.agents/skills/frontend/react-component-structure/)** - Function vs const, SRP, file organization
3. **[frontend/react-testing](./.agents/skills/frontend/react-testing/)** - Vitest and React Testing Library patterns
4. **[git/commit-conventions](./.agents/skills/git/commit-conventions/)** - Commit message format and atomic commits
5. **[frontend/react-best-practices](./.agents/skills/frontend/react-best-practices/)** - React/Next.js performance optimization (Vercel Labs)

### Skill Breakdown

**Frontend Code Standards includes:**

- React/TypeScript/DDD naming conventions
- React component structure (function vs const, file organization)
- General coding standards (function design, control flow)
- Helper function patterns (formatters, validators, parsers)
- TypeScript best practices (type safety, inference, interface vs type)
- Clean Code principles (meaningful names, DRY, exceptions)
- SOLID principles (Single Responsibility, Open/Closed, Liskov, Interface Segregation, Dependency Inversion)
- Clean Architecture (layers, entities, use cases, adapters)
- JavaScript performance (DOM, caching, data structures, arrays, control flow)

### Common Requests

```bash
# Commits
"Commit the changes"
"Split my staged changes into atomic commits"

# Testing
"Add unit tests for this component"
"Convert this test to TypeScript"

# Code Review
"Review this code against our coding standards"
"Check if this follows SOLID principles"
"Suggest performance improvements"

# Components
"Create a UserProfile component following our structure"
"Refactor this component - it's too long"

# Helpers
"Create a helper to format currency"
"Extract this logic into a utility function"

# Architecture
"Design this domain entity following Clean Architecture"
"Create a use case for user registration"

# Refactoring
"Refactor this to follow our naming conventions"
"Split this function - it's too long"
"Remove the else clauses using early returns"
```

---

## Project Commands

```bash
# Install dependencies
npm install

# Development
npm run dev

# Linting
npm run lint:fix

# Formatting
npm run format

# Testing
npm test                    # Run all tests
npm test -- <file> --run    # Run specific test file
npm test:coverage           # Run with coverage report

# Build
npm build
npm preview                 # Preview production build
```

---

## Definition of Done

Before considering work complete:

- [ ] Tests added or updated
- [ ] All tests passing (`npm test`)
- [ ] No lint errors (`npm run lint:fix`)
- [ ] Code formatted (`npm run format`)
- [ ] Follows naming conventions
- [ ] Follows coding standards
- [ ] Atomic commits with proper messages
- [ ] Documentation updated if needed

---

## Getting Help

- **Coding questions?** Ask your AI assistant to reference our skills
- **Unclear about a pattern?** Check the [skills directory](./.agents/skills/)
- **Found an issue?** Create a ticket in the project tracker
- **Contributing a new skill?** See [Agents & Playbooks](#agents--playbooks)

---

## Agents & Playbooks

**This is the BASE repository for shared agent skills.**

Skills here are synced to consumer repositories via git subtree.

### Base Repository Rules

This repository IS the source of truth:

✅ **DO edit skills directly in `.agents/skills/`**  
This is where skills are maintained and improved.

✅ **DO test changes with AI agents before committing**  
Ensure skills work as expected.

✅ **DO document changes in skill files and CHANGELOG**  
Help consumers understand updates.

✅ **DO follow semantic versioning principles**  
Breaking changes require clear communication.

❌ **DO NOT commit consumer-specific configuration**  
Keep this repo generic and reusable.

❌ **DO NOT commit secrets or project-specific tokens**  
Skills should be portable across projects.

### For Consumer Repositories

Projects that use these skills should:

1. **Sync via git subtree:**
   ```bash
   git subtree add --prefix=.agents/agents-playbooks \
     https://github.com/alexandrebenkendorf/agents-playbook.git main --squash
   ```

2. **Create `.agents/local/` for overrides:**
   - Repository-specific customizations
   - Experimental modifications
   - Takes precedence over base

3. **Never edit `.agents/agents-playbooks/` directly:**
   - It's managed by subtree
   - Changes lost on next pull

4. **Promote useful patterns back to base:**
   - Test in `.agents/local/`
   - Submit PR to this repo
   - Update subtree after merge
   - Remove local override

📖 **Full consumer documentation:** [.agents/README.md](./.agents/README.md)

---

## Contributing to Skills

If you identify a new pattern or best practice:

1. **Create or update skill in `.agents/skills/`**
2. **Test with AI agents:** Verify the skill works as expected
3. **Update documentation:** Keep SKILL.md and README.md current
4. **Update DEVELOPMENT.md:** If it introduces patterns for human developers
5. **Open PR:** Clear description of changes and rationale
6. **Update CHANGELOG.md:** Document changes for consumers
