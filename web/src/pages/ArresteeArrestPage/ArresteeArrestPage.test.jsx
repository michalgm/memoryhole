import ArresteeArrestPage from './ArresteeArrestPage'
import { render } from '@redwoodjs/testing/web'

//   Improve this test with help from the Redwood Testing Doc:
//   https://redwoodjs.com/docs/testing#testing-pages-layouts

describe('ArresteeArrestPage', () => {
  it('renders successfully', () => {
    expect(() => {
      render(<ArresteeArrestPage id={1} />)
    }).not.toThrow()
  })
})
