# React Testing

Testing patterns and best practices for React using Vitest + React Testing Library.

## Structure

- `rules/` - Individual rule files organized by category
  - `_sections.md` - Section definitions (new tests, common patterns, TypeScript, legacy)
  - `_template.md` - Template for creating new test rules
  - Individual rule files (e.g., `new-tests.md`, `common-patterns.md`)
- `SKILL.md` - Quick reference for AI agents

## Categories

### 1. Creating New Tests
- AAA (Arrange, Act, Assert) pattern
- Descriptive test names
- `it.each()` for parameterized tests
- Setup and teardown best practices

### 2. Common Patterns
- User event simulation
- Async testing patterns
- Mock strategies
- Component rendering patterns

### 3. TypeScript Testing
- Type-safe mocks
- Generic test utilities
- Type assertions in tests

### 4. Legacy Refactoring
- Migrating from Sinon to Vitest
- Converting Enzyme to React Testing Library
- Updating assertion patterns
- Modernizing async tests

## Quick Reference

**Basic Test Structure:**
```typescript
describe('Component', () => {
  it('should render correctly', () => {
    // Arrange
    render(<Component />)
    
    // Act
    const button = screen.getByRole('button')
    
    // Assert
    expect(button).toBeInTheDocument()
  })
})
```

## Creating a New Rule

1. Copy `rules/_template.md` to `rules/<prefix>-<description>.md`
2. Use appropriate prefix:
   - `new-` for creating new tests
   - `common-` for common patterns
   - `typescript-` for TypeScript testing
   - `legacy-` for legacy refactoring
3. Fill in frontmatter with testing-specific tags
4. Include test code examples

## Usage

Reference this skill when:
- Writing new tests
- Refactoring existing tests
- Migrating from legacy testing tools
- Reviewing test code
- Setting up testing infrastructure
