import {
  tableViews,
  tableView,
  createTableView,
  updateTableView,
  deleteTableView,
} from './tableViews'

// Generated boilerplate tests do not account for all circumstances
// and can fail without adjustments, e.g. Float.
//           Please refer to the RedwoodJS Testing Docs:
//       https://redwoodjs.com/docs/testing#testing-services
// https://redwoodjs.com/docs/testing#jest-expect-type-considerations

describe('tableViews', () => {
  scenario('returns all tableViews', async (scenario) => {
    const result = await tableViews()

    expect(result.length).toEqual(Object.keys(scenario.tableView).length)
  })

  scenario('returns a single tableView', async (scenario) => {
    const result = await tableView({ id: scenario.tableView.one.id })

    expect(result).toEqual(scenario.tableView.one)
  })

  scenario('creates a tableView', async () => {
    const result = await createTableView({
      input: { name: 'String', state: 'String', type: 'String' },
    })

    expect(result.name).toEqual('String')
    expect(result.state).toEqual('String')
    expect(result.type).toEqual('String')
  })

  scenario('updates a tableView', async (scenario) => {
    const original = await tableView({
      id: scenario.tableView.one.id,
    })
    const result = await updateTableView({
      id: original.id,
      input: { name: 'String2' },
    })

    expect(result.name).toEqual('String2')
  })

  scenario('deletes a tableView', async (scenario) => {
    const original = await deleteTableView({
      id: scenario.tableView.one.id,
    })
    const result = await tableView({ id: original.id })

    expect(result).toEqual(null)
  })
})
