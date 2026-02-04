# Common Patterns & Reference

Quick reference for common testing patterns, mistakes to avoid, and global setup information.

## Common Mistakes to Avoid

| ❌ WRONG | ✅ CORRECT |
|---------|-----------|
| `import userEvent from '@testing-library/user-event'` (unless needed) | `import { fireEvent } from '@testing-library/react'` |
| `await user.click(button)` (without setup) | `fireEvent.click(button)` OR setup once: `const user = userEvent.setup(); return { user }` |
| Creating userEvent in each test | Setup once in render helper, return and reuse |
| `import sinon from 'sinon'` | Use `vi` (globally available in TypeScript tests) |
| `sinon.stub()` or `sandbox.spy()` | `vi.fn()` |
| `import { describe, expect, it, vi } from 'vitest'` (in TS files) | No import needed in `.ts`/`.tsx` - globals via `tsconfig.json` |
| `vi.fn(() => response())` | `vi.fn().mockResolvedValue(response())` |
| `waitForElement(() => getElementByTestId('x'))` | `await screen.findByTestId('x')` |
| `getElementByTestId('nested', parent)` | `within(parent).getByTestId('nested')` |
| `createBackendServerResponse()` for save ops | `createEmptyServerResponse()` for save/delete |
| `act(() => { render(...) })` | Just `render(...)` (act is automatic) |
| Local afterEach with only global cleanup | No local afterEach needed |

## Core Testing Principles

### Test Environment Setup

- **Always use TestContainer wrapper** for consistent environment
- **Use params prop**: `params={{ applicationClientId: APPLICATION_CLIENT_ID }}`
- **Most cleanup is automatic** - See "Automatic Setup" section below
- **Only add local beforeEach/afterEach** if you need setup/cleanup NOT in global hooks

### Element Selection Priority

1. **Semantic queries** (best for accessibility):
   ```typescript
   screen.getByRole('button', { name: 'Submit' })
   screen.getByLabelText('Email')
   screen.getByText('Expected text')
   ```

2. **data-ta with screen queries**:
   ```typescript
   screen.getByTestId('save-button')
   const [firstItem] = screen.getAllByTestId('list-item')
   ```

3. **within() for nested elements**:
   ```typescript
   within(dialog).getByTestId('accept-button')
   ```

4. **querySelector** (last resort):
   ```typescript
   document.querySelector('[data-ta="container"] .nested-class')
   ```

### Test Structure and Naming

- **Follow AAA pattern**: Arrange, Act, Assert (with clear comments)
- **Use "should...when..." naming**:
  ```typescript
  it('should display error message when validation fails', async () => {
    // Arrange
    // Act
    // Assert
  });
  ```

### Component State Testing

Test all relevant states:
- ✅ Enabled/disabled states
- ✅ Selected/unselected states
- ✅ With/without data scenarios
- ✅ Loading and error states

## Mocking Patterns

### Callback Mocking

```typescript
// Create mock
const mockCallback = vi.fn();

// Verify calls
expect(mockCallback).toHaveBeenCalledTimes(1);
expect(mockCallback).toHaveBeenCalledWith('expected', 'args');
expect(mockCallback).not.toHaveBeenCalled();
```

### Backend Request Mocking

```typescript
// For save/delete/update (no data returned):
const mockResponse = vi.fn().mockResolvedValue(createEmptyServerResponse());
fetchMock.post('/api/save', mockResponse);

// For fetch (data returned):
const mockResponse = vi.fn().mockResolvedValue(
  createBackendServerResponse({ id: 1, name: 'Test' })
);
fetchMock.get('/api/fetch', mockResponse);

// Verify the mock was called:
await waitFor(() => expect(mockResponse).toHaveBeenCalledTimes(1));
```

## User Interaction Patterns

### fireEvent vs userEvent Decision Tree

```
Need to test user interaction?
│
├─ Simple single event? (click, change)
│  └─> Use fireEvent
│
└─ Complex realistic interaction? (typing, focus sequences)
   └─> Use userEvent
```

### fireEvent Examples

```typescript
// Click
fireEvent.click(button);

// Input change
fireEvent.change(input, { target: { value: 'New Value' } });

// Nested elements
const dialog = await screen.findByTestId('dialog');
const confirmButton = within(dialog).getByTestId('confirm-button');
fireEvent.click(confirmButton);
```

### userEvent Examples

```typescript
import userEvent, { UserEvent } from '@testing-library/user-event';

// Setup once per test
async function renderComponent() {
  const user = userEvent.setup();
  testRender(<Component />);
  
  await waitFor(() => {
    expect(screen.queryByTestId('skeleton-loader')).not.toBeInTheDocument();
  });
  
  return { user };
}

// Use in test
const { user } = await renderComponent();
await user.type(input, 'realistic typing');
await user.click(button);

// Helper function with user
async function clickDeleteIcon(user: UserEvent) {
  const [deleteIcon] = screen.getAllByTestId('delete-icon');
  await user.click(deleteIcon);
}
```

