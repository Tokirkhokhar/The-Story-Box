---
trigger: always_on
---

# TypeScript Conventions

## Types and Interfaces

- Use `interface` over `type` unless you need union types or mapped types. This is a [TypeScript performance recommendation](https://github.com/microsoft/TypeScript/wiki/Performance#preferring-interfaces-over-intersections).
- No `I` prefix on interfaces — refactor away if you encounter it.
- Names of types and interfaces start with a capital letter.
- No `.d.ts` files for new types — use `.ts` files. The more `.d.ts` files, the more polluted the global scope becomes.

## Error Handling

- Catch blocks always type errors as `unknown`:
  ```ts
  try {
    // ...
  } catch (error: unknown) {
    if (error instanceof SpecificError) {
      // handle
    } else if (error instanceof Error) {
      log.error("Error: ", error.message);
    }
  }
  ```
- Use `instanceof` checks to narrow error types before accessing properties.
- Never `throw` string literals — always throw `Error` instances.

## Exports

- Exported objects should be typed as `Readonly<T>`:
  ```ts
  interface Config {
    title: string;
  }
  const config: Readonly<Config> = { title: "Delete inactive users" };
  export default config;
  ```

## Redux Type Safety

- Use `useAppDispatch` (from `store/hooks`) instead of `useDispatch` — it's typed to `AppDispatch`.
- Selectors must type the state argument as `RootState`:
  ```ts
  export const selectInvoiceId = (state: RootState): string | null =>
    state.guestPurchaseSuccessPopup.invoiceId;
  ```


## Feature Flags

Feature flags are managed via PostHog. See `docs/feature-flags.md` for usage guidelines.
