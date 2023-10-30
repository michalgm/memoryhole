import ArresteeArrest from './ArresteeArrest'
import { render } from '@redwoodjs/testing/web'
import { standard } from './ArresteeArrest.mock'

//   Improve this test with help from the Redwood Testing Doc:
//    https://redwoodjs.com/docs/testing#testing-components

describe('ArresteeArrest', () => {
  it('renders successfully', () => {
    expect(() => {
      render(<ArresteeArrest {...standard()}/>)
    }).not.toThrow()
  })
})