### Nested Modals Pattern

```typescript
// Use userEvent for main dialog
const mainDialog = await screen.findByTestId('main-dialog');
await user.click(within(mainDialog).getByRole('checkbox'));

// Use fireEvent for nested dialog buttons (avoids focus trap conflicts)
const cancelButton = within(mainDialog).getByTestId('cancel-button');
fireEvent.click(cancelButton); // Opens nested dialog

const nestedDialog = await screen.findByTestId('unsaved-changes-dialog');
const acceptButton = within(nestedDialog).getByTestId('accept-button');
fireEvent.click(acceptButton); // Avoids infinite loop
```

**Why?** `userEvent` simulates focus events which conflict with multiple modal focus traps, causing stack overflow errors.

## Async Testing Patterns

### waitFor

```typescript
// Wait for assertion to pass
await waitFor(() => {
  expect(mockResponse).toHaveBeenCalledTimes(1);
});

// Wait for element to appear
await screen.findByTestId('success-message');

// Wait for loading to complete
await waitFor(() => {
  expect(screen.queryByTestId('skeleton-loader')).not.toBeInTheDocument();
});
```

### Async Selectors

```typescript
// ✅ CORRECT - Modern pattern
const button = await screen.findByTestId('button');
const text = await screen.findByText('Loading...');

// ❌ WRONG - Old pattern (don't use)
const button = await waitForElement(() => getElementByTestId('button'));
```

### Specific Matchers

```typescript
// ✅ CORRECT
expect(input).toHaveValue('John');
expect(element).toHaveTextContent('Success');

// ❌ WRONG
expect(input.value).toBe('John');
expect(element.innerText).toBe('Success');
```

## Test Organization

### Asserting Collections

```typescript
// ✅ CORRECT - Verify all items
MOCK_DATA.forEach((item) => {
  expect(screen.getByText(item.name)).toBeInTheDocument();
});

// ❌ WRONG - Only checking first item
const items = document.querySelectorAll('[data-ta="item"]');
expect(items[0]).toHaveTextContent(MOCK_DATA[0].name);
```

### Grouping Tests

```typescript
describe('MyComponent', () => {
  describe('when user is authenticated', () => {
    it('should display user menu', () => { /* ... */ });
    it('should show logout button', () => { /* ... */ });
  });

  describe('when user is not authenticated', () => {
    it('should display login button', () => { /* ... */ });
    it('should not show user menu', () => { /* ... */ });
  });
});
```

## Automatic Setup (Already Configured)

The following is handled automatically in `vitest-setup.vitest.jsx`. **Do NOT duplicate in local beforeEach/afterEach:**

### Global beforeAll
- `ignoreResizeObserverError()`

### Global beforeEach
- `localStorage.clear()`
- `sessionStorage.clear()`
- `window.onbeforeunload = null`
- `addApplicationRoot()`
- `vi.clearAllMocks()`
- `fetchMock.reset()`

### Global afterEach
- `sandbox.restore()`
- `vi.clearAllTimers()` (if fake timers active)
- `cleanup()`
- `fetchMock.restore()`
- `fetchMock.reset()`
- `vi.useRealTimers()`
- `vi.restoreAllMocks()`
- `vi.clearAllMocks()`
- `vi.unstubAllGlobals()`
- `memoize.clearCaches()`
- `dedupeParallelCalls.clearCaches()`
- `removeApplicationRoot()`
- `cancelPendingWaits()`
- `i18n.changeLanguage('cimode')`

### When to Add Local beforeEach/afterEach

**Only add local hooks if you need:**
- Test-specific mocks not covered by global setup
- Custom timers or date mocking for specific tests
- Specific component state setup that varies per test
- Cleanup of test-specific resources not covered globally

**Example of valid local beforeEach:**

```typescript
describe('Component with fake timers', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2024-01-01'));
  });

  it('should handle timeout', () => {
    // Test using fake timers
  });
});
```

**Example of unnecessary local afterEach (DON'T DO THIS):**

```typescript
describe('Component', () => {
  afterEach(() => {
    fetchMock.restore();  // ❌ Already done globally
    cleanup();            // ❌ Already done globally
    vi.clearAllMocks();   // ❌ Already done globally
  });
});
```

## Running Tests

```bash
# Run all tests
npm run test --run

# Run specific test file (full path)
npm run test -- current/src/.../about.test.jsx --run

# Run by filename shorthand (if unique)
npm run test -- about.test.jsx --run

# Run with coverage
npm run test -- --coverage
```

## File Naming

- **Use `.test.jsx` extension** for new Vitest tests (not `.vitest.jsx`)
- **Future migration**: All existing `.vitest.jsx` files will be renamed to `.test.jsx`
- **TypeScript**: Use `.test.ts` or `.test.tsx`
