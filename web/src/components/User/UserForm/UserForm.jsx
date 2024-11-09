import { Box, Button } from '@mui/material'
import Grid from '@mui/material/Unstable_Grid2/Grid2'
import { FormContainer } from 'react-hook-form-mui'

import { transformData } from 'src/lib/transforms'

import dayjs from '../../../../../api/src/lib/day'
import { Field } from '../../utils/Field'
import Footer from '../../utils/Footer'
import FormSection from '../../utils/FormSection'

const UserFields = [
  {
    title: 'User Details',
    fields: [
      ['name'],
      ['email'],
      [
        'role',
        {
          field_type: 'select',
          options: ['User', 'Admin'],
        },
      ],
    ],
  },
  {
    title: 'Restrict Access',
    fields: [
      [
        'expiresAt',
        {
          field_type: 'date-time',
          label: 'Expires At',
          helperText: "User's login will be disabled after this date",
        },
      ],
      [
        'actions',
        {
          field_type: 'select',
          multiple: true,
          query: {
            model: 'action',
            orderBy: {
              start_date: 'desc',
            },
            searchField: 'name',
          },
          storeFullObject: true,
          autocompleteProps: {
            getOptionLabel: (option) => {
              const date = dayjs(option.start_date).format('L LT')
              return `${option.name} (${date})`
            },
          },
          helperText:
            'User will not have access to arrests outside of these actions',
        },
      ],
      [
        'arrest_date_min',
        {
          field_type: 'date',
          label: 'Minimum Arrest Date',
          helperText: 'User will not have access to arrests before this date',
        },
      ],
      [
        'arrest_date_max',
        {
          field_type: 'date',
          label: 'Maximum Arrest Date',
          helperText: 'User will not have access to arrests after this date',
        },
      ],
    ],
  },
]

const UserForm = ({ user, onSave, loading, error }) => {
  const values = transformData(user || {}, UserFields)

  return (
    <Box>
      <FormContainer
        defaultValues={{
          ...values,
          // expiresAt: values.expiresAt ? dayjs(values.expiresAt) : null,
        }}
        onSuccess={(data) => onSave(data, user?.id)}
      >
        <Grid
          sx={{ pb: 8 }}
          container
          spacing={4}
          className="content-container"
        >
          <Grid xs={12} container>
            {UserFields.map(({ fields, title }, groupIndex) => (
              <FormSection key={groupIndex} title={title}>
                <Grid container spacing={2}>
                  {fields.map(([key, options = {}]) => (
                    <Grid xs={options.span || 12} key={key}>
                      <Field name={key} {...options} />
                    </Grid>
                  ))}
                </Grid>
              </FormSection>
            ))}
          </Grid>
        </Grid>
        <Footer>
          <Grid xs sx={{ textAlign: 'right' }}>
            <Button
              type="submit"
              variant="contained"
              color="secondary"
              size="small"
            >
              Save User
            </Button>
          </Grid>
        </Footer>
      </FormContainer>
    </Box>
  )
}

export default UserForm
