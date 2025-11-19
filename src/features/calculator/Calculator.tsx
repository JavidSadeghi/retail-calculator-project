import { FormEvent, useMemo, useState } from 'react'
import {
  calculateTotals,
  REGION_TAX_RATES,
  type CalculationResult,
} from '../../domain/pricing'

type FormState = {
  quantity: string
  pricePerItem: string
  region: string
}

type FormErrors = Partial<Record<keyof FormState, string>>

const initialFormState: FormState = {
  quantity: '',
  pricePerItem: '',
  region: '',
}

const formatCurrency = (value: number) =>
  value.toLocaleString('en-NZ', {
    style: 'currency',
    currency: 'NZD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })

const ResultCard = ({
  title,
  description,
  value,
}: {
  title: string
  description: string
  value: string
}) => (
  <div className="flex flex-col gap-2 rounded-2xl border border-slate-100 bg-slate-50/60 p-4 shadow-sm shadow-slate-100">
    <p className="text-xs font-semibold uppercase tracking-widest text-slate-500">{title}</p>
    <p className="text-xl font-bold text-slate-900">{value}</p>
    <p className="text-sm text-slate-500">{description}</p>
  </div>
)

export const Calculator = () => {
  const [form, setForm] = useState<FormState>(initialFormState)
  const [errors, setErrors] = useState<FormErrors>({})
  const [result, setResult] = useState<CalculationResult | null>(null)
  const [globalError, setGlobalError] = useState<string | null>(null)

  const regionOptions = useMemo(
    () =>
      Object.entries(REGION_TAX_RATES).map(([code, rate]) => ({
        code,
        rate: (rate * 100).toFixed(2),
      })),
    [],
  )

  const handleChange = (field: keyof FormState) => (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm((prev) => ({ ...prev, [field]: event.target.value }))
    setErrors((prev) => ({ ...prev, [field]: undefined }))
    setGlobalError(null)
  }

  const validate = (): boolean => {
    const nextErrors: FormErrors = {}
    const quantityValue = Number(form.quantity)
    const priceValue = Number(form.pricePerItem)

    if (!Number.isFinite(quantityValue) || quantityValue <= 0) {
      nextErrors.quantity = 'Quantity must be a positive number.'
    }

    if (!Number.isFinite(priceValue) || priceValue <= 0) {
      nextErrors.pricePerItem = 'Price must be a positive number.'
    }

    if (!form.region) {
      nextErrors.region = 'Please select a region.'
    }

    setErrors(nextErrors)
    return Object.keys(nextErrors).length === 0
  }

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (!validate()) {
      setResult(null)
      return
    }

    try {
      const calculation = calculateTotals({
        quantity: Number(form.quantity),
        pricePerItem: Number(form.pricePerItem),
        region: form.region,
      })
      setResult(calculation)
      setGlobalError(null)
    } catch (error) {
      setResult(null)
      if (error instanceof Error) {
        setGlobalError(error.message)
      } else {
        setGlobalError('Unexpected error occurred.')
      }
    }
  }

  return (
    <div className="space-y-8">
      <form
        className="rounded-3xl border border-slate-100 bg-white p-8 shadow-lg shadow-slate-200"
        onSubmit={handleSubmit}
        noValidate
      >
        <div className="space-y-6">
          <div>
            <label htmlFor="quantity" className="block text-sm font-semibold text-slate-900">
              Quantity
            </label>
            <input
              id="quantity"
              type="number"
              min="1"
              step="1"
              value={form.quantity}
              onChange={handleChange('quantity')}
              className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-2 text-base text-slate-900 shadow-sm focus:border-brand-accent focus:outline-none focus:ring-2 focus:ring-brand-accent/20"
              placeholder="e.g. 250"
              required
            />
            {errors.quantity ? <p className="mt-1 text-sm text-red-600">{errors.quantity}</p> : null}
          </div>

          <div>
            <label htmlFor="pricePerItem" className="block text-sm font-semibold text-slate-900">
              Price per item
            </label>
            <input
              id="pricePerItem"
              type="number"
              min="0"
              step="0.01"
              value={form.pricePerItem}
              onChange={handleChange('pricePerItem')}
              className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-2 text-base text-slate-900 shadow-sm focus:border-brand-accent focus:outline-none focus:ring-2 focus:ring-brand-accent/20"
              placeholder="e.g. 45.99"
              required
            />
            {errors.pricePerItem ? (
              <p className="mt-1 text-sm text-red-600">{errors.pricePerItem}</p>
            ) : null}
          </div>

          <div>
            <label htmlFor="region" className="block text-sm font-semibold text-slate-900">
              Region
            </label>
            <select
              id="region"
              value={form.region}
              onChange={handleChange('region')}
              className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-2 text-base text-slate-900 shadow-sm focus:border-brand-accent focus:outline-none focus:ring-2 focus:ring-brand-accent/20"
              required
            >
              <option value="">Select region</option>
              {regionOptions.map(({ code, rate }) => (
                <option key={code} value={code}>
                  {code} · {rate}%
                </option>
              ))}
            </select>
            {errors.region ? <p className="mt-1 text-sm text-red-600">{errors.region}</p> : null}
          </div>
        </div>

        {globalError ? <p className="mt-4 text-sm font-semibold text-red-600">{globalError}</p> : null}

        <div className="mt-6 flex justify-end">
          <button
            type="submit"
            className="inline-flex items-center justify-center rounded-2xl bg-brand-primary px-6 py-3 text-sm font-semibold uppercase tracking-wide text-white shadow-lg shadow-brand-primary/30 transition hover:bg-brand-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-accent/60"
          >
            Calculate
          </button>
        </div>
      </form>

      {result ? (
        <section className="grid gap-4 md:grid-cols-2">
          <ResultCard
            title="Subtotal"
            value={formatCurrency(result.subtotal)}
            description={`Before discount (${(result.discountRate * 100).toFixed(0)}% applied)`}
          />
          <ResultCard
            title="Discount"
            value={`-${formatCurrency(result.discountAmount)}`}
            description="Total savings based on volume"
          />
          <ResultCard
            title="Tax"
            value={formatCurrency(result.taxAmount)}
            description={`Region tax @ ${(result.taxRate * 100).toFixed(2)}%`}
          />
          <ResultCard
            title="Grand total"
            value={formatCurrency(result.total)}
            description="Discount + tax included"
          />
        </section>
      ) : (
        <div className="rounded-2xl border border-dashed border-slate-200 p-6 text-sm text-slate-500">
          Enter details and select a region to see pricing totals. Results appear here.
        </div>
      )}
    </div>
  )
}

