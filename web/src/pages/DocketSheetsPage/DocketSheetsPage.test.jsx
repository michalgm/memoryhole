import { LocalizationProvider } from '@mui/x-date-pickers'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'

import { render } from '@cedarjs/testing/web'

import { SnackBarProvider } from 'src/components/utils/SnackBar'

import DocketSheetsPage from './DocketSheetsPage'

//   Improve this test with help from the Redwood Testing Doc:
//   https://redwoodjs.com/docs/testing#testing-pages-layouts

describe('DocketSheetsPage', () => {
  it('renders successfully', () => {
    expect(() => {
      render(
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <SnackBarProvider>
            <DocketSheetsPage />
          </SnackBarProvider>
        </LocalizationProvider>
      )
    }).not.toThrow()
  })
})
