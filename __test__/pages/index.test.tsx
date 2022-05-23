import { render, screen } from '@testing-library/react'
//import '@testing-library/jest-dom/extend-expect'
import Home from '../../pages/index'

describe('Home', () => {
  it('Should render name', () => {
    const container = render(<Home />)
    expect(screen.getByText('tran0826')).toBeInTheDocument()

    expect(container).toMatchSnapshot()
  })
})