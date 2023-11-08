import ArresteeArrestForm from './ArresteeArrestForm.1'
import { render } from '@redwoodjs/testing/web'

//   Improve this test with help from the Redwood Testing Doc:
//    https://redwoodjs.com/docs/testing#testing-components

describe('ArresteeArrestForm', () => {
  it('renders successfully', () => {
    expect(() => {
      render(<ArresteeArrestForm />)
    }).not.toThrow()
  })
})
