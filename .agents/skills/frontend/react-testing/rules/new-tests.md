# Creating New Tests

Guidelines for writing new tests with modern Vitest + React Testing Library patterns.

## Standard Template

```typescript
import { fireEvent, screen, waitFor, within } from '@testing-library/react';
import fetchMock from 'fetch-mock';
import React from 'react';

import { createEmptyServerResponse, testRender } from '@/test';

import ConfigurationTool from './configuration-tool';

function setup() {
  return testRender(<ConfigurationTool />);
}

describe('ConfigurationTool', () => {
  it('should save configuration when user confirms', async () => {
    // Arrange
    const mockResponse = vi.fn().mockResolvedValue(createEmptyServerResponse());
    fetchMock.post('/api/save', mockResponse);
    setup();

    const saveButton = await screen.findByTestId('save-button');
    fireEvent.click(saveButton);

    // Act
    const dialog = await screen.findByTestId('confirm-dialog');
    const confirmButton = within(dialog).getByTestId('accept-button');
    fireEvent.click(confirmButton);

    // Assert
    await waitFor(() => expect(mockResponse).toHaveBeenCalledTimes(1));
    await screen.findByTestId('success-message');
  });
});
```

## Standard Imports

```typescript
import { fireEvent, screen, waitFor, within } from '@testing-library/react';
import fetchMock from 'fetch-mock';
import React from 'react';

import { createBackendServerResponse, createEmptyServerResponse, testRender } from '@/test';

import YourComponent from './your-component';
```

**Note for TypeScript:** You do NOT need to import `describe`, `expect`, `it`, or `vi` from vitest - they are available globally via `tsconfig.json`.

## Setup Function Pattern

```typescript
function setup() {
  return testRender(<YourComponent />);
}
```

### For Admin Routes with Redux-Form

Use `testRenderAdmin` helper:

```typescript
function setup() {
  return testRenderAdmin(<MyComponent />, { params: { id: '123' } });
}
```

**For redux-form components:** Wait for form fields to initialize:

```typescript
async function renderMyForm() {
  testRenderAdmin(<MyFormComponent />, { params: { id: '123' } });

  const form = await screen.findByTestId('my-form');

  // Wait for redux-form to initialize
  await waitFor(() => {
    const radioButtons = form.querySelectorAll('input[type="radio"]');
    expect(radioButtons.length).toBeGreaterThan(0);
  });

  return { form };
}
```

## Module Mocking

### For utility/helper functions:

```typescript
import { functionToMock } from '@/shared/utils';

// Mock the module, preserving all other exports
vi.mock('@/shared/utils', async (importActual) => {
  const actual = await importActual<typeof import('@/shared/utils')>();
  return {
    ...actual,
    functionToMock: vi.fn(),
  };
});

// Create typed mock reference outside describe block
const functionToMockMocked = vi.mocked(functionToMock);

describe('yourFunction', () => {
  it('does something', () => {
    functionToMockMocked.mockReturnValue('mocked value');
    // ... test code
  });
});
```

### For React components with many dependencies:

```typescript
import * as moduleNameModule from '@/path/to/module';

vi.mock('@/path/to/module', () => ({
  functionOne: vi.fn(),
  functionTwo: vi.fn(),
}));

const mockFunctionOne = vi.mocked(moduleNameModule.functionOne);
const mockFunctionTwo = vi.mocked(moduleNameModule.functionTwo);
```

## Backend Request Mocking

```typescript
// For save/delete/update operations (no data returned):
const mockResponse = vi.fn().mockResolvedValue(createEmptyServerResponse());
fetchMock.post('/api/save', mockResponse);

// For fetch operations (data returned):
const mockResponse = vi.fn().mockResolvedValue(createBackendServerResponse({ id: 1, name: 'Test' }));
fetchMock.get('/api/fetch', mockResponse);

// Verify the mock was called:
await waitFor(() => expect(mockResponse).toHaveBeenCalledTimes(1));
```

## User Interactions

### Simple interactions with fireEvent

```typescript
const button = await screen.findByTestId('my-button');
fireEvent.click(button);

// For nested elements:
const dialog = await screen.findByTestId('dialog');
const confirmButton = within(dialog).getByTestId('confirm-button');
fireEvent.click(confirmButton);

// Input changes:
const input = screen.getByTestId('name-input');
fireEvent.change(input, { target: { value: 'New Value' } });
```

### Complex interactions with userEvent

For realistic user interactions (typing, focus, blur):

