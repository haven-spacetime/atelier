Run the complete verification checklist. Stop at the first failure and fix it before continuing.

1. `npx tsc --noEmit` — zero TypeScript errors
2. `npm run lint` — zero ESLint warnings
3. `npm run format:check` — all files formatted
4. `npm run test` — all tests pass
5. `npm run build` — successful production build

Report the result of each step. If all pass, confirm "All checks green."
