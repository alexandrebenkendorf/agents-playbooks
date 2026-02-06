# Testing Patterns Cheat Sheet

**Quick reference for Vitest + React Testing Library**

## Basic Test Structure

```typescript
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

describe('ComponentName', () => {
  it('should do something specific', async () => {
    // Arrange
    render(<ComponentName prop="value" />)

    // Act
    await userEvent.click(screen.getByRole('button'))

    // Assert
    expect(screen.getByText('Expected')).toBeInTheDocument()
  })
})
```

## Common Queries (Priority Order)

```typescript
// ✅ Accessible to everyone
screen.getByRole('button', { name: /submit/i });
screen.getByLabelText('Email');
screen.getByPlaceholderText('Enter email');
screen.getByText('Submit');

// ⚠️ Semantic fallbacks
screen.getByAltText('Profile picture');
screen.getByTitle('Close');

// ❌ Last resort (implementation details)
screen.getByTestId('submit-button');
```

## User Interactions

```typescript
const user = userEvent.setup();

// Click
await user.click(screen.getByRole('button'));

// Type
await user.type(screen.getByLabelText('Email'), 'test@example.com');

// Clear and type
await user.clear(input);
await user.type(input, 'new value');

// Select
await user.selectOptions(screen.getByRole('combobox'), 'option1');

// Keyboard
await user.keyboard('{Enter}');
await user.keyboard('{Escape}');
```

## Async Patterns

```typescript
// Wait for element to appear
const element = await screen.findByText('Success');

// Wait for element to disappear
await waitForElementToBeRemoved(() => screen.queryByText('Loading'));

// Wait for callback
await waitFor(() => {
  expect(mockFn).toHaveBeenCalled();
});
```

## Mocking

```typescript
// Mock functions
const mockFn = vi.fn()
const mockFn = vi.fn().mockReturnValue('value')
const mockFn = vi.fn().mockResolvedValue({ data: 'async' })

// Mock modules
vi.mock('./api', () => ({
  fetchUser: vi.fn().mockResolvedValue({ name: 'John' })
}))

// Spy on methods
const spy = vi.spyOn(object, 'method')
spy.mockReturnValue('value')
spy.mockRestore()

// Mock timers
vi.useFakeTimers()
vi.advanceTimersByTime(1000)
vi.runAllTimers()
vi.useRealTimers()
```

## Common Assertions

```typescript
// Existence
expect(element).toBeInTheDocument();
expect(element).not.toBeInTheDocument();

// Visibility
expect(element).toBeVisible();
expect(element).not.toBeVisible();

// Enabled/Disabled
expect(button).toBeEnabled();
expect(button).toBeDisabled();

// Value
expect(input).toHaveValue('text');
expect(checkbox).toBeChecked();

// Text content
expect(element).toHaveTextContent('Hello');
expect(element).toHaveTextContent(/hello/i);

// Attributes
expect(link).toHaveAttribute('href', '/home');
expect(element).toHaveClass('active');

// Function calls
expect(mockFn).toHaveBeenCalled();
expect(mockFn).toHaveBeenCalledTimes(2);
expect(mockFn).toHaveBeenCalledWith('arg1', 'arg2');
```

## Parameterized Tests

```typescript
it.each([
  { input: 'test@example.com', expected: true },
  { input: 'invalid', expected: false },
])('validates $input as $expected', ({ input, expected }) => {
  expect(validateEmail(input)).toBe(expected);
});
```

## Setup & Teardown

```typescript
// Before each test
beforeEach(() => {
  vi.clearAllMocks();
});

// After each test
afterEach(() => {
  vi.restoreAllMocks();
});

// Cleanup
afterEach(() => {
  cleanup();
});
```

## Common Mistakes to Avoid

```typescript
// ❌ Don't use act() with userEvent
act(() => {
  userEvent.click(button) // Wrong!
})

// ✅ Do this instead
await userEvent.click(button)

// ❌ Don't query before render
const element = screen.getByRole('button')
render(<Component />)

// ✅ Render first
render(<Component />)
const element = screen.getByRole('button')

// ❌ Don't use async without await
it('test', async () => {
  userEvent.click(button) // Missing await!
})

// ✅ Always await userEvent
it('test', async () => {
  await userEvent.click(button)
})
```

## Quick Debugging

```typescript
// See current DOM
screen.debug();

// See specific element
screen.debug(screen.getByRole('button'));

// Print accessible tree
screen.logTestingPlaygroundURL();
```
