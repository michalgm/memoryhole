import { render } from '@redwoodjs/testing/web'

import EditOptionsPage from './EditOptionsPage'

//   Improve this test with help from the Redwood Testing Doc:
//   https://redwoodjs.com/docs/testing#testing-pages-layouts

describe('EditOptionsPage', () => {
  it('renders successfully', () => {
    expect(() => {
      render(<EditOptionsPage />)
    }).not.toThrow()
  })
})
