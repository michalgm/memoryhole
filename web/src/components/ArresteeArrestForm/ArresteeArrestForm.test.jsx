import { render } from '@redwoodjs/testing/web'

import ArresteeArrestForm from './ArresteeArrestForm'

//   Improve this test with help from the Redwood Testing Doc:
//    https://redwoodjs.com/docs/testing#testing-components

describe('ArresteeArrestForm', () => {
  it('renders successfully', () => {
    expect(() => {
      render(<ArresteeArrestForm />)
    }).not.toThrow()
  })
})
