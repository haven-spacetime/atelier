# Atelier Motors — Engineering Standards

> Product spec, design system, and client details are in **PROJECT.md**.

## Commands

```bash
npm run dev          # Start dev server
npm run build        # Production build
npm run lint         # ESLint
npm run format       # Prettier — write
npm run format:check # Prettier — check only
npm run test         # Vitest — single run
npm run test:watch   # Vitest — watch mode
npx tsc --noEmit     # TypeScript check
```

## Verification Checklist

Run before marking any task complete:

1. `npx tsc --noEmit` — zero errors
2. `npm run lint` — zero warnings
3. `npm run format:check` — all files formatted
4. `npm run test` — all tests pass
5. `npm run build` — successful production build

## Git Conventions

### Commit Format (Conventional Commits)

```
type(scope): description
```

**Types:** `feat` `fix` `test` `refactor` `chore` `docs` `style` `perf` `ci`

**Scopes:** `customers` `jobs` `invoices` `schedule` `inventory` `marketing` `lib` `config` `pages`

**Rules:**

- Max 72 chars in subject line
- Atomic commits — one logical change per commit
- Never use `git add .` or `git add -A` — stage files explicitly
- Write in imperative mood: "add" not "added", "fix" not "fixed"

## Testing Standard

Write tests for any pure function that can be expressed as:

```ts
expect(fn(input)).toBe(output);
```

This includes: format helpers, status logic, date calculations, parsing, constants validation.

Test files go in `src/lib/__tests__/*.test.ts`. Run with `npm test`.

## Shared Modules

Business logic lives in `src/lib/`:

| Module         | Contents                                                                        |
| -------------- | ------------------------------------------------------------------------------- |
| `constants.ts` | Status enums, color mappings, type definitions                                  |
| `format.ts`    | `formatStatus()`, `parseJsonArray()`                                            |
| `schedule.ts`  | `getWeekBounds()`, `bucketByDayOfWeek()`, `DAY_LABELS`                          |
| `jobs.ts`      | `getNextStatus()`, `getStatusIndex()`, `isActiveStatus()`, `isPipelineStatus()` |
| `utils.ts`     | `cn()`, `formatCurrency()`, `formatDate()`                                      |

Always import from shared modules. Never duplicate status/color/type definitions inline.

## Workflow Rules

1. **Plan before execute** — Enter plan mode for any task with 3+ steps or architectural decisions
2. **Verify before done** — Run the full verification checklist above
3. **STOP for architecture** — If a change affects database schema, routing, or state management patterns, pause and plan
4. **Auto-fix bugs** — When given a bug report, investigate and fix autonomously. Don't ask for hand-holding
5. **Capture lessons** — After corrections, update `tasks/lessons.md` with the pattern

## Error Handling Tiers

1. **Auto-fix:** Lint errors, format issues, type errors, failing tests — just fix them
2. **Auto-add:** Missing test coverage for new functions, missing imports after refactor
3. **STOP and ask:** Schema migrations, new dependencies, API contract changes, anything that changes behavior for end users

## Quality Definition

"Existence does not equal implementation." Code must be:

- **Wired** — imported and used, not just defined
- **Tested** — pure functions have test coverage
- **Typed** — no `any` unless interfacing with untyped externals
- **Formatted** — passes `format:check`

## Core Principles

- **Simplicity First** — Make every change as simple as possible
- **No Laziness** — Find root causes. No temporary fixes. Senior developer standards
- **Minimal Impact** — Changes should only touch what's necessary
