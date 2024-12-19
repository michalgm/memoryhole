import { useState } from 'react'

import { Grid2, Paper, Typography } from '@mui/material'

import DocketSheetCell from 'src/components/DocketSheetCell/DocketSheetCell'
import Form from 'src/components/Form/Form'
import { Field } from 'src/components/utils/Field'
import { schema } from 'src/lib/FieldSchemas'

import dayjs from '../../../../api/src/lib/day'

const DocketSheetsPage = () => {
  const [search, setSearch] = useState({
    days: 1,
    report_type: 'court_date',
    date: dayjs().startOf('day'),
    jurisdiction: '',
    include_contact: false,
  })
  // const days = 1
  const onSubmit = (data) => {
    setSearch(data)
  }
  const jurisdictions = schema['jurisdiction'].props.options
  return (
    <>
      <Paper sx={{ mb: 6, p: 2 }}>
        <Typography variant="h4" gutterBottom>
          Docket Sheets
        </Typography>
        <Grid2 container sx={{ p: 4 }} spacing={4} xs={6} xsOffset={3}>
          <Form
            defaultValues={search}
            onSubmit={onSubmit}
            submitText="Create Docket Sheet"
          >
            <Grid2 xs={6}>
              <Field
                field_type="select"
                name="jurisdiction"
                options={jurisdictions}
                required
                // fullWidth={false}
              />
            </Grid2>
            <Grid2 xs={6} alignContent={'center'}>
              <Field
                field_type="radio"
                label={'Report Type'}
                row={true}
                name="report_type"
                options={['arrest_date', 'court_date']}
              />
            </Grid2>
            <Grid2 xs={6}>
              <Field field_type="date" name="date" required />
            </Grid2>

            <Grid2 xs={6}>
              <Field
                field_type="text"
                type="number"
                name="days"
                helperText="Number of days after date to include"
                fullWidth={false}
              />
            </Grid2>
            <Grid2 xs={12}>
              <Field
                field_type="checkbox"
                name="include_contact"
                label="Include Arrestee Contact Info"
              />
            </Grid2>
          </Form>
        </Grid2>
      </Paper>
      <DocketSheetCell
        date={dayjs(search.date).startOf('day')}
        days={search.days}
        jurisdiction={search.jurisdiction}
        report_type={search.report_type}
        include_contact={search.include_contact}
      />
    </>
  )
}

export default DocketSheetsPage
