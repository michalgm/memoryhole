import { render } from '@redwoodjs/testing/web'

import HotlineLogsPage from './HotlineLogsPage'

//   Improve this test with help from the Redwood Testing Doc:
//   https://redwoodjs.com/docs/testing#testing-pages-layouts

describe('HotlineLogsPage', () => {
  it('renders successfully', () => {
    expect(() => {
      render(<HotlineLogsPage />)
    }).not.toThrow()
  })
})
