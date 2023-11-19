import { render } from '@redwoodjs/testing/web'

import DocketSheetsPage from './DocketSheetsPage'

//   Improve this test with help from the Redwood Testing Doc:
//   https://redwoodjs.com/docs/testing#testing-pages-layouts

describe('DocketSheetsPage', () => {
  it('renders successfully', () => {
    expect(() => {
      render(<DocketSheetsPage />)
    }).not.toThrow()
  })
})
