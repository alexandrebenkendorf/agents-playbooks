# Refactoring Legacy Tests

Step-by-step guide for converting old tests to modern Vitest + React Testing Library patterns.

## One-Pass Refactoring Checklist

**Before making ANY edits, verify you will change ALL of these in a single pass:**

### Imports

- [ ] Remove `sinon` import completely
- [ ] Remove `userEvent` import unless actually needed
- [ ] Remove `act`, `cleanup` imports (handled automatically)
- [ ] Add `fireEvent`, `screen`, `within` to Testing Library imports
- [ ] **TypeScript files only**: Remove `import { describe, expect, it, vi } from 'vitest'`
- [ ] **JavaScript files only**: Keep vitest imports
- [ ] Consolidate test helper imports from `../test/helpers/*` to `@/test`

### Setup and Cleanup

- [ ] Remove `const sandbox = sinon.createSandbox()`
- [ ] Remove local `afterEach()` blocks calling global cleanup methods
- [ ] Remove manual `cleanup()`, `fetchMock.restore()`, `vi.clearAllMocks()` calls
- [ ] Remove `act()` wrapper around `render()`
- [ ] Change `await setup()` to just `setup()` (not async unless actually needed)

### Mocking

- [ ] Replace `createAwaitableSpy(response, sandbox)` with `vi.fn().mockResolvedValue(response())`
- [ ] Replace `sinon.spy()` with `vi.fn()`
- [ ] Replace `sinon.stub()` with `vi.fn().mockReturnValue()` or `vi.fn().mockResolvedValue()`
- [ ] Use `createEmptyServerResponse()` for save/delete/update
- [ ] Use `createBackendServerResponse(data)` for fetch operations

### Selectors

- [ ] Replace `waitForElement(() => getElementByTestId(...))` with `await screen.findByTestId(...)`
- [ ] Replace `getElementByTestId('x', parent)` with `within(parent).getByTestId('x')`

### User Interactions

- [ ] Evaluate each interaction: use `fireEvent` for simple events, `userEvent` for realistic sequences
- [ ] If using userEvent, setup ONCE in render helper
- [ ] Remove `await` before `fireEvent` calls
- [ ] Keep `await` before `userEvent` calls

### Assertions

- [ ] Replace spy promise patterns (`await spy.firstCallAsPromise`) with `await waitFor(() => expect(mockFn).toHaveBeenCalled())`
- [ ] Use `expect(mockFn).toHaveBeenCalledTimes(n)` for call count verification
- [ ] Use `expect(mockFn).not.toHaveBeenCalled()` for non-execution verification

### Post-Refactoring

- [ ] Run `npx eslint <file-path> --fix`
- [ ] Verify no compile errors
- [ ] Run tests to ensure they pass

## Step-by-Step Refactoring

### Step 1: Update Imports

```typescript
// ❌ OLD
import { createBackendServerResponse, createEmptyServerResponse, testRender } from '@/test';
import { act, cleanup, render } from '@testing-library/react';
import { waitForElement } from '@testing-library/react';
// Remove in TypeScript files
// ✅ NEW
import { fireEvent, screen, waitFor, within } from '@testing-library/react';
import fetchMock from 'fetch-mock';
import React from 'react';
import sinon from 'sinon';
import { describe, expect, it, vi } from 'vitest';

import { getElementByTestId } from '../test/helpers';

// Note: describe, expect, it, vi are global in TypeScript files
```

### Step 2: Update Setup Function

```typescript
// ❌ OLD
const sandbox = sinon.createSandbox();

function setup() {
  return render(
    <TestContainer>
      <YourComponent />
    </TestContainer>
  );
}

afterEach(() => {
  sandbox.restore();
  cleanup();
  fetchMock.restore();
});

// ✅ NEW
function setup() {
  return testRender(<YourComponent />);
}

// No afterEach needed - cleanup is handled globally
```

### Step 3: Update Mocking

```typescript
// ❌ OLD
const mockCallback = sinon.spy();
const mockResponse = createAwaitableSpy(createEmptyServerResponse(), sandbox);
fetchMock.post('/api/save', mockResponse);

// ✅ NEW
const mockCallback = vi.fn();
const mockResponse = vi.fn().mockResolvedValue(createEmptyServerResponse());
fetchMock.post('/api/save', mockResponse);
```

### Step 4: Update Selectors

```typescript
// ❌ OLD
const button = await waitForElement(() => getElementByTestId('button'));
const nested = getElementByTestId('nested', parent);

// ✅ NEW
const button = await screen.findByTestId('button');
const nested = within(parent).getByTestId('nested');
```

### Step 5: Update User Interactions

