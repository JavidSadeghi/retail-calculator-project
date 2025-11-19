import { render, screen } from '@testing-library/react'
import App from './App'

describe('App', () => {
  it('renders the calculator heading and form controls', () => {
    render(<App />)
    expect(
      screen.getByRole('heading', { name: /retail calculator/i }),
    ).toBeInTheDocument()
    expect(screen.getByLabelText(/quantity/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/region/i)).toBeInTheDocument()
  })
})

