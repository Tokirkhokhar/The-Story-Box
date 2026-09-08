# Testing Basics

## Test Location

- Client: tests co-located with source — `test.ts` or `*.test.ts` in the component/hook folder.
- Server: same pattern — `dal.test.ts`, `routeHandler.test.ts` alongside the source.
- Test match patterns:
  - Client: `src/**/__tests__/**/*.{ts,tsx}` and `src/**/{*.test,test}.{ts,tsx}`
  - Server: `src/**/{*.test,test}.ts`

## Client Testing

**Environment:** jsdom (simulates browser DOM)

### TestProvider and `render()`

Import the custom `render` from `__tests__/unit/TestProvider` — not from `@testing-library/react` directly. This wraps components with the full provider stack (Redux, Apollo, Router, Split, Theme, Recoil, Daily, DnD, etc.):

```ts
import { render } from "__tests__/unit/TestProvider";
```

Options accepted by `render()`:

| Option            | Type        | Purpose                                  |
| ----------------- | ----------- | ---------------------------------------- |
| `store`           | Redux store | From `setupStore()` with preloaded state |
| `tracking`        | object      | Tracking context mock                    |
| `useDialog`       | boolean     | Mounts DialogNotificationContainer       |
| `useNotification` | boolean     | Mounts NotificationContainer             |
| `features`        | object      | Split.io feature flag overrides          |
| `initialLocation` | string      | React Router initial path                |
| `dragAndDrop`     | boolean     | Enables DnD provider                     |
| `gqlMocks`        | array       | Apollo MockedProvider mocks              |
| `virtuosoMocks`   | object      | Virtual scroll mocks                     |
| `dailyCallObject` | object      | Daily.co call object mock                |
| `helmet`          | boolean     | Enables HelmetProvider                   |

### The `renderComponent` Pattern

Each test file defines its own `renderComponent` function locally. This is the standard pattern — there is no shared `renderComponent` utility. It wraps the component-under-test with the right store state and render options:

```ts
import { render } from "__tests__/unit/TestProvider";
import { setupStore } from "testUtils/setupStore";
import { authFactory, eventFactory } from "testUtils/factories";

const renderComponent = (overrides = {}) =>
  render(<MyComponent {...defaultProps} {...overrides} />, {
    store: setupStore({
      auth: authFactory.build({ user: mockUser }),
      event: eventFactory.build(),
    }),
    tracking: mockTracking,
    useDialog: true,
    initialLocation: "/",
  });
```

Variations:

- Accept props or flags as parameters to test different scenarios
- Return the store for assertions: `return { mockStore }`
- Accept a custom store to test different Redux states

### `setupStore()`

Creates a Redux store with optional preloaded state (`testUtils/setupStore.ts`):

```ts
import { setupStore } from "testUtils/setupStore";

const store = setupStore({
  auth: authFactory.build(),
  event: eventsFactory.build({ currentEventCompany: company }),
});
```

Pass partial `RootState` — only the slices your test needs.

### Factories

Factories use the `factory.ts` library with `@faker-js/faker` for realistic test data. Defined in `testUtils/factories/`:

```ts
import {
  eventFactory,
  userFactory,
  authFactory,
  companyFactory,
} from "testUtils/factories";

const event = eventFactory.build(); // defaults
const user = userFactory.build({ email: "test@remo.co" }); // override fields
const pastEvent = pastEventFactory.build(); // preset variant
```

**How factories are structured:**

```ts
import { faker } from "@faker-js/faker/locale/en";
import { Sync } from "factory.ts";

export const userFactory = Sync.makeFactory<IUser>({
  id: Sync.each(() => faker.string.uuid()),
  email: Sync.each(() => faker.internet.email()),
  profile: userProfileFactory.build(), // nested factories
});
```

Key patterns:

- `Sync.each(() => ...)` — generates unique values per `.build()` call
- `.extend({...})` — creates variants (e.g. `pastEventFactory`, `ongoingEventFactory`)
- `.build({...})` — override specific fields at call site
- Nested composition — factories reference other factories

See `testUtils/factories/index.ts` for the full list of available factories (60+).

### Querying Elements

The codebase primarily uses `getByTestId` and `getByText`:

```ts
screen.getByTestId("submit-button");
screen.getByText("Save Changes");
screen.queryByTestId("error-message"); // returns null if not found
screen.findByText("Loading..."); // async, waits for element
```

`getByRole` is used sparingly. Match the query style of surrounding tests in the file you're working in.

### Mocking

- HTTP requests MUST be mocked — use `nock` library. All unmocked requests are rejected.
- Prefer mocking 3rd party libraries over their network requests.
- Firebase mocking utilities: `testUtils/firebase.ts`, `testUtils/mockModularFirebase.ts`
- Apollo mocking: `testUtils/apollo.ts`
- Media device mocking: `testUtils/mockMediaDevice.ts`

## Server Testing

**Environment:** Node.js with MongoDB memory server

**Route handler tests:** Use `supertest` for black-box testing:

```ts
import request from "supertest";

const response = await request(app)
  .post("/api/endpoint")
  .send({ field: "value" });

expect(response.status).toBe(200);
```

- Mocking the data access layer is discouraged — test the full stack.
- Firebase/Firestore are auto-mocked in `setup-test.ts`.
- Helper functions: `getMockExpressRequest()`, `getMockExpressResponse()`, `getErrHandler()`.

## Naming Conventions

- Use present tense, no "should":

  ```ts
  // Good
  it("triggers API request", () => {});
  it("renders error message when fetch fails", () => {});

  // Bad
  it("should trigger API request", () => {});
  ```

- Use `describe` nesting to group related scenarios:

  ```ts
  describe("MyComponent", () => {
    describe("when user is authenticated", () => {
      it("renders dashboard", () => {});
      it("shows welcome message", () => {});
    });

    describe("when user is not authenticated", () => {
      it("redirects to login", () => {});
    });
  });
  ```

## Structure

- Follow AAA (Arrange, Act, Assert) with blank lines between blocks:

  ```ts
  it("triggers onClick", () => {
    const onClick = jest.fn();
    renderComponent({ onClick });

    const button = screen.getByTestId("action-button");
    userEvent.click(button);

    expect(onClick).toHaveBeenCalled();
  });
  ```

## Rules

- No console warnings or errors allowed in new tests.
- Logging is excluded from unit test assertions.
- Restore mocks on `global`/`window` in `afterAll` to avoid leaking into other tests.
- Every bugfix must include a regression test.
- Test both positive and negative scenarios.
