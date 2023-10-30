import BlogLayout from './BlogLayout'
import mockUser from './BlogLayout.mock'
import { render } from '@redwoodjs/testing/web'

//   Improve this test with help from the Redwood Testing Doc:
//   https://redwoodjs.com/docs/testing#testing-pages-layouts

describe('BlogLayout', () => {
  it('renders successfully', () => {
    mockCurrentUser({id: 1, name: 'Rob' })
    expect(async() => {
      render(<BlogLayout/>)
    }).not.toThrow()
  })
})
