# Foodstuffs take-home notes

## Goals & constraints
- Build a retail calculator capable of handling quantity, price per item, and region inputs.
- Apply flat discount brackets (non-cumulative) and regional tax based on tables provided.
- Ship in slices (issues/PRs), with automated tests and documentation.
- Target stack: React + TypeScript + Vite + Tailwind + Jest + Testing Library + pnpm.

## Slice checklist

- [x] Task 1 – Bootstrap project (Vite + React TS) and configure testing/tooling (Jest, Tailwind, Testing Library).  
  _Outcome:_ Scaffolded project, scripts, and smoke test to verify render pipeline.

- [x] Task 2 – Pricing domain logic and unit tests.  
  _Outcome:_ Added `src/domain/pricing.ts` with discount/tax tables, validation, rounding, and Jest coverage.

- [x] Task 3 – Calculator form UI and component tests.  
  _Outcome:_ Built feature component with numeric inputs, region dropdown, cards for results, and interaction tests enforcing validation.

- [ ] Task 4 – Documentation slice (this file) and README updates.  
  _Outcome:_ In progress; this checklist will be checked once merged.

- [ ] Task 5 – Potential stretch (future): persist inputs, add accessibility enhancements, or integrate data fetching if required in office session.

## Key decisions
- **Discount logic:** Highest qualifying bracket applied across entire subtotal—mirrors provided requirement and simplified by `getDiscountRate`.
- **Validation:** Domain layer throws `PricingError` for missing/invalid region, mirrored in UI for consistent messaging.
- **Rounding:** `roundCurrency` centralizes precision to two decimals, ensuring totals remain consistent between service and UI.
- **Styling:** Tailwind utility classes for rapid iteration, with custom palette entries for brand-like feel.
- **Testing:** Each pure function gets Jest coverage; UI forms use Testing Library + user-event to simulate real interactions.

## Next steps / discussion starters
- Accessibility audit (aria-live for result area, improved error announcements).
- Persist last-used inputs (localStorage) for better UX.
- Add CI workflow (GitHub Actions) to run `pnpm lint` + `pnpm test` per PR.
- Introduce shared formatting (Prettier) or ESLint type-aware config when scope expands.

