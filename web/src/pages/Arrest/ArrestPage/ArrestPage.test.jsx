import { render } from '@redwoodjs/testing/web'

import { SnackBarProvider } from 'src/components/utils/SnackBar'
import AppProvider from 'src/lib/AppContext'

import ArrestPage from './ArrestPage'
//   Improve this test with help from the Redwood Testing Doc:
//   https://redwoodjs.com/docs/testing#testing-pages-layouts

describe('ArrestPage', () => {
  it('renders successfully', () => {
    expect(() => {
      render(
        <AppProvider>
          <SnackBarProvider>
            <ArrestPage id={1} />
          </SnackBarProvider>
        </AppProvider>
      )
    }).not.toThrow()
  })
})
