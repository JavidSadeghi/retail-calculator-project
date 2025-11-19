import {
  calculateTotals,
  getDiscountRate,
  getTaxRate,
  PricingError,
  REGION_TAX_RATES,
  type RegionCode,
} from './pricing'

describe('getDiscountRate', () => {
  it('returns 0 when subtotal is below the minimum threshold', () => {
    expect(getDiscountRate(999.99)).toBe(0)
  })

  it('returns the correct bracket rate for each threshold', () => {
    expect(getDiscountRate(1_000)).toBeCloseTo(0.03)
    expect(getDiscountRate(5_500)).toBeCloseTo(0.05)
    expect(getDiscountRate(7_250)).toBeCloseTo(0.07)
    expect(getDiscountRate(12_000)).toBeCloseTo(0.1)
    expect(getDiscountRate(75_000)).toBeCloseTo(0.15)
  })
})

describe('getTaxRate', () => {
  it('returns the configured tax rate for a region', () => {
    expect(getTaxRate('AUK')).toBe(REGION_TAX_RATES.AUK)
  })
})

describe('calculateTotals', () => {
  const input = {
    quantity: 10,
    pricePerItem: 1500,
    region: 'WAI' as RegionCode,
  }

  it('computes subtotal, discount, tax, and total with rounding to 2 decimals', () => {
    const result = calculateTotals(input)

    expect(result.subtotal).toBe(15_000)
    expect(result.discountRate).toBeCloseTo(0.1)
    expect(result.discountAmount).toBe(1_500)
    expect(result.discountedSubtotal).toBe(13_500)
    expect(result.taxRate).toBeCloseTo(0.0625)
    expect(result.taxAmount).toBe(843.75)
    expect(result.total).toBe(14_343.75)
  })

  it('throws when region is missing', () => {
    expect(() =>
      calculateTotals({
        quantity: 1,
        pricePerItem: 100,
        region: '',
      }),
    ).toThrow(new PricingError('Region selection is required.', 'REGION_REQUIRED'))
  })

  it('throws when region is invalid', () => {
    expect(() =>
      calculateTotals({
        quantity: 1,
        pricePerItem: 100,
        region: 'NYC',
      }),
    ).toThrow(new PricingError("Region 'NYC' is not supported.", 'REGION_INVALID'))
  })

  it('rounds fractional values to two decimals', () => {
    const result = calculateTotals({
      quantity: 3,
      pricePerItem: 1234.567,
      region: 'CHC',
    })

    expect(result.subtotal).toBe(3703.7)
    expect(result.discountAmount).toBe(111.11)
    expect(result.discountedSubtotal).toBe(3592.59)
    expect(result.taxAmount).toBe(143.7)
    expect(result.total).toBe(3736.29)
  })
})

