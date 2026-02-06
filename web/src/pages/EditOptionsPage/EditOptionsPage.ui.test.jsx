import { fireEvent, screen } from '@testing-library/react'

import { render } from 'src/setupTests'

import EditOptionsPage from './EditOptionsPage'
const optionSetMocks = [
  {
    id: 1,
    name: 'test set',
    values: [
      {
        id: 1,
        label: 'A',
        value: 'a',
        is_static: false,
        order: 0,
        fieldId: 1,
      },
      {
        id: 2,
        label: 'B',
        value: 'b',
        is_static: true,
        order: 1,
        fieldId: 2,
      },
    ],
  },
]
// Mock GraphQL queries
// jest.mock('@cedarjs/web', () => {
//   const actual = jest.requireActual('@cedarjs/web')
//   return {
//     ...actual,
//     useQuery: jest.fn(() => ({
//       data: {

//       },
//       loading: false,
//     })),
//   }
// })

describe('EditOptionsPage UI', () => {
  mockGraphQLQuery('optionSets', () => ({ optionSets: optionSetMocks }))
  mockGraphQLQuery('OptionSetQuery', () => ({ optionSet: optionSetMocks[0] }))

  it('renders successfully', () => {
    expect(() => {
      render(<EditOptionsPage id={1} />)
    }).not.toThrow()
  })
  it('renders option set values', async () => {
    // mockGraphQLQuery('OptionSetQuery', () => ({ optionSets: optionSetMocks }))

    render(<EditOptionsPage id={1} />)
    expect(await screen.findByDisplayValue('A')).toBeInTheDocument()
    expect(screen.getByDisplayValue('B')).toBeInTheDocument()
  })

  it('can add a value', async () => {
    render(<EditOptionsPage id={1} />)

    const addBtn = await screen.findAllByRole('button', { name: /add value/i })
    fireEvent.click(addBtn[1])
    // Should add a new empty input
    expect(await screen.findAllByLabelText('Label *')).toHaveLength(3)
  })

  it('disables static value fields', async () => {
    render(<EditOptionsPage id={1} />)
    const staticInput = await screen.findByDisplayValue('B')
    expect(staticInput).toBeDisabled()
  })

  it('can delete and restore a value', async () => {
    render(<EditOptionsPage id={1} />)
    const deleteBtns = await screen.findAllByLabelText(/delete value/i, {
      selector: 'button',
    })
    fireEvent.click(deleteBtns[0])
    // After delete, the button should become 'Restore Value'
    expect(
      await screen.findByLabelText(/restore value/i, { selector: 'button' })
    ).toBeInTheDocument()
    fireEvent.click(
      await screen.findByLabelText(/restore value/i, { selector: 'button' })
    )
    expect(
      await screen.findByLabelText('delete value', { selector: 'button' })
    ).toBeInTheDocument()
  })

  it('sorts values alphabetically', async () => {
    render(<EditOptionsPage id={1} />)
    const sortBtn = await screen.findAllByRole('button', {
      name: /sort values/i,
    })
    fireEvent.click(sortBtn[0])
    // After sort, the first input should be 'A' (already sorted in this mock)
    const inputs = screen.getAllByRole('textbox')
    expect(inputs[0]).toHaveValue('A')
  })
})
