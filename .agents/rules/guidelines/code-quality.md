---
trigger: always_on
---

# Code Quality

## File Organization

- One component/function/hook/class per file.
- `index.ts` files only re-export — no logic in them.
- Group related code into a folder under `modules/` (client or server).
- Group utilities inside `modules/myModule/utils/` — avoid top-level `src/utils/` or `src/helpers/`.

## Naming

- Files: match the export name (`MyComponent.tsx` exports `MyComponent`).
- Test files: co-located as `test.ts` or `MyComponent.test.ts` within the component folder.
- Interfaces: capital letter, no `I` prefix.
- Branches: short, descriptive, never matching `gh-xxxx`.

## No Comments

Code should be self-explanatory. Do not add comments, JSDoc, or inline documentation unless the logic is genuinely non-obvious (e.g. a workaround for a browser bug). This applies to new code — don't add comments to files you modify.

## Import Discipline

- Follow [open-source best practices](https://github.com/c-hive/guides/blob/master/js/best-practices.md).

## Code Climate

The codebase is tracked on [CodeClimate](https://codeclimate.com/repos/60ec0e1e78cbb6014d00a426/) for maintainability. Keep complexity low.

## Linting and Formatting

- ESLint with flat config (`eslint.config.js` at root).
- Prettier (config at `.prettierrc`).
- Stylelint for CSS/SCSS files.
- Husky pre-commit hooks run lint-staged automatically.
- CI runs lint, typecheck, and tests on every PR.

## PR Workflow

1. Open a draft PR as soon as you start work.
2. Make small, regular commits.
3. Mark ready for review when done — reviewers are auto-assigned via CODEOWNERS.
4. PR needs code review approval + QA approval before merge.
5. All CI status checks must be green.