```typescript
import userEvent, { UserEvent } from '@testing-library/user-event';

async function renderComponent() {
  const user = userEvent.setup(); // Setup once
  testRender(<Component />);

  await waitFor(() => {
    expect(screen.queryByTestId('skeleton-loader')).not.toBeInTheDocument();
  });

  return { user }; // Return for reuse
}

// In your test:
const { user } = await renderComponent();
await user.type(input, 'realistic typing');
await user.click(button);
```

**Helper functions with userEvent:**

```typescript
async function clickDeleteIcon(user: UserEvent) {
  const [deleteIcon] = screen.getAllByTestId('delete-icon');
  await user.click(deleteIcon);
}
```

**Hybrid approach for nested modals:**

```typescript
// Use userEvent for main dialog
const mainDialog = await screen.findByTestId('main-dialog');
await user.click(within(mainDialog).getByRole('checkbox'));

// Use fireEvent for nested dialog buttons (avoids focus trap conflicts)
const cancelButton = within(mainDialog).getByTestId('cancel-button');
fireEvent.click(cancelButton);
```

## Element Selection Priority

1. **Semantic queries** (best for accessibility):
   - `screen.getByRole('button', { name: 'Submit' })`
   - `screen.getByLabelText('Email')`
   - `screen.getByText('Expected text')`

2. **data-ta with screen queries**:
   - `screen.getByTestId('save-button')`
   - `const [firstItem] = screen.getAllByTestId('list-item')`

3. **within() for nested elements**:
   - `within(dialog).getByTestId('accept-button')`

4. **querySelector** (last resort):
   - `document.querySelector('[data-ta="container"] .nested-class')`

## Async Selectors

```typescript
// ✅ CORRECT
const button = await screen.findByTestId('button');

// ❌ WRONG (old pattern)
const button = await waitForElement(() => getElementByTestId('button'));
```

## Wait for Loading States

If component has loading indicators:

```typescript
async function setup() {
  testRender(<Component />);
  expect(screen.getByTestId('container')).toBeInTheDocument();

  // Wait for loading to complete
  await waitFor(() => {
    expect(screen.queryByTestId('skeleton-loader')).not.toBeInTheDocument();
  });
}
```

## Test Structure

- **Follow AAA pattern**: Arrange, Act, Assert (with comments)
- **Use descriptive names**: `should display error message when validation fails`
- **Test all states**: enabled/disabled, selected/unselected, with/without data, loading, error

## Asserting Collections

```typescript
// ✅ CORRECT - Verify all items
MOCK_DATA.forEach((item) => {
  expect(screen.getByText(item.name)).toBeInTheDocument();
});

// ❌ WRONG - Only checking first item
const items = document.querySelectorAll('[data-ta="item"]');
expect(items[0]).toHaveTextContent(MOCK_DATA[0].name);
```

## Complete Examples

### Form Submission

```typescript
it('should submit form when valid data is provided', async () => {
  // Arrange
  const mockResponse = vi.fn().mockResolvedValue(createEmptyServerResponse());
  fetchMock.post('/api/submit', mockResponse);
  setup();

  // Act
  const input = screen.getByTestId('name-input');
  fireEvent.change(input, { target: { value: 'John Doe' } });

  const submitButton = screen.getByTestId('submit-button');
  fireEvent.click(submitButton);

  // Assert
  await waitFor(() => {
    expect(input).toHaveValue('John Doe');
    expect(mockResponse).toHaveBeenCalledTimes(1);
  });
  await screen.findByTestId('success-message');
});
```

### Dialog Interactions

```typescript
it('should handle dialog interactions correctly', async () => {
  // Arrange
  setup();

  // Act
  const openButton = await screen.findByTestId('open-dialog-button');
  fireEvent.click(openButton);

  const dialog = await screen.findByTestId('confirmation-dialog');
  const confirmButton = within(dialog).getByTestId('confirm-button');
  fireEvent.click(confirmButton);

  // Assert
  await screen.findByTestId('dialog-result');
});
```

### Fetching Data

```typescript
it('should display fetched data', async () => {
  // Arrange
  const testData = { id: 1, name: 'Test Item' };
  const mockResponse = vi.fn().mockResolvedValue(createBackendServerResponse(testData));
  fetchMock.get('/api/data', mockResponse);

  // Act
  setup();

  // Assert
  await screen.findByText('Test Item');
  expect(mockResponse).toHaveBeenCalledTimes(1);
});
```

## Important Notes

- No need for local `afterEach` - cleanup is handled globally
- Mock clearing is automatic - see [common-patterns.md](common-patterns.md#automatic-setup)
- TypeScript types like `describe`, `expect`, `it`, `vi` are global in `.ts`/`.tsx` files