```typescript
// ❌ OLD
const button = getElementByTestId('button');
button.click();

// ✅ NEW - Use fireEvent for simple interactions
const button = screen.getByTestId('button');
fireEvent.click(button);

// ✅ NEW - Use userEvent for complex interactions
import userEvent, { UserEvent } from '@testing-library/user-event';

async function renderComponent() {
  const user = userEvent.setup();
  testRender(<Component />);
  return { user };
}

const { user } = await renderComponent();
await user.click(button);
```

### Step 6: Update Assertions

```typescript
// ❌ OLD
await mockResponse.firstCallAsPromise;
expect(mockResponse.callCount).toBe(1);

// ✅ NEW
await waitFor(() => expect(mockResponse).toHaveBeenCalledTimes(1));
```

## Common Migration Patterns

### Sinon Sandbox → Vitest Mocks

```typescript
// ❌ OLD
const sandbox = sinon.createSandbox();
const spy = sandbox.spy();
const stub = sandbox.stub().returns('value');

afterEach(() => {
  sandbox.restore();
});

// ✅ NEW
const spy = vi.fn();
const stub = vi.fn().mockReturnValue('value');

// No afterEach needed - mocks cleared automatically
```

### Old Async Selectors → Modern Screen Queries

```typescript
// ❌ OLD
const element = await waitForElement(() => getElementByTestId('element'));

// ✅ NEW
const element = await screen.findByTestId('element');
```

### Manual Cleanup → Automatic Cleanup

```typescript
// ❌ OLD
afterEach(() => {
  cleanup();
  fetchMock.restore();
  vi.clearAllMocks();
});

// ✅ NEW
// No afterEach needed - all handled globally
```

### Old Test Helpers Import → Centralized Import

```typescript
// ❌ OLD
import { createBackendServerResponse } from '../test/helpers/http.test';
import { createEmptyServerResponse } from '../../test/helpers/http.test';
import { TestContainer } from '../test/helpers/test-container.test';
import { getJsonRequestBody } from '../test/helpers/mock.vitest';

// ✅ NEW
import {
  createBackendServerResponse,
  createEmptyServerResponse,
  getJsonRequestBody,
  TestContainer,
} from '@/test';
```

## Common Mistakes to Avoid

| ❌ WRONG                                                    | ✅ CORRECT                                    |
| ----------------------------------------------------------- | --------------------------------------------- |
| `import sinon from 'sinon'`                                 | Use `vi`                                      |
| `sinon.stub()` or `sandbox.spy()`                           | `vi.fn()`                                     |
| `createAwaitableSpy(response, sandbox)`                     | `vi.fn().mockResolvedValue(response())`       |
| `waitForElement(() => getElementByTestId('x'))`             | `await screen.findByTestId('x')`              |
| `getElementByTestId('nested', parent)`                      | `within(parent).getByTestId('nested')`        |
| `import { describe, expect, it, vi } from 'vitest'` (in TS) | No import needed in `.ts`/`.tsx`              |
| `vi.fn(() => response())`                                   | `vi.fn().mockResolvedValue(response())`       |
| `createBackendServerResponse()` for save ops                | `createEmptyServerResponse()` for save/delete |
| `act(() => { render(...) })`                                | Just `render(...)`                            |
| Local afterEach with only global cleanup                    | No local afterEach needed                     |
| `await user.click()` without setup                          | Setup once: `const user = userEvent.setup()`  |

## Example: Before & After

### Before (Legacy)

```javascript
import { cleanup, render } from '@testing-library/react';
import { waitForElement } from '@testing-library/react';
import sinon from 'sinon';

import { getElementByTestId } from '../test/helpers';
import { createAwaitableSpy } from '../test/helpers/mock.vitest';

const sandbox = sinon.createSandbox();

function setup() {
  return render(<ConfigurationTool />);
}

afterEach(() => {
  sandbox.restore();
  cleanup();
  fetchMock.restore();
});

it('should save configuration', async () => {
  const mockResponse = createAwaitableSpy(createEmptyServerResponse(), sandbox);
  fetchMock.post('/api/save', mockResponse);
  setup();

  const button = await waitForElement(() => getElementByTestId('save-button'));
  button.click();

  await mockResponse.firstCallAsPromise;
  expect(mockResponse.callCount).toBe(1);
});
```

### After (Modern)

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

    // Act
    const saveButton = await screen.findByTestId('save-button');
    fireEvent.click(saveButton);

    // Assert
    await waitFor(() => expect(mockResponse).toHaveBeenCalledTimes(1));
  });
});
```

## Next Steps

After refactoring:

1. Run `npm prettier-fix`
2. Run `npx eslint <file-path> --fix`
3. Run tests: `npm test -- <file> --run`
4. Verify coverage is maintained or improved

For TypeScript-specific patterns, see [typescript.md](typescript.md).
