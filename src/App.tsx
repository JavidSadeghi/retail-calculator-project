import { Calculator } from './features/calculator/Calculator'

function App() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100">
      <div className="mx-auto max-w-5xl px-6 py-16">
        <header className="mb-10">
          <p className="text-xs font-semibold uppercase tracking-[0.35em] text-brand-primary">
            Foodstuffs Retail
          </p>
          <h1 className="mt-2 text-4xl font-bold text-slate-900">Retail calculator</h1>
          <p className="mt-2 max-w-2xl text-base text-slate-600">
            Estimate order totals with volume-based discounts and regional tax rates. Enter the
            quantity, per-item cost, and region to see the breakdown.
          </p>
        </header>
        <Calculator />
      </div>
    </main>
  )
}

export default App
