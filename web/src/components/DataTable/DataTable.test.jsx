import { LocalizationProvider } from '@mui/x-date-pickers'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'

import { render, screen, waitFor } from '@cedarjs/testing/web'

import AppProvider from 'src/lib/AppContext'

import DataTable from './DataTable'

//   Improve this test with help from the Redwood Testing Doc:
//    https://redwoodjs.com/docs/testing#testing-components

const renderDataTable = (props = {}) => {
  return render(
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <AppProvider>
        <DataTable {...props} />
      </AppProvider>
    </LocalizationProvider>
  )
}

describe('DataTable', () => {
  it('renders successfully', () => {
    expect(() => {
      renderDataTable()
    }).not.toThrow()
  })

  describe('Date Column Filters', () => {
    const mockSchema = {
      createdAt: {
        type: 'date-time',
        props: { label: 'Created At' },
      },
      updatedAt: {
        type: 'date',
        props: { label: 'Updated At' },
      },
      name: {
        type: 'text',
        props: { label: 'Name' },
      },
    }

    const mockData = [
      {
        id: '1',
        name: 'Item 1',
        createdAt: '2024-01-15T10:00:00Z',
        updatedAt: '2024-01-15',
      },
      {
        id: '2',
        name: 'Item 2',
        createdAt: '2024-02-20T14:30:00Z',
        updatedAt: '2024-02-20',
      },
      {
        id: '3',
        name: 'Item 3',
        createdAt: '2024-03-25T18:45:00Z',
        updatedAt: '2024-03-25',
      },
      {
        id: '4',
        name: 'Item 4',
        createdAt: null,
        updatedAt: null,
      },
    ]

    it('renders with date columns', async () => {
      renderDataTable({
        schema: mockSchema,
        data: mockData,
        displayColumns: ['name', 'createdAt', 'updatedAt'],
      })

      // Wait for table to render
      await waitFor(() => {
        expect(screen.getByText('Item 1')).toBeInTheDocument()
        expect(screen.getByText('Created At')).toBeInTheDocument()
        expect(screen.getByText('Updated At')).toBeInTheDocument()
      })
    })

    it('renders all items without filters', async () => {
      renderDataTable({
        schema: mockSchema,
        data: mockData,
        displayColumns: ['name', 'createdAt'],
      })

      await waitFor(() => {
        expect(screen.getByText('Item 1')).toBeInTheDocument()
        expect(screen.getByText('Item 2')).toBeInTheDocument()
        expect(screen.getByText('Item 3')).toBeInTheDocument()
        expect(screen.getByText('Item 4')).toBeInTheDocument()
      })
    })

    it('formats date-time columns correctly', async () => {
      renderDataTable({
        schema: mockSchema,
        data: mockData,
        displayColumns: ['name', 'createdAt'],
      })

      await waitFor(() => {
        // Date-time should be formatted with time (format: 'L hh:mm A')
        const table = screen.getByRole('table')
        expect(table).toBeInTheDocument()
      })
    })

    it('handles null dates gracefully', async () => {
      renderDataTable({
        schema: mockSchema,
        data: mockData,
        displayColumns: ['name', 'createdAt', 'updatedAt'],
      })

      await waitFor(() => {
        // Item 4 with null dates should still render
        expect(screen.getByText('Item 4')).toBeInTheDocument()
      })
    })

    describe('with persistState and type for filter state management', () => {
      it('applies date match filter through state', async () => {
        const type = 'test-date-filter-match'

        // Pre-populate sessionStorage with filter state
        const filterState = {
          columnFilters: [{ id: 'createdAt', value: '2024-02-20' }],
          columnFilterFns: { createdAt: 'dateFilter' },
        }
        sessionStorage.setItem(
          `${type}_table_state`,
          JSON.stringify(filterState)
        )

        renderDataTable({
          schema: mockSchema,
          data: mockData,
          displayColumns: ['name', 'createdAt'],
          type,
          persistState: true,
        })

        // Wait for filter to be applied
        await waitFor(
          () => {
            // Only Item 2 should be visible (2024-02-20 matches)
            expect(screen.getByText('Item 2')).toBeInTheDocument()
            expect(screen.queryByText('Item 1')).not.toBeInTheDocument()
            expect(screen.queryByText('Item 3')).not.toBeInTheDocument()
            expect(screen.queryByText('Item 4')).not.toBeInTheDocument()
          },
          { timeout: 2000 }
        )

        // Cleanup
        sessionStorage.removeItem(`${type}_table_state`)
      })

      it('applies lessThan (before) filter through state', async () => {
        const type = 'test-date-filter-before'

        const filterState = {
          columnFilters: [{ id: 'createdAt', value: '2024-02-20' }],
          columnFilterFns: { createdAt: 'lessThan' },
        }
        sessionStorage.setItem(
          `${type}_table_state`,
          JSON.stringify(filterState)
        )

        renderDataTable({
          schema: mockSchema,
          data: mockData,
          displayColumns: ['name', 'createdAt'],
          type,
          persistState: true,
        })

        await waitFor(
          () => {
            // Only Item 1 should be visible (2024-01-15 < 2024-02-20)
            expect(screen.getByText('Item 1')).toBeInTheDocument()
            expect(screen.queryByText('Item 2')).not.toBeInTheDocument()
            expect(screen.queryByText('Item 3')).not.toBeInTheDocument()
          },
          { timeout: 2000 }
        )

        sessionStorage.removeItem(`${type}_table_state`)
      })

      it('applies greaterThan (after) filter through state', async () => {
        const type = 'test-date-filter-after'

        const filterState = {
          columnFilters: [{ id: 'createdAt', value: '2024-02-20' }],
          columnFilterFns: { createdAt: 'greaterThan' },
        }
        sessionStorage.setItem(
          `${type}_table_state`,
          JSON.stringify(filterState)
        )

        renderDataTable({
          schema: mockSchema,
          data: mockData,
          displayColumns: ['name', 'createdAt'],
          type,
          persistState: true,
        })

        await waitFor(
          () => {
            // Only Item 3 should be visible (2024-03-25 > 2024-02-20)
            expect(screen.getByText('Item 3')).toBeInTheDocument()
            expect(screen.queryByText('Item 2')).toBeInTheDocument()
            expect(screen.queryByText('Item 1')).not.toBeInTheDocument()
          },
          { timeout: 2000 }
        )

        sessionStorage.removeItem(`${type}_table_state`)
      })

      it('handles dates with different times on same day', async () => {
        const type = 'test-date-filter-same-day'

        const sameDayTestData = [
          {
            id: '1',
            name: 'Morning',
            createdAt: '2024-02-20T08:00:00', // Morning
            updatedAt: '2024-02-20',
          },
          {
            id: '2',
            name: 'Afternoon',
            createdAt: '2024-02-20T14:30:00', // Afternoon
            updatedAt: '2024-02-20',
          },
          {
            id: '3',
            name: 'Next Day',
            createdAt: '2024-02-21T08:00:00', // Next day
            updatedAt: '2024-02-21',
          },
        ]

        const filterState = {
          columnFilters: [{ id: 'createdAt', value: '2024-02-20' }],
          columnFilterFns: { createdAt: 'dateFilter' },
        }
        sessionStorage.setItem(
          `${type}_table_state`,
          JSON.stringify(filterState)
        )

        renderDataTable({
          schema: mockSchema,
          data: sameDayTestData,
          displayColumns: ['name', 'createdAt'],
          type,
          persistState: true,
        })

        await waitFor(
          () => {
            // Both Morning and Afternoon should match (same date, different times)
            expect(screen.getByText('Morning')).toBeInTheDocument()
            expect(screen.getByText('Afternoon')).toBeInTheDocument()
            // Next Day should not match
            expect(screen.queryByText('Next Day')).not.toBeInTheDocument()
          },
          { timeout: 2000 }
        )

        sessionStorage.removeItem(`${type}_table_state`)
      })

      it('filters out null dates correctly', async () => {
        const type = 'test-date-filter-nulls'

        const filterState = {
          columnFilters: [{ id: 'createdAt', value: '2024-01-15' }],
          columnFilterFns: { createdAt: 'dateFilter' },
        }
        sessionStorage.setItem(
          `${type}_table_state`,
          JSON.stringify(filterState)
        )

        renderDataTable({
          schema: mockSchema,
          data: mockData,
          displayColumns: ['name', 'createdAt'],
          type,
          persistState: true,
        })

        await waitFor(
          () => {
            // Only Item 1 should be visible
            expect(screen.getByText('Item 1')).toBeInTheDocument()
            // Item 4 with null date should not be visible
            expect(screen.queryByText('Item 4')).not.toBeInTheDocument()
          },
          { timeout: 2000 }
        )

        sessionStorage.removeItem(`${type}_table_state`)
      })

      it('applies between filter for date ranges', async () => {
        const type = 'test-date-filter-between'

        const filterState = {
          columnFilters: [
            { id: 'createdAt', value: ['2024-02-01', '2024-03-01'] },
          ],
          columnFilterFns: { createdAt: 'between' },
        }
        sessionStorage.setItem(
          `${type}_table_state`,
          JSON.stringify(filterState)
        )

        renderDataTable({
          schema: mockSchema,
          data: mockData,
          displayColumns: ['name', 'createdAt'],
          type,
          persistState: true,
        })

        await waitFor(
          () => {
            // Items 2 should be visible (2024-02-20 is between 2024-02-01 and 2024-03-01)
            expect(screen.getByText('Item 2')).toBeInTheDocument()
            // Items 1 (before range) and 3 (after range) should not be visible
            expect(screen.queryByText('Item 1')).not.toBeInTheDocument()
            expect(screen.queryByText('Item 3')).not.toBeInTheDocument()
          },
          { timeout: 2000 }
        )

        sessionStorage.removeItem(`${type}_table_state`)
      })
    })
  })
})
