# TypeScript Testing Guidelines

TypeScript-specific patterns and best practices for test files.

**Note:** For general TypeScript best practices (type safety, inference, interface vs type), see [code-standards/rules/typescript-best-practices.md](../../code-standards/rules/typescript-best-practices.md)

**Note:** For general clean coding principles (early returns, named functions, single-line statements), see [code-standards/rules/general-coding-standards.md](../../code-standards/rules/general-coding-standards.md)

## Conversion Rules

When converting tests from JavaScript to TypeScript:

- Be as DRY as possible
- DO NOT skip tests - ask for support if conversion is difficult
- Use `it.each` whenever possible
- Check for missing tests and remove redundant ones
- Fix all lint errors/warnings
- **IMPORTANT: Delete old test file before running tests**
- Run tests and ensure coverage is higher than 95%

## Test Organization

All tests must be wrapped in main `describe`:

```typescript
// For testing multiple helpers in one file:
describe('name-of-the-file', () => {
  /* tests */
});

// For testing default exported function:
describe('utilityName', () => {
  /* tests */
});

// For testing React component:
describe('MyComponent', () => {
  /* tests */
});
```

## Type Patterns

### Prefer Nullable<T>

```typescript
// ✅ CORRECT
function setup(value?: Nullable<string>) { /* ... */ }

// ❌ WRONG
function setup(value?: string | null) { /* ... */ }
```

### Global Vitest Imports

```typescript
// ❌ WRONG - Don't import in TypeScript files
import { describe, expect, it, vi } from 'vitest';

// ✅ CORRECT - They're available globally via tsconfig.json
describe('MyComponent', () => {
  it('should work', () => {
    const mock = vi.fn();
    expect(mock).not.toHaveBeenCalled();
  });
});
```

**Note:** JavaScript files (`.test.js`, `.test.jsx`) still need the import.

### Mixed JS/TS Codebase Workaround

If importing a JSX component in a TypeScript test causes React import warnings:

```typescript
// @ts-ignore - Suppresses React import warning in mixed JS/TS codebase
// TODO: Remove this workaround after full migration to TypeScript
import React from 'react';
```

## Test Data Types

**Note:** For comprehensive type vs interface guidelines, see [code-standards/rules/typescript-best-practices.md](../../code-standards/rules/typescript-best-practices.md)

### Use interface for complex test cases

When test cases have multiple properties or optional fields:

```typescript
interface TestCase {
  description: string;
  input: InputType;
  options?: OptionsType;
  expected: OutputType;
}
```

### Use type for simple tuple test cases

When test cases are simple positional arguments:

```typescript
type TestCase = [description: string, input: Type, expected: Type];
```

## Documentation in Tests

### Add JSDocs

Add comprehensive JSDocs to helpers and utilities:

```typescript
/**
 * Opens a dialog by clicking a tree item.
 * @param user - The userEvent instance for interactions
 * @returns Dialog element and commonly-used buttons
 */
async function openDialog(user: ReturnType<typeof userEvent.setup>) {
  // ...
}
```

### Inline Comments

- Add brief inline comments for non-obvious test fixtures
- Add AAA (Arrange, Act, Assert) comments in tests

```typescript
it('should save data', async () => {
  // Arrange
  const mockResponse = vi.fn().mockResolvedValue(createEmptyServerResponse());

  // Act
  fireEvent.click(saveButton);

  // Assert
  await waitFor(() => expect(mockResponse).toHaveBeenCalled());
});
```

## Example: Utilities Test

### Simple Test (Tuples)

For straightforward utilities with simple inputs:

```typescript
import { utilityName } from 'path/to/utilityName';

describe('utilityName', () => {
  type TestCase = [description: string, input: Type, expected: Type];

  const testCases: TestCase[] = [
    ['return true when value is positive', 5, true],
    ['return false when value is negative', -3, false],
    ['return false when value is zero', 0, false],
  ];

  it.each(testCases)('should %s', (_description, input, expected) => {
    // Arrange
    // (test data provided via it.each)

    // Act & Assert
    expect(utilityName(input)).toBe(expected);
  });
});
```

### Complex Test (Interfaces)

For complex test data with objects or optional properties:

```typescript
import { utilityName } from 'path/to/utilityName';

describe('utilityName', () => {
  interface TestCase {
    description: string;
    input: InputType;
    options?: OptionsType;
    expected: OutputType;
  }

  const testCases: TestCase[] = [
    {
      description: 'handle default options',
      input: { value: 'test' },
      expected: { processed: true },
    },
    {
      description: 'apply custom options',
      input: { value: 'test' },
      options: { strict: true },
      expected: { processed: true, validated: true },
    },
  ];

  it.each(testCases)('should $description', ({ input, options, expected }) => {
    // Arrange
    // (test data provided via it.each)

    // Act & Assert
    expect(utilityName(input, options)).toEqual(expected);
  });
});
```

### Component Test Example

```typescript
import { fireEvent, screen } from '@testing-library/react';
import React from 'react';

import { testRender } from '@/test';

import Button from './button';

function setup(props?: Partial<ComponentProps<typeof Button>>) {
  const defaultProps = {
    onClick: vi.fn(),
    label: 'Click me',
  };

  return testRender(<Button {...defaultProps} {...props} />);
}

describe('Button', () => {
  it('should call onClick when clicked', () => {
    // Arrange
    const mockOnClick = vi.fn();
    setup({ onClick: mockOnClick });

    // Act
    const button = screen.getByRole('button', { name: 'Click me' });
    fireEvent.click(button);

    // Assert
    expect(mockOnClick).toHaveBeenCalledTimes(1);
  });

  it('should be disabled when disabled prop is true', () => {
    // Arrange
    setup({ disabled: true });

    // Assert
    const button = screen.getByRole('button', { name: 'Click me' });
    expect(button).toBeDisabled();
  });
});
```

## Type Safety Tips

### Mock Type Inference

```typescript
// ✅ CORRECT - Type inference with vi.mocked
import { functionToMock } from '@/utils';

vi.mock('@/utils', async (importActual) => {
  const actual = await importActual<typeof import('@/utils')>();
  return {
    ...actual,
    functionToMock: vi.fn(),
  };
});

const mockFunction = vi.mocked(functionToMock);

// Now mockFunction has full type support
mockFunction.mockReturnValue('typed value');
```

### UserEvent Typing

```typescript
import userEvent, { UserEvent } from '@testing-library/user-event';

async function clickButton(user: UserEvent) {
  const button = screen.getByRole('button');
  await user.click(button);
}

// In test:
const user = userEvent.setup();
await clickButton(user); // Type-safe
```

## Next Steps

After converting to TypeScript:

1. Delete the old JavaScript test file
2. Run `npm prettier-fix`
3. Run `npx eslint <file-path> --fix`
4. Run tests: `npm test -- <file> --run`
5. Verify coverage is ≥95%
