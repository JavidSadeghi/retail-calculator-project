import { render, screen } from '@testing-library/react'
import App from './App'

describe('App', () => {
  it('renders the retail calculator placeholder', () => {
    render(<App />)
    expect(
      screen.getByRole('heading', { name: /retail calculator/i }),
    ).toBeInTheDocument()
    expect(
      screen.getByText(/take-home exercise/i),
    ).toBeInTheDocument()
  })
})

