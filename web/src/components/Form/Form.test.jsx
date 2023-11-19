import { render } from '@redwoodjs/testing/web'

import Form from './Form'

//   Improve this test with help from the Redwood Testing Doc:
//    https://redwoodjs.com/docs/testing#testing-components

describe('Form', () => {
  it('renders successfully', () => {
    expect(() => {
      render(<Form />)
    }).not.toThrow()
  })
})
