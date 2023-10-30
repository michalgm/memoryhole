import { render } from '@redwoodjs/testing/web'

import NewArresteeArrestPage from './NewArresteeArrestPage'

//   Improve this test with help from the Redwood Testing Doc:
//   https://redwoodjs.com/docs/testing#testing-pages-layouts

describe('NewArresteeArrestPage', () => {
  it('renders successfully', () => {
    expect(() => {
      render(<NewArresteeArrestPage />)
    }).not.toThrow()
  })
})
