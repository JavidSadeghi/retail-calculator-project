export const REGION_TAX_RATES = {
  AUK: 0.0685,
  WLG: 0.08,
  WAI: 0.0625,
  CHC: 0.04,
  TAS: 0.0825,
} as const

export type RegionCode = keyof typeof REGION_TAX_RATES

const DISCOUNT_BRACKETS = [
  { threshold: 50_000, rate: 0.15 },
  { threshold: 10_000, rate: 0.1 },
  { threshold: 7_000, rate: 0.07 },
  { threshold: 5_000, rate: 0.05 },
  { threshold: 1_000, rate: 0.03 },
] as const

export type PricingErrorCode = 'REGION_REQUIRED' | 'REGION_INVALID'

export class PricingError extends Error {
  readonly code: PricingErrorCode

  constructor(message: string, code: PricingErrorCode) {
    super(message)
    this.name = 'PricingError'
    this.code = code
  }
}

const roundCurrency = (value: number, precision = 2): number => {
  const multiplier = 10 ** precision
  return Math.round((value + Number.EPSILON) * multiplier) / multiplier
}

export const getDiscountRate = (subtotal: number): number => {
  const bracket = DISCOUNT_BRACKETS.find(({ threshold }) => subtotal >= threshold)
  return bracket?.rate ?? 0
}

export const getTaxRate = (region: RegionCode): number => {
  return REGION_TAX_RATES[region]
}

const assertRegion = (region?: string): RegionCode => {
  if (!region) {
    throw new PricingError('Region selection is required.', 'REGION_REQUIRED')
  }

  if (!Object.hasOwn(REGION_TAX_RATES, region)) {
    throw new PricingError(`Region '${region}' is not supported.`, 'REGION_INVALID')
  }

  return region as RegionCode
}

export type CalculationInput = {
  quantity: number
  pricePerItem: number
  region?: string
}

export type CalculationResult = {
  subtotal: number
  discountRate: number
  discountAmount: number
  discountedSubtotal: number
  taxRate: number
  taxAmount: number
  total: number
}

export const calculateTotals = ({
  quantity,
  pricePerItem,
  region,
}: CalculationInput): CalculationResult => {
  const normalizedQuantity = quantity ?? 0
  const normalizedPrice = pricePerItem ?? 0
  const validatedRegion = assertRegion(region)

  const subtotal = roundCurrency(normalizedQuantity * normalizedPrice)
  const discountRate = getDiscountRate(subtotal)
  const discountAmount = roundCurrency(subtotal * discountRate)
  const discountedSubtotal = roundCurrency(subtotal - discountAmount)
  const taxRate = getTaxRate(validatedRegion)
  const taxAmount = roundCurrency(discountedSubtotal * taxRate)
  const total = roundCurrency(discountedSubtotal + taxAmount)

  return {
    subtotal,
    discountRate,
    discountAmount,
    discountedSubtotal,
    taxRate,
    taxAmount,
    total,
  }
}

