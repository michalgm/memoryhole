import { render } from 'src/setupTests'

import { SnackBarProvider } from '../utils/SnackBar'

import { Empty, Failure, Loading, Success } from './ArrestsCell'
import { standard } from './ArrestsCell.mock'

// Generated boilerplate tests do not account for all circumstances
// and can fail without adjustments, e.g. Float and DateTime types.
//           Please refer to the RedwoodJS Testing Docs:
//        https://redwoodjs.com/docs/testing#testing-cells
// https://redwoodjs.com/docs/testing#jest-expect-type-considerations

describe('ArrestsCell', () => {
  mockGraphQLQuery('FindTableViews', () => {
    return {
      tableViews: [
        {
          id: '1',
          name: 'Test View',
          updated_by_id: 1,
          updated_at: '2023-11-10T12:00:00Z',
          created_at: '2023-11-10T12:00:00Z',
          created_by_id: 1,
          state: '',
          type: 'table',
        },
      ],
    }
  })
  it('renders Loading successfully', () => {
    expect(() => {
      render(<Loading />)
    }).not.toThrow()
  })

  it('renders Empty successfully', async () => {
    expect(() => {
      render(<Empty />)
    }).not.toThrow()
  })

  it('renders Failure successfully', async () => {
    expect(() => {
      render(<Failure error={new Error('Oh no')} />)
    }).not.toThrow()
  })

  // When you're ready to test the actual output of your component render
  // you could test that, for example, certain text is present:
  //
  // 1. import { screen } from '@redwoodjs/testing/web'
  // 2. Add test: expect(screen.getByText('Hello, world')).toBeInTheDocument()

  it('renders Success successfully', async () => {
    expect(() => {
      render(
        <SnackBarProvider>
          <Success arrests={standard().arrests} />
        </SnackBarProvider>
      )
    }).not.toThrow()
  })
})
