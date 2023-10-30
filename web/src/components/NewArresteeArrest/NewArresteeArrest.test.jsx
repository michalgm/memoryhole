import { render } from '@redwoodjs/testing/web'

import NewArresteeArrest from './NewArresteeArrest'

//   Improve this test with help from the Redwood Testing Doc:
//    https://redwoodjs.com/docs/testing#testing-components

describe('NewArresteeArrest', () => {
  it('renders successfully', () => {
    expect(() => {
      render(<NewArresteeArrest />)
    }).not.toThrow()
  })
})
