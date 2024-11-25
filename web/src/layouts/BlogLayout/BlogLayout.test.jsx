import { RouterContextProvider } from '@redwoodjs/router/dist/router-context'
import { render } from '@redwoodjs/testing/web'

import { SnackBarProvider } from 'src/components/utils/SnackBar'
import AppProvider from 'src/lib/AppContext'

import BlogLayout from './BlogLayout'
// import mockUser from './BlogLayout.mock'
//   Improve this test with help from the Redwood Testing Doc:
//   https://redwoodjs.com/docs/testing#testing-pages-layouts

describe('BlogLayout', () => {
  it('renders successfully', () => {
    expect(async () => {
      render(
        <AppProvider>
          <SnackBarProvider>
            <RouterContextProvider>
              <BlogLayout />
            </RouterContextProvider>
          </SnackBarProvider>
        </AppProvider>
      )
    }).not.toThrow()
  })
})
