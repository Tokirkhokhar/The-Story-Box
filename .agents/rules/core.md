---
trigger: always_on
---

# Quick Reference — Routing Table

Use this table to find the right guideline file for your task.

| Task                                       | Reference                       |
| ------------------------------------------ | ------------------------------- |
| TypeScript types, interfaces, error typing | `guidelines/typescript.md`      |
| File structure, naming, code limits        | `guidelines/code-quality.md`    |
| Backend route handlers, DAL, services      | `guidelines/backend.md`         |
| Project scope.                             | See `docs/product-scope.md`     |
| Database design                            | See `docs/database-design.md`   |

## Universal Rules (always apply)

- No comments in code — code should be self-explanatory
- No `React.FC` — use plain function components with typed props
- Branch names: short and descriptive, must NOT match `gh-xxxx` pattern
- Releases happen Mon/Wed/Thu after QA smoke test
- Every bugfix must include a test for the broken functionality
