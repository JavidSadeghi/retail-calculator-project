# Retail Calculator Project

Foodstuffs take-home exercise built with React, TypeScript, Vite, Tailwind CSS, Jest, and Testing Library.

## Getting started

```bash
pnpm install
pnpm dev
```

The dev server runs on <http://localhost:5173>. See the Vite output for network info.

## Available scripts

| Command | Description |
| --- | --- |
| `pnpm dev` | Start the Vite dev server |
| `pnpm build` | Type-check then build the production bundle |
| `pnpm preview` | Preview the production build locally |
| `pnpm lint` | Run ESLint across the repo |
| `pnpm test` | Execute the Jest test suite once |
| `pnpm test:watch` | Run tests in watch mode |
| `pnpm coverage` | Generate coverage from Jest |

## Testing setup

- Jest + ts-jest target a DOM-like environment via `jest-environment-jsdom`.
- Testing Library (`@testing-library/react` & `@testing-library/jest-dom`) powers component tests.
- Global test utilities live in `src/test/setup.ts`.

## Next steps

- Flesh out the calculator domain logic with unit tests.
- Build the UI slices for inputs, validation, and results.
- Capture reasoning/slice notes under `docs/` (planned for future task).
