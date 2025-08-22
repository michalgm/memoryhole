import { useState } from 'react'

import { Grid2 } from '@mui/material'
import { Stack } from '@mui/system'

import DocketSheetCell from 'src/components/DocketSheetCell/DocketSheetCell'
import Form from 'src/components/Form/Form'
import { Field } from 'src/components/utils/Field'
import FormSection from 'src/components/utils/FormSection'
import { schema } from 'src/lib/FieldSchemas'

import dayjs from '../../../../api/src/lib/day'

const DocketSheetsPage = () => {
  const [search, setSearch] = useState({
    days: 1,
    report_type: 'court_date',
    date: dayjs().startOf('day'),
    jurisdiction: '',
    arrest_city: '',
    include_contact: false,
  })
  // const days = 1
  const onSubmit = (data) => {
    setSearch(data)
  }
  const jurisdictions = schema['jurisdiction'].props.options
  return (
    <Stack spacing={4} sx={{ mb: 3 }}>
      <FormSection title={'Docket Sheet Search'}>
        <Form
          defaultValues={search}
          onSubmit={onSubmit}
          submitText="Create Docket Sheet"
        >
          <Grid2 container spacing={2} sx={{ m: 0 }} size={12}>
            <Grid2 size={6}>
              <Field
                field_type="select"
                name="jurisdiction"
                options={jurisdictions}
                // fullWidth={false}
              />
            </Grid2>
            <Grid2 alignContent={'center'} size={4}>
              <Field
                field_type="radio"
                label={'Report Type'}
                row={true}
                name="report_type"
                options={['arrest_date', 'court_date']}
              />
            </Grid2>
            <Grid2 size={6}>
              <Field
                field_type="select"
                name="arrest_city"
                options={schema['arrest_city'].props.options}
                // fullWidth={false}
              />
            </Grid2>

            <Grid2 size={4}>
              <Field field_type="date" name="date" required />
            </Grid2>
            <Grid2 size={6}>
              <Field
                field_type="checkbox"
                name="include_contact"
                label="Include Arrestee Contact Info"
              />
            </Grid2>

            <Grid2 size={4}>
              <Field
                field_type="text"
                type="number"
                name="days"
                helperText="Number of days after date to include"
                // fullWidth={false}
              />
            </Grid2>
          </Grid2>
        </Form>
      </FormSection>
      <DocketSheetCell
        date={dayjs(search.date).startOf('day')}
        days={search.days}
        jurisdiction={search.jurisdiction}
        arrest_city={search.arrest_city}
        report_type={search.report_type}
        include_contact={search.include_contact}
      />
    </Stack>
  )
}

export default DocketSheetsPage
