import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Calculator } from './Calculator'

const setup = () => {
  render(<Calculator />)
  const quantityInput = screen.getByLabelText(/quantity/i)
  const priceInput = screen.getByLabelText(/price per item/i)
  const regionSelect = screen.getByLabelText(/region/i)
  const submitButton = screen.getByRole('button', { name: /calculate/i })

  return { quantityInput, priceInput, regionSelect, submitButton }
}

describe('Calculator', () => {
  afterEach(() => {
    window.localStorage.clear()
  })

  it('displays error when region is not selected', async () => {
    const user = userEvent.setup()
    const { quantityInput, priceInput, submitButton } = setup()

    await user.type(quantityInput, '100')
    await user.type(priceInput, '25')
    await user.click(submitButton)

    expect(screen.getByText(/please select a region/i)).toBeInTheDocument()
  })

  it('calculates totals when inputs are valid', async () => {
    const user = userEvent.setup()
    const { quantityInput, priceInput, regionSelect, submitButton } = setup()

    await user.clear(quantityInput)
    await user.type(quantityInput, '50')
    await user.clear(priceInput)
    await user.type(priceInput, '200')
    await user.selectOptions(regionSelect, 'AUK')
    await user.click(submitButton)

    expect(await screen.findByText(/grand total/i)).toBeInTheDocument()
    expect(screen.getByText(/\$9,616\.50/)).toBeInTheDocument()
  })

  it('prefills inputs from localStorage and shows result', () => {
    window.localStorage.setItem(
      'retail-calculator:form',
      JSON.stringify({ quantity: '5', pricePerItem: '1000', region: 'WAI' }),
    )

    render(<Calculator />)

    expect(screen.getByLabelText(/quantity/i)).toHaveValue(5)
    expect(screen.getByLabelText(/price per item/i)).toHaveValue(1000)
    expect(screen.getByLabelText(/region/i)).toHaveValue('WAI')
    expect(screen.getByText(/\$5,046\.88/)).toBeInTheDocument()
  })

  it('stores form changes to localStorage', async () => {
    const user = userEvent.setup()
    render(<Calculator />)

    const quantityInput = screen.getByLabelText(/quantity/i)
    await user.type(quantityInput, '3')
    expect(JSON.parse(window.localStorage.getItem('retail-calculator:form') ?? '{}').quantity).toBe('3')
  })
})

