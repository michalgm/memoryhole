import { render } from '@redwoodjs/testing/web'

import { SnackBarProvider } from 'src/components/utils/SnackBar'
import AppProvider from 'src/lib/AppContext'

import ArresteeArrestPage from './ArresteeArrestPage'
//   Improve this test with help from the Redwood Testing Doc:
//   https://redwoodjs.com/docs/testing#testing-pages-layouts

describe('ArresteeArrestPage', () => {
  it('renders successfully', () => {
    expect(() => {
      render(
        <AppProvider>
          <SnackBarProvider>
            <ArresteeArrestPage id={1} />
          </SnackBarProvider>
        </AppProvider>
      )
    }).not.toThrow()
  })
})
